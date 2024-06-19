// Diccionario de componentes
const components = {};
// Variables parametrizables
// Variable global que indica si el debugger está habilitado o no.
let ENABLE_DEBUGGER = false;
let UUID_ATTRIBUTE = "scopejs-component";
// Función para habilitar o deshabilitar el debugger.
export function enableDebugger(bool) {
  // Actualiza el valor de la variable global ENABLE_DEBUGGER con el valor proporcionado.
  ENABLE_DEBUGGER = bool;
}
// Función de registro de mensajes para debugging.
function log(...attr) {
  // Si el debugger no está habilitado, no se ejecuta nada.
  if (!ENABLE_DEBUGGER) return;
  // Imprime los atributos recibidos en la consola.
  console.log(...attr);
}
function getChildren(element) {
  if (element.tagName.toUpperCase() == "SLOT") return getChildren(element.querySelector("slot"));
  const cloned_children = [];
  for (let child of element.children) {
    cloned_children.push(child.cloneNode(true));
  }
  return cloned_children;
}
/**
 * Crea un componente con capacidad de renderizado y control.
 * @param {Object} options - Opciones para configurar el componente.
 * @param {string} options.tagName - Nombre de la etiqueta HTML asociada al componente.
 * @param {Object} options.controller - Controlador del componente.
 * @param {Function} options.render - Función de renderizado del componente.
 * @returns {Object} - Instancia del componente con métodos de renderizado y control.
 */
export function Component({ tagName, controller, render, postRender }) {
  // Crear una instancia del componente.
  const c = new (function Component() {
    /**
     * Función de renderizado del componente.
     * @param {HTMLElement} container - Contenedor donde se renderizará el componente.
     * @returns {Object} - Instancia del componente con métodos de renderizado y control.
     */
    this.render = function (container = document.createElement("div"), children = []) {
      const uuid = container.getAttribute(UUID_ATTRIBUTE) ?? crypto.randomUUID();

      /**
       * Actualiza los hijos de un contenedor DOM basándose en un clon proporcionado.
       *
       * @param {HTMLElement} container El contenedor cuyos hijos se actualizarán.
       * @param {HTMLElement} clone El clon que contiene la estructura actualizada de los hijos.
       */
      function updateDomChildren(container, clone) {
        if (container.getAttribute(UUID_ATTRIBUTE) && container.getAttribute(UUID_ATTRIBUTE) != uuid) return;

        const originalChildren = container.childNodes;
        const updatedChildren = clone.childNodes;

        const maxLength = Math.max(originalChildren.length, updatedChildren.length);

        let style = document.querySelector("style[scopejs]");
        if (!style) {
          style = document.createElement("style");
          style.setAttribute("scopejs", "1");
          style.innerHTML = `::view-transition-old(*), ::view-transition-new(*) { animation-timing-function: ease-in-out; animation-duration: 0.25s; }`;
          document.head.appendChild(style);
        }

        for (let i = 0; i < maxLength; i++) {
          const updatedChild = updatedChildren[i];
          if (!updatedChild) continue;
          if (!updatedChild.hasAttribute || !updatedChild.hasAttribute("id")) continue;

          const id = updatedChild.getAttribute("id");
          // Verifica si la regla CSS ya existe en el estilo
          if (style.innerHTML.includes(`#${id}`)) continue;

          style.innerHTML += `#${id} { view-transition-name: ${id}; } ::view-transition-group(${id}) { animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); animation-duration: 0.5s; }`;
        }

        for (let i = 0; i < maxLength; i++) {
          const originalChild = originalChildren[i];
          const updatedChild = updatedChildren[i];

          if (!originalChild && updatedChild) {
            const newElement = updatedChild.cloneNode(true);
            log(uuid, "Añadiendo nuevo elemento", container, newElement);
            container.appendChild(newElement);
          } else if (originalChild && !updatedChild) {
            originalChild.remove();
          } else if (originalChild && updatedChild) {
            if (originalChild.nodeType === Node.TEXT_NODE && updatedChild.nodeType === Node.TEXT_NODE) {
              if (originalChild.textContent.replaceAll(/\s/g, "") !== updatedChild.textContent.replaceAll(/\s/g, "")) {
                log(uuid, "Reemplazando texto", originalChild.textContent, updatedChild.textContent);
                originalChild.textContent = updatedChild.textContent;
              }
            } else {
              if (originalChild.tagName === updatedChild.tagName) {
                for (let attr of originalChild.attributes) {
                  if (attr.name == UUID_ATTRIBUTE) continue;
                  if (updatedChild.hasAttribute(attr.name)) continue;
                  originalChild.removeAttribute(attr.name);
                }
                for (let attr of updatedChild.attributes) {
                  if (attr.name == UUID_ATTRIBUTE) continue;
                  if (!originalChild.hasAttribute(attr.name)) {
                    originalChild.setAttribute(attr.name, attr.value);
                  } else {
                    if (originalChild.getAttribute(attr.name) != attr.value) {
                      originalChild.setAttribute(attr.name, attr.value);
                    }
                  }
                }
                updateDomChildren(originalChild, updatedChild);
              } else {
                // Clona el nodo actualizado
                const clonedNode = updatedChild.cloneNode(true);
                log(uuid, "Reemplazando elemento", originalChild, clonedNode);
                container.replaceChild(clonedNode, originalChild);
              }
            }
          }
        }
      }

      // Función interna para aplicar el renderizado.
      const apply = function () {
        // Renderizar el contenido en el contenedor.

        if (!container) return;

        c._render_times++;

        const clone = container.cloneNode(true);
        clone.innerHTML = render.bind(c)();

        updateDomChildren(container, clone);

        // ngModel
        container.querySelectorAll("*[model]").forEach((el) => {
          const modelName = el.getAttribute("model");
          const spl = modelName.split(".");
          let value = c;
          for (let item of spl) {
            if (!value) continue;
            value = value[item];
          }
          if (value) el.value = value;

          // Aquí se asigna el evento input para que actualice la propiedad correspondiente en tiempo real
          el.addEventListener("input", () => {
            let currentValue = c;
            for (let i = 0; i < spl.length - 1; i++) {
              currentValue = currentValue[spl[i]];
            }
            currentValue[spl[spl.length - 1]] = el.value;
          });
        });

        // Asignar eventos HTML a funciones del controlador.
        for (const htmlEvent of ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"]) {
          container.querySelectorAll(`*[${htmlEvent}]`).forEach((el) => {
            const clickEventName = el.getAttribute(htmlEvent);
            const function_name = clickEventName.split("(")[0];
            const func = c[function_name];

            // Asignar el evento HTML a la función del controlador.
            if (typeof func === "function") {
              el[htmlEvent] = function (event) {
                event.preventDefault();
                let params = { event };
                if (clickEventName.split("(").length > 0) {
                  if (clickEventName.split("(")[1]) {
                    if (clickEventName.split("(")[1].split(")")[0]) {
                      const p = clickEventName.split("(")[1].split(")")[0].split(",");
                      params = {};
                      for (let i = 0; i < p.length; i++) {
                        if (c[p[i]]) {
                          params[i] = c[p[i]];
                        } else {
                          params[i] = eval(p[i]);
                        }
                      }
                      params[p.length] = event;
                    }
                  }
                }
                setTimeout(() => func.apply(c, Object.values(params)), 0);
              };
            }
          });
        }

        // Renderizar hijos dentro del slot.
        container.querySelectorAll("slot").forEach((element) => {
          for (let child of children) element.appendChild(child);
        });

        // Renderizar subcomponentes dentro del contenedor.
        container.querySelectorAll("*").forEach((element) => {
          if (!components[element.tagName.toUpperCase()]) return;
          if (element.hasAttribute(UUID_ATTRIBUTE)) return;
          c.children.push(components[element.tagName.toUpperCase()].render(element, getChildren(element)));
        });

        if (postRender) setTimeout(postRender.bind(c), 100);

        container.dispatchEvent(new Event("change"));

        return container.innerHTML;
      };

      // Crear una instancia del controlador, si se proporciona.
      const c = controller ? new controller() : new (function () {})();

      c.children = [];

      c._render_times = 0;

      for (let name of container.getAttributeNames()) {
        c[name] = container.getAttribute(name);
      }

      container.setAttribute(UUID_ATTRIBUTE, uuid);

      // Agregar la función de renderizado al controlador.
      c.apply = apply;
      apply();

      container.dispatchEvent(new Event("load"));

      // Devolver la instancia del componente.
      return c;
    };
  })();

  // Registrar el componente con su etiqueta HTML, si se proporciona.
  if (tagName) components[tagName.toUpperCase()] = c;

  // Devolver la instancia del componente.
  return c;
}

/**
 * Crea y muestra un modal en la interfaz de usuario.
 * @param {Object} options - Opciones para personalizar el modal.
 * @param {Object} options.controller - Controlador del modal.
 * @param {Function} options.render - Función de renderizado del modal.
 * @param {boolean} options.hideWhenClickOverlay - Indica si el modal debe cerrarse al hacer clic en el fondo.
 * @param {Object} params - Parámetros adicionales para pasar a la función de renderizado del modal.
 */
export function Modal({ controller, render, hideWhenClickOverlay, className, referrer }, params = {}, events = {}) {
  // Estilos predefinidos para el overlay y el modal.
  const MODAL_STYLE = {
    OVERLAY: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999999",
    MODAL: "position: fixed; top: 50%; left: 50%; border-radius: 0.25rem; min-width: 20rem; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); background-color: white; color: black; transition: opacity 0.3s, transform 0.3s; z-index: 999999999",
  };

  // Crear una instancia del componente modal.
  const component = Component({ controller, render });

  // Crear el elemento modal y aplicar estilos.
  const modal = document.createElement("div");
  modal.setAttribute("style", MODAL_STYLE.MODAL);
  if (referrer) {
    const pos = referrer.getBoundingClientRect();
    modal.style.top = `${pos.top + pos.height + 1}px`;
    modal.style.left = `${pos.left + pos.width + 1}px`;
    modal.style.transform = "";
  } else {
    modal.style.opacity = 0;
    modal.style.transform = "translate(-50%, 65%)";
  }

  modal.classList.add("modal");
  if (className) modal.classList.add(className);

  // Función para cerrar el modal.
  const close = function (...attr) {
    if (events.onClose) events.onClose(...attr);
    if (!referrer) {
      modal.style.opacity = 0;
      modal.style.transform = "translate(-50%, 65%)";
      setTimeout(() => {
        overlay.remove();
        modal.remove();
      }, 300);
    } else {
      overlay.remove();
      modal.remove();
    }
  };

  // Renderizar el contenido del modal.
  const componentInstance = component.render(modal);

  // Asignar parámetros adicionales a la instancia del componente.
  Object.assign(componentInstance, params);

  // Aplicar la función de renderizado.
  componentInstance.apply();

  // Asignar la función de cierre al componente.
  componentInstance.close = close;

  // Crear el overlay y añadirlo al cuerpo del documento.
  const overlay = document.createElement("div");
  overlay.setAttribute("style", MODAL_STYLE.OVERLAY);
  overlay.classList.add("overlay");
  if (referrer) overlay.style.opacity = 0;
  document.body.appendChild(overlay);

  // Añadir el modal al cuerpo del documento.
  document.body.appendChild(modal);

  // Mostrar gradualmente el modal.
  if (!referrer) {
    setTimeout(() => {
      modal.style.opacity = 1;
      modal.style.transform = "translate(-50%, -50%)";
    }, 50);
  }

  // Cerrar el modal al hacer clic en el overlay si se especifica.
  if (hideWhenClickOverlay) {
    overlay.onclick = close;
  }
}

/**
 * Router - Maneja la navegación y renderizado de rutas en una aplicación web.
 * @param {Array} routes - Arreglo de objetos de ruta con propiedades 'path' y 'controller'.
 * @returns {Object} - Instancia del enrutador con métodos para navegación y renderizado.
 */
export function Router(routes = [], params = {}) {
  if (params.useHash == undefined) params.useHash = true;
  /**
   * matchDynamicRoute - Compara una ruta dinámica con una ruta dada y extrae parámetros si hay coincidencia.
   * @param {string} routePattern - Patrón de la ruta dinámica.
   * @param {string} path - Ruta a comparar.
   * @returns {Object|null} - Objeto con parámetros si hay coincidencia, o null si no hay coincidencia.
   */
  const matchDynamicRoute = function (routePattern, path) {
    const patternSegments = routePattern.split("/");
    const pathSegments = path.split("/");
    if (patternSegments.length !== pathSegments.length) return null;
    let params = {};
    for (let i = 0; i < patternSegments.length; i++) {
      const pattern = patternSegments[i];
      const value = pathSegments[i];
      if (pattern.startsWith(":")) {
        const paramName = pattern.slice(1);
        params[paramName] = value;
      } else if (pattern !== value) {
        return null;
      }
    }
    return { params };
  };
  const destroyRecursive = function (controller) {
    if (controller.onDestroy) controller.onDestroy();
    for (let child of controller.children) {
      destroyRecursive(child);
    }
  };
  return new (function Router() {
    this.params = undefined;
    this.alias = undefined;
    this.path = undefined;
    this.body = undefined;
    this.current_component = undefined;
    this.listeners = {};

    /**
     * navigate - Navega a la ruta especificada actualizando la ubicación hash.
     * @param {string} path - Ruta a la que se desea navegar.
     */
    this.navigate = (path, body = null) => {
      if (params.useHash) path = `#${path}`;
      history.pushState({ urlPath: `${path}` }, "", `${path}`);
      this.body = body;
      document.startViewTransition ? document.startViewTransition(this.render.bind(this)) : this.render();
    };

    this.listen = (callback) => {
      const uuid = crypto.randomUUID();
      this.listeners[uuid] = callback;
    };

    this.unlisten = (uuid) => {
      delete this.listeners[uuid];
    };

    /**
     * render - Renderiza el controlador de la ruta actual en el contenedor proporcionado.
     * @param {HTMLElement} container - Contenedor donde se renderizará el controlador.
     * @param {boolean} first_time - Indica si es la primera vez que se renderiza.
     */
    this.render = function (container = null) {
      if (container) this.container = container;
      if (!this.container) return;
      if (params.useHash) {
        if (!location.hash) location.hash = "#/";
        this.path = location.hash.replace("#", "");
      } else {
        this.path = location.pathname;
      }
      let route = routes.find((r) => r.path === this.path);
      this.params = {};
      if (!route) {
        for (let r of routes) {
          const match = matchDynamicRoute(r.path, this.path);
          if (match) {
            this.params = match.params;
            route = r;
            break;
          }
        }
      }
      if (!route) {
        this.alias = params.error ? (params.error.alias.startsWith(":") ? this.params[params.error.alias.split(":")[1]] : params.error.alias) : "404";
        this.current_component = Component(params.error ? params.error.controller : { render: () => "404" }).render(this.container);
      } else {
        this.alias = route.alias.startsWith(":") ? this.params[route.alias.split(":")[1]] : route.alias;
        if (this.current_component) destroyRecursive(this.current_component);
        this.current_component = Component(route.controller).render(this.container);
      }
      for (let listener in this.listeners) this.listeners[listener](this.params);
    };

    window.addEventListener("popstate", (e) => {
      this.render();
    });
  })();
}

window.addEventListener("load", function () {
  document.querySelectorAll("*[autoload]").forEach((element) => {
    if (element.hasAttribute(UUID_ATTRIBUTE)) return;
    if (!components[element.tagName.toUpperCase()]) return;
    components[element.tagName.toUpperCase()].render(element, getChildren(element));
  });
});
