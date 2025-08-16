# ScopeJS v2.0.5 - El Framework que te va a enamorar 💜

> Un framework JavaScript ligero y moderno para desarrollo basado en componentes. Diseñado para ser simple, eficiente y poderoso.

[![Versión](https://img.shields.io/badge/versión-2.0.5-purple)](https://github.com/pablotheblink/ScopeJS)
[![Tamaño](https://img.shields.io/badge/tamaño-~15KB-green)](https://unpkg.com/@pablotheblink/scopejs@2.0.5/js/ScopeJS.js)
[![Licencia](https://img.shields.io/badge/licencia-Apache-blue)](LICENSE)

## 🚀 Características Principales

- **⚡ Renderizado Quirúrgico**: Solo actualiza lo que realmente ha cambiado
- **🧩 Componentes Inteligentes**: Encapsulación completa con estado reactivo
- **🔄 Data Binding Automático**: Sincronización bidireccional sin configuración
- **🚪 Modales Elegantes**: Sistema de ventanas emergentes con animaciones
- **🛣️ Router SPA**: Navegación fluida para aplicaciones de una sola página
- **🎨 CSS Scoped**: Estilos encapsulados que no interfieren entre sí
- **📱 Mobile-First**: Optimizado para dispositivos móviles
- **🪶 Ultraligero**: Solo ~15KB minificado
- **🔧 Zero Dependencies**: Sin dependencias externas

## 📦 Instalación Súper Fácil

### Método 1: Script Clásico (Copy & Paste)

```html
<!-- En el <head> de tu HTML -->
<script src="https://unpkg.com/@pablotheblink/scopejs@2.0.5/js/ScopeJS.js"></script>

<script>
  // Las funciones están disponibles globalmente
  const MiComponente = ScopeJS.Component({
    controller: class {
      constructor() {
        this.mensaje = "¡Hola Mundo!";
      }
    },
    render() {
      return `<h1>${this.mensaje}</h1>`;
    },
  });

  // Renderizar cuando la página cargue
  window.addEventListener("load", () => {
    const container = document.getElementById("app");
    MiComponente.render(container);
  });
</script>
```

### Método 2: ES6 Modules (Para los cool kids)

```html
<!-- En el <head> de tu HTML -->
<script type="module">
  import { Component, Modal, Router } from "https://unpkg.com/@pablotheblink/scopejs@2.0.5/js/ScopeJS.js";

  const MiComponente = Component({
    controller: class {
      constructor() {
        this.mensaje = "¡Hola Mundo!";
      }
    },
    render() {
      return `<h1>${this.mensaje}</h1>`;
    },
  });

  // Renderizar cuando la página cargue
  window.addEventListener("load", () => {
    const container = document.getElementById("app");
    MiComponente.render(container);
  });
</script>
```

### Método 3: NPM (Para proyectos serios)

```bash
npm install @pablotheblink/scopejs
```

```javascript
import { Component, Modal, Router } from "@pablotheblink/scopejs";
```

## 🧩 Componentes Inteligentes

Los componentes en ScopeJS son como ladrillos LEGO inteligentes que encapsulan todo lo que necesitas:

### Ejemplo Básico: Contador Interactivo

```javascript
import { Component } from "@pablotheblink/scopejs";

const Counter = Component({
  // Controlador con lógica
  controller: class {
    constructor() {
      this.count = 0;
      this.step = 1;
    }

    increment() {
      this.count += this.step;
      this.apply(); // Re-renderizar
    }

    decrement() {
      this.count -= this.step;
      this.apply();
    }

    reset() {
      this.count = 0;
      this.apply();
    }
  },

  // Template HTML
  render() {
    return `
            <div class="counter-widget">
                <h3>Contador: ${this.count}</h3>
                <div class="controls">
                    <button onclick="decrement()">- ${this.step}</button>
                    <button onclick="increment()">+ ${this.step}</button>
                </div>
                <button onclick="reset()">Reset</button>
            </div>
        `;
  },

  // Estilos CSS scoped
  style: `
        padding: 1rem;
        border: 2px solid #9333ea;
        border-radius: 0.5rem;
        text-align: center;
        background: white;
    `,

  // Tag personalizado (opcional)
  tagName: "my-counter",
});

// Usar el componente
const container = document.getElementById("app");
Counter.render(container);
```

### Ejemplo Avanzado: Lista de Tareas

```javascript
const TodoList = Component({
  controller: class {
    constructor() {
      this.todos = [];
      this.newTodo = "";
      this.filter = "all";
    }

    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({
          id: Date.now(),
          text: this.newTodo,
          completed: false,
        });
        this.newTodo = "";
        this.apply();
      }
    }

    toggleTodo(id) {
      const todo = this.todos.find((t) => t.id == id);
      if (todo) {
        todo.completed = !todo.completed;
        this.apply();
      }
    }

    deleteTodo(id) {
      this.todos = this.todos.filter((t) => t.id != id);
      this.apply();
    }

    get filteredTodos() {
      if (this.filter === "completed") {
        return this.todos.filter((t) => t.completed);
      }
      if (this.filter === "active") {
        return this.todos.filter((t) => !t.completed);
      }
      return this.todos;
    }
  },

  render() {
    return `
            <div class="todo-app">
                <h3>Lista de Tareas</h3>
                
                <div class="add-todo">
                    <input type="text" model="newTodo" 
                           placeholder="Nueva tarea..."
                           onkeyup="if(event.key==='Enter') addTodo()">
                    <button onclick="addTodo()">Agregar</button>
                </div>
                
                <div class="filters">
                    <button onclick="filter='all'; apply()" 
                            class="${this.filter === "all" ? "active" : ""}">
                        Todas
                    </button>
                    <button onclick="filter='active'; apply()" 
                            class="${this.filter === "active" ? "active" : ""}">
                        Activas
                    </button>
                    <button onclick="filter='completed'; apply()" 
                            class="${this.filter === "completed" ? "active" : ""}">
                        Completadas
                    </button>
                </div>
                
                <ul class="todo-list">
                    ${this.filteredTodos
                      .map(
                        (todo) => `
                        <li class="todo-item ${todo.completed ? "completed" : ""}">
                            <input type="checkbox" 
                                   ${todo.completed ? "checked" : ""} 
                                   onclick="toggleTodo(${todo.id})">
                            <span>${todo.text}</span>
                            <button onclick="deleteTodo(${todo.id})">❌</button>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
        `;
  },

  style: `
        padding: 1rem;
        border: 2px solid #9333ea;
        border-radius: 0.5rem;
        background: white;
        
        .active { background: #9333ea; color: white; }
        .completed { text-decoration: line-through; opacity: 0.6; }
    `,
});
```

## 🚪 Modales con Estilo

Crea ventanas emergentes que no molestan, sino que encantan:

```javascript
import { Modal } from "@pablotheblink/scopejs";

function openUserModal() {
  Modal({
    controller: class {
      constructor() {
        this.message = "¡Hola desde el modal!";
        this.userName = "";
      }

      saveUser() {
        if (this.userName.trim()) {
          alert(`Usuario guardado: ${this.userName}`);
          this.close();
        }
      }
    },

    render() {
      return `
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-4">${this.message}</h3>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">
                            Nombre de usuario:
                        </label>
                        <input type="text" model="userName" 
                               class="w-full px-3 py-2 border rounded"
                               placeholder="Escribe tu nombre">
                    </div>
                    <div class="flex gap-2">
                        <button onclick="saveUser()" 
                                class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                            Guardar
                        </button>
                        <button onclick="close()" 
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                            Cancelar
                        </button>
                    </div>
                </div>
            `;
    },

    hideWhenClickOverlay: true, // Cerrar al hacer clic fuera
  });
}
```

## 🛣️ Router para SPAs

Sistema de navegación que funciona como debe, con soporte para **rutas anidadas**:

### Rutas Básicas

```javascript
import { Router, Component } from "@pablotheblink/scopejs";

// Definir las vistas/componentes
const HomePage = Component({
  controller: class {
    constructor() {
      this.title = "Página de Inicio";
      this.message = "¡Bienvenido a ScopeJS!";
    }
  },

  render() {
    return `
            <div class="p-6 text-center">
                <h1 class="text-3xl font-bold text-purple-800 mb-4">
                    ${this.title}
                </h1>
                <p class="text-gray-600">${this.message}</p>
                <a href="/usuario/123" class="text-purple-600 hover:underline">
                    Ver perfil de usuario
                </a>
            </div>
        `;
  },
});

const UserProfile = Component({
  controller: class {
    constructor() {
      this.userId = null;
      this.userName = "";
    }

    init(params) {
      this.userId = params.id;
      this.userName = `Usuario ${params.id}`;
      this.apply();
    }
  },

  render() {
    return `
            <div class="p-6">
                <h1 class="text-2xl font-bold text-purple-800 mb-4">
                    Perfil de ${this.userName}
                </h1>
                <p class="text-gray-600 mb-4">ID: ${this.userId}</p>
                <button onclick="history.back()" 
                        class="bg-purple-600 text-white px-4 py-2 rounded">
                    Volver
                </button>
            </div>
        `;
  },
});

// Configurar el router
const AppRouter = Router([
  {
    path: "/",
    controller: HomePage,
    alias: "inicio",
  },
  {
    path: "/usuario/:id",
    controller: UserProfile,
    alias: "perfil-usuario",
    middleware: (next) => {
      // Validar que el ID sea un número
      if (isNaN(this.params.id)) {
        alert("ID de usuario inválido");
        return false;
      }
      next();
    },
  },
]);

// Renderizar el router en el DOM
const container = document.getElementById("app");
AppRouter.render(container);

// Navegación programática
AppRouter.navigate("/usuario/123");

// Escuchar cambios de ruta
AppRouter.listen((params) => {
  console.log("Navegando a:", this.path, "Parámetros:", params);
});
```

### 🏗️ Rutas Anidadas (Nuevo en v2.0.5)

Crea rutas jerárquicas donde las rutas hijas heredan el path del padre:

```javascript
import { Router, Component } from "@pablotheblink/scopejs";

// Componente Layout Principal
const AdminLayout = Component({
  controller: class {
    constructor() {
      this.title = "Panel de Administración";
    }
  },
  
  render() {
    return `
      <div class="admin-layout">
        <nav class="navbar">
          <h2>🛡️ ${this.title}</h2>
          <div class="nav-links">
            <a href="#/admin/dashboard">📊 Dashboard</a>
            <a href="#/admin/usuarios">👥 Usuarios</a>
            <a href="#/admin/productos">📦 Productos</a>
            <a href="#/admin/configuracion">⚙️ Config</a>
          </div>
        </nav>
        
        <main class="content">
          <!-- Aquí se renderizan las rutas hijas -->
          <router-outlet></router-outlet>
        </main>
      </div>
    `;
  }
});

// Componentes Hijos
const Dashboard = Component({
  controller: class {
    constructor() {
      this.stats = { users: 150, products: 45, orders: 89 };
    }
  },
  render() {
    return `
      <div>
        <h3>📊 Dashboard</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <h4>👥 Usuarios</h4>
            <p>${this.stats.users}</p>
          </div>
          <div class="stat-card">
            <h4>📦 Productos</h4>
            <p>${this.stats.products}</p>
          </div>
          <div class="stat-card">
            <h4>🛒 Pedidos</h4>
            <p>${this.stats.orders}</p>
          </div>
        </div>
      </div>
    `;
  }
});

const UsersList = Component({
  controller: class {
    constructor() {
      this.users = [
        { id: 1, name: "Juan Pérez", email: "juan@example.com" },
        { id: 2, name: "María García", email: "maria@example.com" }
      ];
    }
    
    viewUser(userId) {
      this.router.navigate(`/admin/usuarios/${userId}`);
    }
  },
  
  render() {
    return `
      <div>
        <h3>👥 Gestión de Usuarios</h3>
        <div class="users-list">
          ${this.users.map(user => `
            <div class="user-card">
              <h4>${user.name}</h4>
              <p>📧 ${user.email}</p>
              <button onclick="viewUser(${user.id})">👁️ Ver</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
});

const UserDetail = Component({
  controller: class {
    constructor() {
      this.user = null;
    }
    
    loadUser() {
      const userId = this.router.params.id;
      // Simular carga de datos
      this.user = {
        id: userId,
        name: `Usuario ${userId}`,
        email: `user${userId}@example.com`
      };
      this.apply();
    }
    
    goBack() {
      this.router.navigate('/admin/usuarios');
    }
  },
  
  postRender() {
    this.loadUser();
  },
  
  render() {
    if (!this.user) return '<div>⏳ Cargando...</div>';
    
    return `
      <div>
        <h3>👤 Detalle del Usuario</h3>
        <div class="user-detail">
          <h4>${this.user.name}</h4>
          <p><strong>📧 Email:</strong> ${this.user.email}</p>
          <p><strong>🆔 ID:</strong> ${this.user.id}</p>
        </div>
        <button onclick="goBack()">⬅️ Volver</button>
      </div>
    `;
  }
});

// Configuración del Router con Rutas Anidadas
const routes = [
  {
    path: "/",
    controller: HomePage
  },
  {
    path: "/admin",           // Ruta padre
    controller: AdminLayout,  // Layout que contiene <router-outlet>
    children: [               // Rutas hijas que heredan el path padre
      {
        path: "/dashboard",   // Se convierte en "/admin/dashboard"
        controller: Dashboard
      },
      {
        path: "/usuarios",    // Se convierte en "/admin/usuarios"
        controller: UsersList
      },
      {
        path: "/usuarios/:id", // Se convierte en "/admin/usuarios/:id"
        controller: UserDetail
      },
      {
        path: "/productos",   // Se convierte en "/admin/productos"
        controller: ProductsList
      },
      {
        path: "/configuracion", // Se convierte en "/admin/configuracion"
        controller: Settings
      }
    ]
  }
];

// Inicializar Router
const AppRouter = Router(routes, { useHash: true });
const container = document.getElementById('app');
AppRouter.render(container);
```

### 📋 Características de las Rutas Anidadas

- **🔗 Herencia de Paths**: Las rutas hijas heredan automáticamente el path del padre
- **🎯 Router Outlet**: Usa `<router-outlet></router-outlet>` en el componente padre
- **📊 Layouts Compartidos**: Mantén navegación y estilos consistentes
- **🔄 Navegación Fluida**: Cambia solo el contenido del outlet, no todo el layout
- **📁 Estructura Jerárquica**: Organiza rutas de forma lógica y escalable

### 🔧 Métodos Nuevos del Router

```javascript
// Obtener todas las rutas (incluidas las anidadas)
const allRoutes = AppRouter.getAllRoutes();

// Obtener rutas hijas de un padre específico
const adminChildRoutes = AppRouter.getChildRoutes('/admin');
```

## ⚡ Renderizado Quirúrgico

ScopeJS no es de esos frameworks pesados que actualizan toda la página. Nosotros somos más listos: **solo tocamos lo que realmente ha cambiado**.

### Cómo Funciona

- **Precisión ninja**: Si cambias un texto, solo se actualiza ese texto
- **Eficiencia máxima**: Si cambias una clase CSS, solo se modifica esa clase
- **Resultado**: Animaciones fluidas y experiencia de usuario que enamora

### Ejemplo de Actualización Eficiente

```javascript
const Counter = Component({
  controller: class {
    constructor() {
      this.count = 0;
    }

    increment() {
      this.count++; // Solo este valor cambia
      this.apply(); // Solo se actualiza el número en pantalla
    }
  },

  render() {
    return `
            <div>
                <h1>Mi App Genial</h1>
                <p>Contador: ${this.count}</p>
                <button onclick="increment()">+</button>
            </div>
        `;
  },
});
```

## 🔄 Data Binding Automático

Con el atributo `model`, los datos se sincronizan automáticamente:

```javascript
const FormExample = Component({
  controller: class {
    constructor() {
      this.user = {
        name: "",
        email: "",
        age: "",
      };
    }

    onSubmit(e) {
      e.preventDefault();
      console.log("Usuario:", this.user);
    }
  },

  render() {
    return `
            <form onsubmit="onSubmit()">
                <input type="text" model="user.name" placeholder="Nombre">
                <input type="email" model="user.email" placeholder="Email">
                <input type="number" model="user.age" placeholder="Edad">
                
                <p>Hola ${this.user.name}! 👋</p>
                
                <button type="submit">Enviar</button>
            </form>
        `;
  },
});
```

## 🎯 Eventos Inteligentes

Manejo de eventos que funciona como esperas:

```javascript
const EventExample = Component({
  controller: class {
    constructor() {
      this.message = "";
    }

    // Eventos sin parámetros (recibe el evento)
    onClick(event) {
      console.log(event.target);
    }

    // Eventos con parámetros
    onButtonClick(id, action, event) {
      console.log(id, action, event);
      this.message = `Botón ${id} - Acción: ${action}`;
      this.apply();
    }
  },

  render() {
    return `
            <div>
                <button onclick="onClick()">Clic Simple</button>
                <button onclick="onButtonClick(123, 'delete')">Clic con Parámetros</button>
                <p>${this.message}</p>
            </div>
        `;
  },
});
```

## 📚 API Reference

### Component API

| Propiedad    | Tipo     | Descripción                                |
| ------------ | -------- | ------------------------------------------ |
| `controller` | Class    | Clase controladora del componente          |
| `render`     | Function | Función que retorna el HTML del componente |
| `style`      | String   | CSS scoped para el componente              |
| `tagName`    | String   | Nombre del elemento personalizado          |
| `postRender` | Function | Callback ejecutado después del render      |
| `title`      | String   | Título de la página                        |
| `meta`       | Array    | Meta tags para SEO                         |

### Modal API

| Propiedad              | Tipo     | Descripción                          |
| ---------------------- | -------- | ------------------------------------ |
| `controller`           | Class    | Controlador del modal                |
| `render`               | Function | Función de renderizado               |
| `hideWhenClickOverlay` | Boolean  | Cerrar al hacer clic fuera           |
| `className`            | String   | Clase CSS adicional                  |
| `referrer`             | Element  | Elemento de referencia para posición |

### Router API

| Método     | Parámetros | Descripción                           |
| ---------- | ---------- | ------------------------------------- |
| `navigate` | path, body | Navegar a una ruta específica         |
| `render`   | container  | Renderizar el router en un contenedor |
| `listen`   | callback   | Escuchar cambios de ruta              |
| `unlisten` | uuid       | Remover listener de cambios           |

### Utilidades

| Función          | Parámetros | Descripción                          |
| ---------------- | ---------- | ------------------------------------ |
| `enableDebugger` | boolean    | Activar/desactivar modo debug        |
| `apply`          | -          | Re-renderizar componente             |
| `close`          | ...args    | Cerrar modal (disponible en modales) |

## 🎨 Funciones Adicionales

### Animaciones Fade In

```html
<img fadeIn src="mi-imagen-genial.jpg" />
<!-- Aparece suavemente cuando entra en el viewport -->
```

### Carga Diferida de Imágenes (Lazy Loading)

```html
<img lazy src="imagen-pesada.jpg" />
<!-- Solo se carga cuando realmente se necesita -->
```

### Transiciones de Vista (View Transitions)

```html
<!-- Page1 -->
<img id="image_1" src="foto1.jpg" />

<!-- Page2 -->
<img id="image_1" src="foto2.jpg" />
<!-- Transición automática entre páginas usando el mismo ID -->
```

## 🏗️ Estructura HTML Básica

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mi App con ScopeJS</title>

    <!-- Cargar ScopeJS -->
    <script src="https://unpkg.com/@pablotheblink/scopejs@2.0.5/js/ScopeJS.js"></script>
  </head>
  <body>
    <div id="app">
      <!-- Tu aplicación se renderizará aquí -->
    </div>

    <script>
      // Tu código de la aplicación aquí
      const App = ScopeJS.Component({
        controller: class {
          constructor() {
            this.titulo = "Mi Primera App ScopeJS";
            this.contador = 0;
          }

          incrementar() {
            this.contador++;
            this.apply();
          }
        },

        render() {
          return `
          <div style="text-align: center; padding: 2rem;">
            <h1>${this.titulo}</h1>
            <p>Contador: ${this.contador}</p>
            <button onclick="incrementar()">
              Incrementar
            </button>
          </div>
        `;
        },
      });

      // Inicializar cuando la página cargue
      window.addEventListener("load", () => {
        const container = document.getElementById("app");
        App.render(container);
      });
    </script>
  </body>
</html>
```

## 💡 Consejos de Rendimiento

1. **Usar apply() solo cuando sea necesario** - Solo después de cambios de estado
2. **Componentes pequeños y enfocados** - Un componente = una responsabilidad
3. **Aprovechar lazy loading para imágenes** - `<img lazy src="...">`
4. **Usar fadeIn para animaciones** - `<div fadeIn>...</div>`
5. **Estilos scoped por componente** - Evita conflictos CSS
6. **Evitar manipulación DOM directa** - Usar el sistema reactivo
7. **Validar datos antes de renderizar** - Especialmente arrays/objetos nulos

## ❌ Errores Comunes a Evitar

1. **No llamar apply()** después de cambiar el estado
2. **Manipular DOM directamente** en lugar de usar el sistema reactivo
3. **No limpiar listeners** en onDestroy
4. **Componentes demasiado grandes** - Mejor dividir en subcomponentes
5. **No validar datos** antes de renderizar
6. **Usar innerHTML directamente** - Mejor usar el sistema de templates
7. **No gestionar errores** en operaciones asíncronas

## ✅ Casos de Uso Ideales

- **SPAs pequeñas y medianas** con Router
- **Dashboards interactivos** con widgets reutilizables
- **Formularios complejos** con validación
- **Aplicaciones CRUD** básicas
- **Prototipos rápidos** y MVPs
- **Landing pages dinámicas**
- **Componentes web** independientes
- **Aplicaciones de gestión** simples

## ❌ Cuándo NO usar ScopeJS

- **Aplicaciones muy grandes** (mejor React/Vue/Angular)
- **Necesidades de SSR críticas** (server-side rendering)
- **Ecosistemas muy específicos** (ej: React Native)
- **Equipos grandes** que necesitan tooling avanzado
- **Aplicaciones con estado muy complejo** (state management)
- **Necesidades de testing avanzado** (unit testing frameworks)

## 📊 Compatibilidad

- ✅ **Chrome** 60+
- ✅ **Firefox** 55+
- ✅ **Safari** 11+
- ✅ **Edge** 79+
- ✅ **Navegadores móviles** modernos
- ❌ **Internet Explorer** (porque ya es hora de dejarlo ir)

## Licencia 📄 (Lo legal y aburrido)

MIT License - Básicamente puedes hacer lo que quieras, pero no nos culpes si te vuelves adicto.

## El Genio Detrás de la Locura 👨‍💻

Pablo Martínez - El tipo que pensó que el mundo necesitaba notificaciones más sexys.

- [GitHub](https://github.com/PabloTheBlink)
- [LinkedIn](https://www.linkedin.com/in/pablo-mart%C3%ADnez-san-jos%C3%A9-9bb24215a)
- [Instagram](https://www.instagram.com/PabloTheBlink)

---

<div align="center">

**ScopeJS v2.0.5** - El framework JavaScript que no te va a dar dolores de cabeza 😎

[⬆ Volver arriba](#scopejs-v204---el-framework-que-te-va-a-enamorar-)

</div>
