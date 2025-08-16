## OBJETIVO: Crear archivo `js/ScopeJS.js` que sea 100% compatible con este código existente:

```javascript
// DEBE FUNCIONAR EXACTAMENTE ASÍ:
import { Component, Modal, Router, enableDebugger } from "./js/ScopeJS.js";

// 1. Registrar componentes
Component({
  tagName: "sidebar",
  controller: function () {
    this.message = "Hello";
    this.click = function () {
      this.apply();
    };
  },
  render: function () {
    return `<div onclick="click()">${this.message}</div>`;
  },
});

// 2. Usar custom elements
// HTML: <sidebar></sidebar>

// 3. Router con hash (rutas básicas)
const router = Router(
  [
    { path: "/tasks", controller: TasksController, alias: "tasks" },
    { path: "/projects/:id", controller: ProjectController, alias: ":id" },
  ],
  { useHash: true }
);

// 3b. Router con rutas anidadas (NUEVO EN v2.0.5)
const nestedRouter = Router(
  [
    {
      path: "/admin",
      controller: AdminLayoutController, // Layout padre con <router-outlet>
      children: [
        {
          path: "/dashboard", // Se convierte en "/admin/dashboard"
          controller: DashboardController,
        },
        {
          path: "/users", // Se convierte en "/admin/users"
          controller: UsersController,
        },
        {
          path: "/users/:id", // Se convierte en "/admin/users/:id"
          controller: UserDetailController,
        },
      ],
    },
  ],
  { useHash: true }
);

// 4. Navegación
router.navigate("/projects/123");
console.log(router.params.id); // "123"
console.log(router.alias); // "123"

// 4b. Navegación anidada
nestedRouter.navigate("/admin/users/456");
console.log(nestedRouter.params.id); // "456"
console.log(nestedRouter.getAllRoutes()); // Todas las rutas aplanadas

// 5. Modal
Modal({
  controller: function () {
    this.save = function () {
      this.close("saved");
    };
  },
  render: function () {
    return `<button onclick="save()">Save</button>`;
  },
  hideWhenClickOverlay: true,
});

// 6. Data binding automático
// HTML: <input model="user.name" /> sincroniza con this.user.name
```

## IMPLEMENTACIÓN REQUERIDA

### 1. **ESTRUCTURA UMD** (OBLIGATORIO)

```javascript
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    const ScopeJS = factory();
    root.ScopeJS = ScopeJS;
    root.Component = ScopeJS.Component;
    root.Modal = ScopeJS.Modal;
    root.Router = ScopeJS.Router;
    root.enableDebugger = ScopeJS.enableDebugger;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // TU CÓDIGO AQUÍ

  return { Component, Modal, Router, enableDebugger };
});

// ES6 exports al final
export const Component = ScopeJS?.Component || window.Component;
export const Modal = ScopeJS?.Modal || window.Modal;
export const Router = ScopeJS?.Router || window.Router;
export const enableDebugger = ScopeJS?.enableDebugger || window.enableDebugger;
export default typeof ScopeJS !== "undefined" ? ScopeJS : window.ScopeJS;
```

### 2. **FUNCIÓN Component(options)**

```javascript
// Registro global de componentes
const COMPONENT_REGISTRY = new Map();

function Component(options) {
  const instance = {
    render: function (container = document.createElement("div")) {
      // 1. Crear controlador
      const controller = options.controller ? new Function() : {};
      if (options.controller) {
        options.controller.call(controller);
      }

      // 2. Asignar apply()
      controller.apply = function () {
        const html = options.render.call(controller);
        container.innerHTML = html;
        bindEvents(container, controller);
        bindModels(container, controller);
        renderSubComponents(container);
      };

      // 3. Render inicial
      controller.apply();

      // 4. postRender
      if (options.postRender) {
        setTimeout(() => options.postRender.call(controller), 0);
      }

      return controller;
    },
  };

  // Registrar si tiene tagName
  if (options.tagName) {
    COMPONENT_REGISTRY.set(options.tagName.toUpperCase(), instance);
  }

  return instance;
}
```

### 3. **SISTEMA DE EVENTOS**

```javascript
const HTML_EVENTS = ["onclick", "onchange", "oninput", "onsubmit" /* todos los eventos HTML */];

function bindEvents(container, controller) {
  HTML_EVENTS.forEach((eventName) => {
    container.querySelectorAll(`*[${eventName}]`).forEach((element) => {
      const eventValue = element.getAttribute(eventName);
      const functionName = eventValue.split("(")[0];

      if (controller[functionName]) {
        element[eventName] = function (event) {
          event.preventDefault();

          // Parsear parámetros si los hay
          const paramsMatch = eventValue.match(/\(([^)]*)\)/);
          const params = [];

          if (paramsMatch && paramsMatch[1]) {
            const paramStrings = paramsMatch[1].split(",").map((p) => p.trim());
            paramStrings.forEach((param) => {
              params.push(eval(param)); // Evaluar parámetros
            });
          }

          params.push(event); // Siempre agregar evento al final
          controller[functionName].apply(controller, params);
        };
      }
    });
  });
}
```

### 4. **DATA BINDING**

```javascript
function bindModels(container, controller) {
  container.querySelectorAll("*[model]").forEach((element) => {
    const modelPath = element.getAttribute("model");
    const pathSegments = modelPath.split(".");

    // Establecer valor inicial
    const value = getValueByPath(controller, pathSegments);
    if (value !== undefined) {
      element.value = value;
    }

    // Bind cambios
    element.addEventListener("input", () => {
      setValueByPath(controller, pathSegments, element.value);
    });
  });
}

function getValueByPath(obj, pathSegments) {
  return pathSegments.reduce((current, segment) => current?.[segment], obj);
}

function setValueByPath(obj, pathSegments, value) {
  const lastSegment = pathSegments.pop();
  const target = pathSegments.reduce((current, segment) => {
    if (!current[segment]) current[segment] = {};
    return current[segment];
  }, obj);
  target[lastSegment] = value;
}
```

### 5. **RENDERIZADO DE SUB-COMPONENTES**

```javascript
function renderSubComponents(container) {
  container.querySelectorAll("*").forEach((element) => {
    const tagName = element.tagName.toUpperCase();
    const component = COMPONENT_REGISTRY.get(tagName);

    if (component && !element.hasAttribute("scopejs-rendered")) {
      element.setAttribute("scopejs-rendered", "true");

      // Pasar atributos como propiedades
      const controller = component.render(element);
      Array.from(element.attributes).forEach((attr) => {
        controller[attr.name] = attr.value;
      });
    }
  });
}
```

### 6. **FUNCIÓN Router(routes, config) - CON RUTAS ANIDADAS**

```javascript
function Router(routes = [], config = {}) {
  const router = {
    routes,
    flatRoutes: flattenRoutes(routes),
    config: { useHash: true, ...config },
    params: {},
    alias: undefined,
    path: undefined,
    container: null,
    current_component: null,
    current_parent_component: null,
    listeners: new Map(),

    navigate: function (path) {
      const targetPath = this.config.useHash ? `#${path}` : path;
      history.pushState({ urlPath: targetPath }, "", targetPath);
      this.render();
    },

    listen: function (callback) {
      const uuid = Math.random().toString(36);
      this.listeners.set(uuid, callback);
      return uuid;
    },

    getAllRoutes: function () {
      return this.flatRoutes;
    },

    getChildRoutes: function (parentPath) {
      return this.flatRoutes.filter((route) => route.parentPath === parentPath);
    },

    render: function (container) {
      if (container) this.container = container;
      if (!this.container) return;

      // Obtener ruta actual
      this.path = this.config.useHash ? location.hash.replace("#", "") || "/" : location.pathname;

      // Encontrar ruta coincidente
      const matchedRoute = this.findMatchingRoute();

      if (matchedRoute) {
        this.renderRoute(matchedRoute);
      } else {
        this.renderErrorPage();
      }

      // Notificar listeners
      this.listeners.forEach((callback) => callback(this.params));
    },

    findMatchingRoute: function () {
      this.params = {};

      // Buscar coincidencia exacta primero
      let route = this.flatRoutes.find((r) => r.path === this.path);

      // Buscar coincidencia dinámica
      if (!route) {
        for (const r of this.flatRoutes) {
          const match = matchRoute(r.path, this.path);
          if (match) {
            this.params = match.params;
            route = r;
            break;
          }
        }
      }

      return route;
    },

    renderRoute: function (route) {
      if (this.current_component) {
        this.destroyComponent(this.current_component);
      }
      if (this.current_parent_component) {
        this.destroyComponent(this.current_parent_component);
      }

      const parentRoute = this.findParentRoute(route);

      if (parentRoute) {
        // Renderizar componente padre primero
        if (parentRoute.controller && typeof parentRoute.controller.render === "function") {
          this.current_parent_component = Component(parentRoute.controller).render(this.container);
        } else {
          this.current_parent_component = Component({
            ...parentRoute.controller,
            router: this,
          }).render(this.container);
        }

        // Buscar router-outlet en el componente padre
        const outlet = this.container.querySelector("router-outlet");
        if (outlet) {
          // Renderizar componente hijo en el outlet
          if (route.controller && typeof route.controller.render === "function") {
            this.current_component = route.controller.render(outlet);
          } else {
            this.current_component = Component({
              ...route.controller,
              router: this,
            }).render(outlet);
          }
        }
      } else if (route.hasChildren) {
        // Es una ruta padre accedida directamente
        if (route.controller && typeof route.controller.render === "function") {
          this.current_component = Component(route.controller).render(this.container);
        } else {
          this.current_component = Component({
            ...route.controller,
            router: this,
          }).render(this.container);
        }
      } else {
        // Renderizar componente independiente
        if (route.controller && typeof route.controller.render === "function") {
          this.current_component = Component(route.controller).render(this.container);
        } else {
          this.current_component = Component({
            ...route.controller,
            router: this,
          }).render(this.container);
        }
      }
    },

    findParentRoute: function (route) {
      if (!route.parentPath) return null;
      return this.flatRoutes.find((r) => r.path === route.parentPath && r.hasChildren);
    },

    destroyComponent: function (component) {
      component.onDestroy?.();
      component.children?.forEach((child) => this.destroyComponent(child));
    },

    renderErrorPage: function () {
      const errorConfig = this.config.error;
      this.current_component = Component(errorConfig ? { ...errorConfig.controller, router: this } : { render: () => "404" }).render(this.container);
    },
  };

  // Event listener para popstate
  window.addEventListener("popstate", () => router.render());

  return router;
}

// Función para aplanar rutas anidadas
function flattenRoutes(routes, parentPath = "") {
  const flattened = [];

  routes.forEach((route) => {
    const fullPath = parentPath + route.path;
    const flatRoute = {
      ...route,
      path: fullPath,
      originalPath: route.path,
      parentPath: parentPath,
      hasChildren: !!(route.children && route.children.length > 0),
    };

    // Agregar la ruta padre
    flattened.push(flatRoute);

    // Aplanar recursivamente las rutas hijas
    if (route.children) {
      const childRoutes = flattenRoutes(route.children, fullPath);
      flattened.push(...childRoutes);
    }
  });

  return flattened;
}

function matchRoute(routePattern, path) {
  const patternSegments = routePattern.split("/");
  const pathSegments = path.split("/");

  if (patternSegments.length !== pathSegments.length) return null;

  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pattern = patternSegments[i];
    const value = pathSegments[i];

    if (pattern.startsWith(":")) {
      params[pattern.slice(1)] = value;
    } else if (pattern !== value) {
      return null;
    }
  }

  return { params };
}
```

### 7. **FUNCIÓN Modal(options, params, events)**

```javascript
function Modal(options, params = {}, events = {}) {
  // Crear overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999999;";

  // Crear modal
  const modal = document.createElement("div");
  modal.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 8px; padding: 20px; z-index: 1000000;";

  // Crear componente modal
  const component = Component(options);
  const controller = component.render(modal);

  // Asignar parámetros
  Object.assign(controller, params);

  // Función close
  controller.close = function (data) {
    overlay.remove();
    modal.remove();
    if (events.onClose) events.onClose(data);
  };

  // Cerrar al hacer clic en overlay
  if (options.hideWhenClickOverlay) {
    overlay.onclick = () => controller.close();
  }

  // Añadir al DOM
  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Render inicial
  controller.apply();
}
```

### 8. **FUNCIÓN enableDebugger(enabled)**

```javascript
let debugMode = false;

function enableDebugger(enabled) {
  debugMode = enabled;
}

function log(...args) {
  if (debugMode) console.log("[ScopeJS]", ...args);
}
```

## CASOS DE PRUEBA CRÍTICOS

Tu implementación DEBE pasar estas pruebas:

```javascript
// Test 1: Component con tagName
Component({
  tagName: "test-component",
  controller: function () {
    this.message = "Hello World";
    this.count = 0;
    this.increment = function () {
      this.count++;
      this.apply();
    };
  },
  render: function () {
    return `<div>
      <p>${this.message}</p>
      <p>Count: ${this.count}</p>
      <button onclick="increment()">+</button>
    </div>`;
  },
});

// HTML: <test-component></test-component> debe funcionar

// Test 2: Data binding
Component({
  controller: function () {
    this.user = { name: "" };
  },
  render: function () {
    return `<div>
      <input model="user.name" />
      <p>Hello ${this.user.name}</p>
    </div>`;
  },
}).render(document.body);

// Test 3: Router básico
const router = Router([{ path: "/users/:id", controller: { render: () => "User page" }, alias: ":id" }]);
router.navigate("/users/123");
console.assert(router.params.id === "123");
console.assert(router.alias === "123");

// Test 3b: Rutas anidadas
const nestedRouter = Router([
  {
    path: "/admin",
    controller: {
      render: function () {
        return `<div><h1>Admin</h1><router-outlet></router-outlet></div>`;
      },
    },
    children: [
      {
        path: "/users",
        controller: { render: () => "Users List" },
      },
      {
        path: "/users/:id",
        controller: { render: () => "User Detail" },
      },
    ],
  },
]);

nestedRouter.navigate("/admin/users/456");
console.assert(nestedRouter.params.id === "456");
console.assert(nestedRouter.getAllRoutes().length === 3); // /admin, /admin/users, /admin/users/:id

// Test 4: Modal
Modal(
  {
    controller: function () {
      this.data = "test";
      this.save = function () {
        this.close(this.data);
      };
    },
    render: function () {
      return `<button onclick="save()">Save</button>`;
    },
  },
  {},
  {
    onClose: (data) => console.assert(data === "test"),
  }
);
```

## NUEVAS FUNCIONALIDADES (v2.0.5)

### RUTAS ANIDADAS

- **Herencia de paths**: Las rutas hijas heredan automáticamente el path del padre
- **Router Outlet**: Usa `<router-outlet></router-outlet>` en componentes padre
- **Layouts compartidos**: Mantén navegación y estilos consistentes
- **Métodos adicionales**: `getAllRoutes()` y `getChildRoutes(parentPath)`

### ESTRUCTURA DE RUTAS ANIDADAS

```javascript
const routes = [
  {
    path: "/admin", // Ruta padre
    controller: AdminLayout, // Debe contener <router-outlet>
    children: [
      // Rutas hijas
      {
        path: "/dashboard", // = "/admin/dashboard"
        controller: Dashboard,
      },
      {
        path: "/users/:id", // = "/admin/users/:id"
        controller: UserDetail,
      },
    ],
  },
];
```

### COMPONENTE PADRE CON ROUTER-OUTLET

```javascript
const AdminLayout = {
  render: function () {
    return `
      <div class="admin-layout">
        <nav>...</nav>
        <main>
          <router-outlet></router-outlet>  <!-- Aquí se renderizan los hijos -->
        </main>
      </div>
    `;
  },
};
```

## REQUISITOS FINALES

1. **Archivo único**: Todo en `js/ScopeJS.js`
2. **Tamaño**: ~15KB sin minificar
3. **Sin dependencias**: Solo JavaScript vanilla
4. **Compatibilidad**: Chrome 60+, Firefox 55+, Safari 11+
5. **UMD**: Funciona con import/export y script global
6. **Performance**: Solo actualizar elementos cambiados en DOM
7. **Rutas anidadas**: Soporte completo para layouts jerárquicos

¡CREA LA IMPLEMENTACIÓN COMPLETA AHORA!
