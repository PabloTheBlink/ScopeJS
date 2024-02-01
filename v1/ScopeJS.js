const MODAL_STYLE = {
  OVERLAY: "position: fixed; top: 0; left: 0; width: 100%; height: 100%",
  MODAL: "position: fixed; top: 50%; left: 50%; border-radius: 0.25rem; min-width: 20rem; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); background-color: white; color: black; transition: opacity 0.3s, transform 0.3s",
};

// Object to store components
const components = {};
// Create a proxy for the $rootScope function to trigger re-rendering

export const $rootScope = createProxy(function () {
  // Iterate over components and render instances
  for (let tag in components) {
    if (!components[tag].options.listen_rootScope) continue;
    for (let uuid in components[tag].instances) {
      components[tag].instances[uuid].render();
    }
  }
});

/**
 * Crea un objeto proxy que dispara una función de callback `onchange` cuando se establece una propiedad.
 * @param {function} onchange - La función de callback que se dispara cuando se establece una propiedad.
 * @returns {Proxy} - El objeto proxy con el callback `onchange`.
 */
function createProxy(onchange = function () {}) {
  return new Proxy(
    {},
    {
      /**
       * Establece el valor de la propiedad y dispara el callback `onchange`.
       * @param {object} target - El objeto objetivo.
       * @param {string|symbol} key - La clave de la propiedad.
       * @param {any} value - El valor de la propiedad.
       * @returns {boolean} - Indica si el valor de la propiedad se estableció con éxito.
       */
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = transformToProxy(value, onchange);
        onchange();
        return true;
      },
    }
  );
}

/**
 * Transforma de manera recursiva un objeto/arreglo en un objeto/arreglo proxy.
 * @param {any} value - El valor a transformar.
 * @returns {Proxy|any} - El objeto/arreglo proxy transformado o el valor original.
 */
function transformToProxy(value, onchange = function () {}) {
  // TODO: Optimizar
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    for (let key in value) {
      if (typeof value[key] === "object" && !Array.isArray(value[key]) && value[key] !== null) {
        value[key] = transformToProxy(value[key], onchange);
      } else {
        value = new Proxy(value, {
          /**
           * Establece el valor de la propiedad y dispara el callback `onchange`.
           * @param {object} target - El objeto objetivo.
           * @param {string|symbol} key - La clave de la propiedad.
           * @param {any} value - El valor de la propiedad.
           * @returns {boolean} - Indica si el valor de la propiedad se estableció con éxito.
           */
          set: (target, key, value) => {
            if (target[key] === value) return true;
            target[key] = transformToProxy(value, onchange);
            onchange();
            return true;
          },
        });
      }
    }
  } else if (Array.isArray(value) && value !== null) {
    for (let i = 0; i < value.length; i++) {
      value[i] = transformToProxy(value[i], onchange);
    }
    value = new Proxy(value, {
      /**
       * Establece el valor de la propiedad y dispara el callback `onchange`.
       * @param {object} target - El objeto objetivo.
       * @param {string|symbol} key - La clave de la propiedad.
       * @param {any} value - El valor de la propiedad.
       * @returns {boolean} - Indica si el valor de la propiedad se estableció con éxito.
       */
      set: (target, key, value) => {
        if (target[key] === value) return true;
        target[key] = transformToProxy(value, onchange);
        onchange();
        return true;
      },
    });
  }
  return value;
}

/**
 * Observa cambios en el DOM y dispara una función de callback.
 *
 * @param {HTMLElement} element - El elemento a observar. Se establece en document.body por defecto si no se proporciona.
 * @param {Function} onchange - La función de callback a ejecutar cuando se detectan cambios en el DOM.
 *                              La función recibe dos arreglos: addedNodes y removedNodes.
 */
function onChangeDOM(element = document.body, onchange = function (addedNodes = [], removedNodes = []) {}) {
  // Crea una nueva instancia de MutationObserver
  const observer = new MutationObserver((mutationsList) => observeDOM(mutationsList, onchange));

  // Observa el elemento especificado para cambios en el DOM
  observer.observe(element, { childList: true, subtree: true });
}

/**
 * Observa cambios en el DOM utilizando la API de MutationObserver.
 *
 * @param {MutationRecord[]} mutationsList - La lista de mutaciones detectadas en el DOM.
 * @param {Function} onchange - La función de callback a ejecutar cuando se detectan cambios.
 *                              La función recibe dos arreglos: addedNodes y removedNodes.
 */
function observeDOM(mutationsList, onchange = function (addedNodes = [], removedNodes = []) {}) {
  const addedNodes = [];
  const removedNodes = [];

  mutationsList.forEach((record) => collectNodesRecursively(record.addedNodes, addedNodes));
  mutationsList.forEach((record) => collectNodesRecursively(record.removedNodes, removedNodes));

  onchange(addedNodes, removedNodes);
}

/**
 * Recopila nodos de forma recursiva desde una lista de nodos y los almacena en un arreglo.
 *
 * @param {NodeList} nodeList - La lista de nodos a recopilar.
 * @param {Array} collector - El arreglo donde se almacenarán los nodos recopilados.
 */
function collectNodesRecursively(nodeList, collector) {
  nodeList.forEach((node) => {
    collector.push(node);
    if (node.childNodes && node.childNodes.length > 0) {
      collectNodesRecursively(node.childNodes, collector);
    }
  });
}

/**
 * Representa un controlador de componente.
 * @constructor
 * @param {Object} options - Las opciones para el controlador del componente.
 * @param {HTMLElement} options.node - El elemento HTML asociado con el componente.
 * @param {Function} options.controller - La función controladora para el componente.
 * @param {string} options.name - El nombre del componente.
 */
function ComponentController({ node, controller, name, $scope }) {
  // Genera un identificador único para el componente
  this.uuid = crypto.randomUUID();

  // Almacena una referencia al elemento HTML
  this.element = node;

  // Clona los nodos hijos del elemento HTML
  this.children = Array.from(node.childNodes).map((child) => child.cloneNode());

  // Establece el atributo 'uuid' del elemento HTML al UUID generado
  this.element.setAttribute("uuid", this.uuid);

  // Inicializa la función 'draw' en null
  this.draw = null;

  /**
   * Renderiza el componente.
   */
  this.render = () => {
    // Verifica si falta la función 'draw' o el elemento HTML
    if (!this.draw || !this.element) {
      return;
    }

    // Llama a la función 'draw' y establece innerHTML del elemento HTML al resultado
    this.element.innerHTML = this.draw();

    // Adjunta oyentes de eventos a elementos con atributos de evento HTML
    for (const htmlEvent of ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"]) {
      this.element.querySelectorAll(`*[${htmlEvent}]`).forEach((el) => {
        const clickEventName = el.getAttribute(htmlEvent);
        const parts = clickEventName.split(".");
        let func = this;

        // Obtiene la referencia de la función recorriendo el array 'parts'
        for (const part of parts) {
          func = func[part];
        }

        // Asigna la función al evento HTML
        if (typeof func === "function") {
          el[htmlEvent] = function (event) {
            event.preventDefault();
            setTimeout(func, 0, event);
          };
        }
      });
    }

    // Añade los nodos hijos clonados al elemento HTML
    this.children.forEach((child) => {
      if (this.element.querySelector("[append-children]")) this.element.querySelector("[append-children]").appendChild(child);
    });
  };

  // Crea un proxy para la función 'render' para activar el re-renderizado
  this.$scope = createProxy(this.render.bind(this));
  if ($scope) {
    for (let key in $scope) {
      this.$scope[key] = $scope[key];
    }
  }
  // Almacena una referencia al ámbito global
  this.$rootScope = $rootScope;

  // Extrae atributos del elemento HTML
  const attributes = {};
  for (const attr of node.attributes) {
    attributes[attr.name] = attr.value == "null" ? null : attr.value;
  }

  // Llama a la función controladora con los argumentos necesarios
  controller({
    render: (draw) => (this.draw = draw),
    remove: () => {
      this.element.remove();
    },
    $scope: this.$scope,
    $rootScope,
    attributes,
    instances: components[name].instances,
  });

  setTimeout(() => {
    // Elimina los atributos
    for (let attribute of this.element.attributes) {
      if (attribute.name === "uuid") return;
      if (attribute.name === "class") return;
      if (attribute.name === "style") return;
      this.element.removeAttribute(attribute.name);
    }
  }, 0);

  // Renderiza el componente
  this.render();
}

/**
 * Crea un componente y lo añade al objeto de componentes.
 * @param {object} controller - El objeto controlador para el componente.
 * @param {object} options - Las opciones adicionales para el componente.
 * @returns {object} - Un objeto que expone métodos para interactuar con las instancias del componente.
 */
export function createComponent(controller, options = {}, $scope = null) {
  // Verifica si el objeto controlador es válido
  if (!controller || !controller.name) {
    return;
  }

  // Convierte el nombre del controlador a minúsculas para usarlo como el nombre del componente
  const component_name = controller.name.toLowerCase();

  // Crea un nuevo objeto de componente y lo añade al objeto de componentes
  components[component_name] = {
    controller,
    instances: {},
    options,
    render: function (node) {
      // Crea una nueva instancia del controlador del componente y la añade al objeto de instancias
      const instance = new ComponentController({ node, controller, name: component_name, $scope });
      components[component_name].instances[instance.uuid] = instance;
    },
  };

  return {
    getInstances: () => components[component_name].instances,
    newInstance: () => {
      const instance = new ComponentController({ node: document.createElement(component_name), controller, name: component_name });
      components[component_name].instances[instance.uuid] = instance;
      return instance.element;
    },
  };
}

/**
 * Función para renderizar contenido en un elemento del DOM.
 * @param {string} content - El contenido a renderizar (por defecto: "")
 * @param {HTMLElement} root - El elemento raíz donde se renderizará el contenido (por defecto: document.body)
 */
export function render(content = "", root = document.body) {
  // Establece el contenido del elemento raíz
  root.innerHTML = content;
}

/**
 * Función para manejar el DOM inicial.
 * @param {HTMLElement} rootElement - El elemento raíz donde se buscarán componentes para renderizar.
 */
function handleInitialDOM(rootElement) {
  const allNodes = rootElement.querySelectorAll("*");
  allNodes.forEach((node) => {
    if (node.tagName) {
      const tag_name = node.tagName.toLowerCase();
      if (components[tag_name] && !node.getAttribute("uuid")) {
        components[tag_name].render(node);
      }
    }
  });
}

/**
 * Función para añadir nodos recién añadidos al DOM.
 * @param {Array} addedNodes - Arreglo de nodos que han sido añadidos al DOM.
 */
function addAddedNodes(addedNodes) {
  // Itera sobre los nodos añadidos
  addedNodes.forEach((node) => {
    if (node.tagName) {
      // Obtiene el nombre de la etiqueta en minúsculas
      const tag_name = node.tagName.toLowerCase();

      // Verifica si existe un componente para el nombre de la etiqueta y el nodo no tiene un atributo "uuid"
      if (components[tag_name] && !node.getAttribute("uuid")) {
        // Renderiza el componente en el nodo
        components[tag_name].render(node);
      }
    }
  });
}

/**
 * Función para eliminar nodos que han sido removidos del DOM.
 * @param {Array} removedNodes - Arreglo de nodos que han sido removidos del DOM.
 */
function removeRemovedNodes(removedNodes) {
  // Itera sobre los nodos removidos
  removedNodes.forEach((node) => {
    if (node.tagName) {
      // Obtiene el nombre de la etiqueta en minúsculas
      const tag_name = node.tagName.toLowerCase();

      // Verifica si existe un componente para el nombre de la etiqueta y el nodo tiene un atributo "uuid"
      if (components[tag_name] && node.getAttribute("uuid")) {
        // Verifica si la instancia existe
        if (components[tag_name].instances[node.getAttribute("uuid")]) {
          delete components[tag_name].instances[node.getAttribute("uuid")];
        }
      }
    }
  });
}

/**
 * Initializes a new Router object.
 *
 * @constructor
 * @this {Router}
 * @return {void}
 */
export const Router = new (function Router() {
  this.params = {};
  this.navigate = (path) => (location.hash = `#${path}`);
  /**
   * Renders the specified routes to the given component.
   *
   * @param {Array} routes - An array of route objects.
   * @param {HTMLElement} component - The component to render the routes to.
   * @param {boolean} first_time - Indicates whether it is the first time rendering.
   */
  this.render = (routes = [], component = document.body, first_time = true) => {
    function matchDynamicRoute(routePattern, path) {
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
    }
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
      const state = document.createElement("div");
      state.classList.add("state");
      state.style.transition = "0.1s";
      if (component.querySelectorAll(".state").length > 0) state.style.display = "none";
      state.innerHTML = route.template;
      component.appendChild(state);
      setTimeout(function () {
        const states = component.querySelectorAll(".state");
        if (states.length > 1) {
          states.forEach(function (element, index) {
            if (index < states.length - 1) {
              element.style.opacity = "0";
              setTimeout(function () {
                element.remove();
              }, 100);
            } else {
              setTimeout(function () {
                element.style.display = "";
                window.dispatchEvent(new Event("route-changed"));
              }, 100);
            }
          });
        } else {
          window.dispatchEvent(new Event("route-changed"));
        }
      }, 100);
    }
    if (first_time) {
      window.onhashchange = () => this.render(routes, component, false);
    }
  };
})();

export function Modal(controller, options = { hideWhenClickOverlay: false, $scope: {} }) {
  const $scope = options.$scope || {};
  $scope.close = function () {
    modal.style.opacity = 0;
    modal.style.transform = "translate(-50%, 65%)";
    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
  };
  ScopeJS.createComponent(controller, {}, $scope);
  const modal = document.createElement("div");
  modal.setAttribute("style", MODAL_STYLE.MODAL);
  modal.style.opacity = 0;
  modal.style.transform = "translate(-50%, 65%)";
  modal.innerHTML = `<${controller.name}></${controller.name}>`;
  const overlay = document.createElement("div");
  overlay.setAttribute("style", MODAL_STYLE.OVERLAY);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.style.opacity = 1;
    modal.style.transform = "translate(-50%, -50%)";
  }, 50);
  if (options.hideWhenClickOverlay) {
    overlay.onclick = $scope.close;
  }
}

/**
 * Escucha cambios en el DOM y ejecuta funciones para añadir o remover nodos.
 */
onChangeDOM(document.body, function (addedNodes, removedNodes) {
  addAddedNodes(addedNodes);
  removeRemovedNodes(removedNodes);
});

// Manejar el DOM la primera vez
setTimeout(handleInitialDOM, 0, document.body);

export const ScopeJS = new (function ScopeJS() {
  this.createComponent = createComponent;
  this.render = render;
  this.$rootScope = $rootScope;
  this.Router = Router;
  this.Modal = Modal;
})();

export default ScopeJS;
