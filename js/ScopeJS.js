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
export function Component({ tagName, controller, render }) {
  // Crear una instancia del componente.
  const c = new (function Component() {
    /**
     * Función de renderizado del componente.
     * @param {HTMLElement} container - Contenedor donde se renderizará el componente.
     * @returns {Object} - Instancia del componente con métodos de renderizado y control.
     */
    this.render = function (container = document.body) {
      // Función interna para aplicar el renderizado.
      const apply = function () {
        // Renderizar el contenido en el contenedor.
        container.innerHTML = render.bind(c)();

        // Asignar eventos HTML a funciones del controlador.
        for (const htmlEvent of ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"]) {
          container.querySelectorAll(`*[${htmlEvent}]`).forEach((el) => {
            const clickEventName = el.getAttribute(htmlEvent);
            const parts = clickEventName.split(".");
            let func = c;

            // Obtener la función del controlador según la cadena de eventos.
            for (const part of parts) {
              func = func[part];
            }

            // Asignar el evento HTML a la función del controlador.
            if (typeof func === "function") {
              el[htmlEvent] = function (event) {
                event.preventDefault();
                setTimeout(func.bind(c), 0, event);
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
    OVERLAY: "position: fixed; top: 0; left: 0; width: 100%; height: 100%",
    MODAL: "position: fixed; top: 50%; left: 50%; border-radius: 0.25rem; min-width: 20rem; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); background-color: white; color: black; transition: opacity 0.3s, transform 0.3s",
  };

  // Crear una instancia del componente modal.
  const component = Component({ controller, render });

  // Crear el elemento modal y aplicar estilos.
  const modal = document.createElement("div");
  modal.setAttribute("style", MODAL_STYLE.MODAL);
  modal.style.opacity = 0;
  modal.style.transform = "translate(-50%, 65%)";
  modal.classList.add("scopejs-modal");

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
  overlay.classList.add("scopejs-overlay");
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
