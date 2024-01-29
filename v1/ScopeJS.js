// Object to store components
const components = {};
// Create a proxy for the $rootScope function to trigger re-rendering

const $rootScope = createProxy(function () {
  // Iterate over components and render instances
  for (let tag in components) {
    if (!components[tag].options.listen_rootScope) continue;
    for (let uuid in components[tag].instances) {
      components[tag].instances[uuid].render();
    }
  }
});

/**
 * Crea un objeto proxy que dispara una funciÃ³n de callback `onchange` cuando se establece una propiedad.
 * @param {function} onchange - La funciÃ³n de callback que se dispara cuando se establece una propiedad.
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
       * @returns {boolean} - Indica si el valor de la propiedad se estableciÃ³ con Ã©xito.
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
           * @returns {boolean} - Indica si el valor de la propiedad se estableciÃ³ con Ã©xito.
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
       * @returns {boolean} - Indica si el valor de la propiedad se estableciÃ³ con Ã©xito.
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
 * Observa cambios en el DOM y dispara una funciÃ³n de callback.
 *
 * @param {HTMLElement} element - El elemento a observar. Se establece en document.body por defecto si no se proporciona.
 * @param {Function} onchange - La funciÃ³n de callback a ejecutar cuando se detectan cambios en el DOM.
 *                              La funciÃ³n recibe dos arreglos: addedNodes y removedNodes.
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
 * @param {Function} onchange - La funciÃ³n de callback a ejecutar cuando se detectan cambios.
 *                              La funciÃ³n recibe dos arreglos: addedNodes y removedNodes.
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
 * @param {Array} collector - El arreglo donde se almacenarÃ¡n los nodos recopilados.
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
 * @param {Function} options.controller - La funciÃ³n controladora para el componente.
 * @param {string} options.name - El nombre del componente.
 */
function ComponentController({ node, controller, name }) {
  // Genera un identificador Ãºnico para el componente
  this.uuid = crypto.randomUUID();

  // Almacena una referencia al elemento HTML
  this.element = node;

  // Clona los nodos hijos del elemento HTML
  this.children = Array.from(node.childNodes).map((child) => child.cloneNode());

  // Establece el atributo 'uuid' del elemento HTML al UUID generado
  this.element.setAttribute("uuid", this.uuid);

  // Inicializa la funciÃ³n 'draw' en null
  this.draw = null;

  /**
   * Renderiza el componente.
   */
  this.render = () => {
    // Verifica si falta la funciÃ³n 'draw' o el elemento HTML
    if (!this.draw || !this.element) {
      return;
    }

    // Llama a la funciÃ³n 'draw' y establece innerHTML del elemento HTML al resultado
    this.element.innerHTML = this.draw();

    // Adjunta oyentes de eventos a elementos con atributos de evento HTML
    for (const htmlEvent of ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"]) {
      this.element.querySelectorAll(`*[${htmlEvent}]`).forEach((el) => {
        const clickEventName = el.getAttribute(htmlEvent);
        const parts = clickEventName.split(".");
        let func = this;

        // Obtiene la referencia de la funciÃ³n recorriendo el array 'parts'
        for (const part of parts) {
          func = func[part];
        }

        // Asigna la funciÃ³n al evento HTML
        if (typeof func === "function") {
          el[htmlEvent] = function (event) {
            event.preventDefault();
            setTimeout(func, 0, event);
          };
        }
      });
    }

    // AÃ±ade los nodos hijos clonados al elemento HTML
    this.children.forEach((child) => {
      if (this.element.querySelector("[append-children]")) this.element.querySelector("[append-children]").appendChild(child);
    });
  };

  // Crea un proxy para la funciÃ³n 'render' para activar el re-renderizado
  this.$scope = createProxy(this.render.bind(this));

  // Almacena una referencia al Ã¡mbito global
  this.$rootScope = $rootScope;

  // Extrae atributos del elemento HTML
  const attributes = {};
  for (const attr of node.attributes) {
    attributes[attr.name] = attr.value == "null" ? null : attr.value;
  }

  // Llama a la funciÃ³n controladora con los argumentos necesarios
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
 * Crea un componente y lo aÃ±ade al objeto de componentes.
 * @param {object} controller - El objeto controlador para el componente.
 * @param {object} options - Las opciones adicionales para el componente.
 * @returns {object} - Un objeto que expone mÃ©todos para interactuar con las instancias del componente.
 */
function createComponent(controller, options = {}) {
  // Verifica si el objeto controlador es vÃ¡lido
  if (!controller || !controller.name) {
    return;
  }

  // Convierte el nombre del controlador a minÃºsculas para usarlo como el nombre del componente
  const component_name = controller.name.toLowerCase();

  // Crea un nuevo objeto de componente y lo aÃ±ade al objeto de componentes
  components[component_name] = {
    controller,
    instances: {},
    options,
    render: function (node) {
      // Crea una nueva instancia del controlador del componente y la aÃ±ade al objeto de instancias
      const instance = new ComponentController({ node, controller, name: component_name });
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
 * FunciÃ³n para renderizar contenido en un elemento del DOM.
 * @param {string} content - El contenido a renderizar (por defecto: "")
 * @param {HTMLElement} root - El elemento raÃ­z donde se renderizarÃ¡ el contenido (por defecto: document.body)
 */
function render(content = "", root = document.body) {
  // Establece el contenido del elemento raÃ­z
  root.innerHTML = content;
}

/**
 * FunciÃ³n para manejar el DOM inicial.
 * @param {HTMLElement} rootElement - El elemento raÃ­z donde se buscarÃ¡n componentes para renderizar.
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
 * FunciÃ³n para aÃ±adir nodos reciÃ©n aÃ±adidos al DOM.
 * @param {Array} addedNodes - Arreglo de nodos que han sido aÃ±adidos al DOM.
 */
function addAddedNodes(addedNodes) {
  // Itera sobre los nodos aÃ±adidos
  addedNodes.forEach((node) => {
    if (node.tagName) {
      // Obtiene el nombre de la etiqueta en minÃºsculas
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
 * FunciÃ³n para eliminar nodos que han sido removidos del DOM.
 * @param {Array} removedNodes - Arreglo de nodos que han sido removidos del DOM.
 */
function removeRemovedNodes(removedNodes) {
  // Itera sobre los nodos removidos
  removedNodes.forEach((node) => {
    if (node.tagName) {
      // Obtiene el nombre de la etiqueta en minÃºsculas
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
 * Escucha cambios en el DOM y ejecuta funciones para aÃ±adir o remover nodos.
 */
onChangeDOM(document.body, function (addedNodes, removedNodes) {
  addAddedNodes(addedNodes);
  removeRemovedNodes(removedNodes);
});

// Manejar el DOM la primera vez
setTimeout(handleInitialDOM, 0, document.body);

export const ScopeJS = new (function ScopeJS() {
  // Asigna mÃ©todos y propiedades pÃºblicas
  this.createComponent = createComponent;
  this.render = render;
  this.$rootScope = $rootScope;
})();
