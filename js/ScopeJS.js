// Diccionario de componentes
const components = {};
/**
 * Crea un componente con capacidad de renderizado y control.
 * @param {Object} options - Opciones para configurar el componente.
 * @param {string} options.tagName - Nombre de la etiqueta HTML asociada al componente.
 * @param {Object} options.controller - Controlador del componente.
 * @param {Function} options.render - Función de renderizado del componente.
 * @returns {Object} - Instancia del componente con métodos de renderizado y control.
 */
export function Component({ tagName, controller, render, postRender }) {
  /**
   * Obtiene los hijos de un nodo sin incluir nodos de texto.
   * @param {Node} node - El nodo del que se desean obtener los hijos.
   * @returns {Array<Node>} - Un array de nodos hijos que no son nodos de texto.
   */
  function getChildrenWithoutTextNodes(node) {
    const children = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType !== Node.TEXT_NODE) {
        children.push(child);
      }
    }
    return children;
  }

  /**
   * Actualiza el contenido de un contenedor con el contenido de otro, manteniendo la estructura de los elementos.
   * @param {Node} originalNode - El nodo original que se actualizará.
   * @param {Node} cloneNode - El nodo clonado que se utilizará para la actualización.
   */
  function updateContainer(originalNode, cloneNode) {
    if (originalNode.isEqualNode(cloneNode)) return;
    if (getChildrenWithoutTextNodes(cloneNode).length != getChildrenWithoutTextNodes(originalNode).length) {
      if (!!originalNode.parentElement && !!cloneNode.parentElement) {
        originalNode.parentElement.innerHTML = cloneNode.parentElement.innerHTML;
      } else {
        originalNode.innerHTML = cloneNode.innerHTML;
      }
      return;
    }
    if (getChildrenWithoutTextNodes(cloneNode).length == 0) {
      if (!!originalNode.parentElement && !!cloneNode.parentElement) {
        originalNode.parentElement.innerHTML = cloneNode.parentElement.innerHTML;
      } else {
        originalNode.innerHTML = cloneNode.innerHTML;
      }
      return;
    }
    for (let i = 0; i < getChildrenWithoutTextNodes(cloneNode).length; i++) {
      updateContainer(getChildrenWithoutTextNodes(originalNode)[i], getChildrenWithoutTextNodes(cloneNode)[i]);
    }
  }

  // Crear una instancia del componente.
  const c = new (function Component() {
    /**
     * Función de renderizado del componente.
     * @param {HTMLElement} container - Contenedor donde se renderizará el componente.
     * @returns {Object} - Instancia del componente con métodos de renderizado y control.
     */
    this.render = function (container = document.createElement("div")) {
      // Función interna para aplicar el renderizado.
      const apply = function () {
        // Renderizar el contenido en el contenedor.

        const clone = container.cloneNode();
        clone.innerHTML = render.bind(c)();

        if (clone.isEqualNode(container)) return;

        // updateContainer(container, clone);

        container.innerHTML = clone.innerHTML; // OJO FIX

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
                    }
                  }
                }
                setTimeout(() => func.apply(c, Object.values(params)), 0);
              };
            }
          });
        }

        // Renderizar subcomponentes dentro del contenedor.
        container.querySelectorAll("*").forEach((element) => {
          if (components[element.tagName.toUpperCase()]) {
            components[element.tagName.toUpperCase()].render(element);
          }
        });

        if (postRender) setTimeout(postRender.bind(c), 0);

        return container.innerHTML;
      };

      // Crear una instancia del controlador, si se proporciona.
      const c = controller ? new controller() : new (function () {})();

      for (let name of container.getAttributeNames()) {
        c[name] = container.getAttribute(name);
      }

      // Agregar la función de renderizado al controlador.
      c.apply = apply;
      apply();

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
export function Modal({ controller, render, hideWhenClickOverlay }, params = {}) {
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
  modal.style.opacity = 0;
  modal.style.transform = "translate(-50%, 65%)";
  modal.classList.add("modal");

  // Función para cerrar el modal.
  const close = function () {
    modal.style.opacity = 0;
    modal.style.transform = "translate(-50%, 65%)";
    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
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
  document.body.appendChild(overlay);

  // Añadir el modal al cuerpo del documento.
  document.body.appendChild(modal);

  // Mostrar gradualmente el modal.
  setTimeout(() => {
    modal.style.opacity = 1;
    modal.style.transform = "translate(-50%, -50%)";
  }, 50);

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
export function Router(routes = []) {
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
  return new (function Router() {
    this.params = undefined;
    this.alias = undefined;
    this.path = undefined;
    this.current_component = undefined;
    this.listeners = {};

    /**
     * navigate - Navega a la ruta especificada actualizando la ubicación hash.
     * @param {string} path - Ruta a la que se desea navegar.
     */
    this.navigate = (path) => (location.hash = `#${path}`);

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
    this.render = function (container = document.createElement("div"), first_time = true) {
      if (!location.hash) location.hash = "#/";
      this.path = location.hash.replace("#", "");
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
      if (route) {
        if (route.alias.startsWith(":")) {
          this.alias = this.params[route.alias.split(":")[1]];
        } else {
          this.alias = route.alias;
        }
        if (this.current_component && this.current_component.onDestroy) this.current_component.onDestroy();
        this.current_component = Component(route.controller).render(container);
        for (let listener in this.listeners) this.listeners[listener](this.params);
      }
      if (first_time) {
        window.onhashchange = () => this.render(container, false);
      }
    };
  })();
}
