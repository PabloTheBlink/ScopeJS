/**
 * ScopeJS V2.0.2
 */
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
function initFadeIn() {
  const e = new IntersectionObserver((e) => {
    e.forEach((e) => {
      e.isIntersecting ? e.target.setAttribute("fadeIn", "1") : e.target.setAttribute("fadeIn", "0");
    });
  });
  document.querySelectorAll("*[fadeIn]").forEach((t) => {
    e.observe(t);
  });
}
/**
 * Crea un componente con capacidad de renderizado y control.
 * @param {Object} options - Opciones para configurar el componente.
 * @param {string} options.tagName - Nombre de la etiqueta HTML asociada al componente.
 * @param {Object} options.controller - Controlador del componente.
 * @param {Function} options.render - Función de renderizado del componente.
 * @returns {Object} - Instancia del componente con métodos de renderizado y control.
 */
export function Component({ tagName, controller, render, attributes, postRender, style, meta, title, router }) {
  // Crear una instancia del componente.
  const c = new (function Component() {
    /**
     * Función de renderizado del componente.
     * @param {HTMLElement} container - Contenedor donde se renderizará el componente.
     * @returns {Object} - Instancia del componente con métodos de renderizado y control.
     */
    this.render = function (container = document.createElement("div"), children = []) {
      const uuid = container.getAttribute(UUID_ATTRIBUTE) ?? (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

      /**
       * Loads lazy images (img[lazy]) within the given element. This function will
       * traverse the entire DOM tree of the element and load all lazy images.
       * @param {HTMLElement} element - The element to look for lazy images within.
       */
      function loadLazyImgs(element) {
        if (!element) return;
        if (element.tagName === "IMG" && element.hasAttribute("lazy")) {
          // Image lazy load
          (function () {
            const src = element.getAttribute("src");
            element.removeAttribute("src");
            const image = new Image();
            image.src = src;
            image.onload = function () {
              element.setAttribute("src", src);
              element.removeAttribute("lazy");
            };
          })();
        }
        if (element.querySelectorAll) element.querySelectorAll("img[lazy]").forEach(loadLazyImgs);
      }

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

        let style = document.querySelector("style[scopejs='']");
        if (!style) {
          style = document.createElement("style");
          style.setAttribute("scopejs", "");
          style.innerHTML = /* CSS */ `
            @keyframes lazy-loading {
              0% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0 50%;
              }
            }

            img[lazy] {
              position: relative;
            }

            img[lazy]::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, #ccc 25%, #eee 50%, #ccc 75%);
              background-size: 400% 400%;
              animation: lazy-loading 0.5s ease infinite;
            }

            ::view-transition-old(*),
            ::view-transition-new(*) {
              animation-timing-function: ease-in-out;
              animation-duration: 0.25s;
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(2.5rem);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            *[fadeIn] {
              opacity: 0;
              transform: translateY(2.5rem);
              transition: 0.5s;
            }

            *[fadeIn='1'] {
              opacity: 1;
              transform: translateY(0);
            }

          `;
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
            loadLazyImgs(newElement);
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

        const rendered = render.bind(c)();

        if (!rendered) return;

        c._render_times++;

        const clone = container.cloneNode(true);
        clone.innerHTML = rendered;

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

        if (router) {
          document.querySelectorAll("a[href]").forEach((element) => {
            if (!element.dataset.listenerAdded) {
              element.dataset.listenerAdded = "true";
              element.addEventListener("click", (event) => {
                event.preventDefault();
                router.navigate(element.getAttribute("href"));
              });
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

        const allAttributes = new Set([...container.getAttributeNames(), ...(attributes || [])]);

        for (const name of allAttributes) {
          const attrValue = container.getAttribute(name);
          const value = container.hasAttribute(name) ? attrValue : undefined;
          if (c[name] !== value) {
            c[name] = value;
            c.onChangeAttribute?.(name);
          }
        }

        container.dispatchEvent(new Event("change"));

        setTimeout(initFadeIn);

        return container.innerHTML;
      };

      /**
       * renderStyle - Renderiza el estilo CSS proporcionado en el scope del
       * componente actual.
       *
       * @returns {void}
       */
      function renderStyle() {
        if (!style) return;
        let style_element = document.querySelector(`style[scopejs="${uuid}"]`);
        if (style_element) return;
        style_element = document.createElement("style");
        style_element.setAttribute("scopejs", uuid);
        style_element.innerHTML = /* CSS */ `
            *[${UUID_ATTRIBUTE}="${uuid}"] {
              ${style}
            }
          `;
        document.head.appendChild(style_element);
      }

      function renderMeta() {
        if (!meta) return;
        for (let item of meta) {
          let meta_element = document.querySelector(`meta[name="${item.name}"]`);
          if (meta_element) continue;
          meta_element = document.createElement("meta");
          meta_element.setAttribute("name", item.name);
          meta_element.setAttribute("content", item.content);
          document.head.appendChild(meta_element);
        }
      }

      // Crear una instancia del controlador, si se proporciona.
      const c = controller ? new controller() : new (function () {})();

      c.children = [];

      c._render_times = 0;

      container.setAttribute(UUID_ATTRIBUTE, uuid);

      renderStyle();
      renderMeta();

      if (title) {
        document.title = title;
      }

      // Agregar la función de renderizado al controlador.
      c.apply = apply;
      apply();

      const allAttributes = new Set([...container.getAttributeNames(), ...(attributes || [])]);

      for (const name of allAttributes) {
        const attrValue = container.getAttribute(name);
        const value = container.hasAttribute(name) ? attrValue : undefined;
        if (c[name] !== value) {
          c[name] = value;
        }
      }

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
      if (path === window.location.hash || path === window.location.pathname) return;
      history.pushState({ urlPath: `${path}` }, "", `${path}`);
      this.body = body;
      document.startViewTransition ? document.startViewTransition(this.render.bind(this)) : this.render();
    };

    this.listen = (callback) => {
      const uuid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
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

      // Remove styles from the last rendered component.
      document.querySelectorAll("style[scopejs]").forEach((style) => {
        if (style.getAttribute("scopejs") === "") return;
        if (style.getAttribute("scopejs") === "global") return;
        style.remove();
      });

      if (params.useHash) {
        if (!location.hash) location.hash = "#/";
        this.path = location.hash.replace("#", "");
      } else {
        this.path = location.pathname;
      }
      if (this.path.endsWith("/") && this.path != "/") {
        this.path = this.path.slice(0, -1);
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
        this.alias = params.error && params.error.alias ? (params.error.alias.startsWith(":") ? this.params[params.error.alias.split(":")[1]] : params.error.alias) : "404";
        this.current_component = Component(params.error ? { ...params.error.controller, router: this } : { render: () => "404" }).render(this.container);
      } else {
        if (this.current_component) destroyRecursive(this.current_component);
        if (route.middleware) {
          route.middleware(() => {
            if (route.alias) {
              this.alias = route.alias.startsWith(":") ? this.params[route.alias.split(":")[1]] : route.alias;
            } else {
              this.alias = undefined;
            }
            this.current_component = Component({ ...route.controller, router: this }).render(this.container);
          });
        } else {
          if (route.alias) {
            this.alias = route.alias.startsWith(":") ? this.params[route.alias.split(":")[1]] : route.alias;
          } else {
            this.alias = undefined;
          }
          this.current_component = Component({ ...route.controller, router: this }).render(this.container);
        }
      }
      for (let listener in this.listeners) this.listeners[listener](this.params);
      setTimeout(initFadeIn);
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
