# Instalación

Esta librería ha sido desarrollada utilizando módulos ES (ES Modules) y puede ser usada directamente desde uno de los siguientes CDN:

```javascript
import { Component, Router, Modal } from "https://cdn.jsdelivr.net/gh/pablotheblink/ScopeJS/js/ScopeJS.min.js";
```

# Ejemplos Prácticos

Esta sección contiene ejemplos completos y funcionales para diferentes casos de uso comunes.

## Ejemplo 1: Contador Interactivo

Un contador simple que demuestra el manejo de estado y eventos:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Contador ScopeJS</title>
  </head>
  <body>
    <contador-app autoload></contador-app>

    <script type="module">
      import { Component } from "https://cdn.devetty.es/ScopeJS/js";

      Component({
        tagName: "contador-app",
        style: `
                padding: 2rem;
                text-align: center;
                font-family: Arial, sans-serif;
            `,
        controller: function () {
          this.count = 0;
          this.step = 1;

          this.increment = function () {
            this.count += this.step;
            this.apply();
          };

          this.decrement = function () {
            this.count -= this.step;
            this.apply();
          };

          this.reset = function () {
            this.count = 0;
            this.apply();
          };

          this.changeStep = function () {
            // El step se actualiza automáticamente por el model binding
            console.log("Nuevo step:", this.step);
          };
        },
        render: function () {
          return `
                    <h1>Contador: ${this.count}</h1>
                    
                    <div style="margin: 1rem 0;">
                        <label>Incremento: </label>
                        <input type="number" model="step" oninput="changeStep()" value="${this.step}" min="1" max="10">
                    </div>
                    
                    <div>
                        <button onclick="decrement()" style="margin: 0.5rem; padding: 0.5rem 1rem;">
                            - ${this.step}
                        </button>
                        <button onclick="reset()" style="margin: 0.5rem; padding: 0.5rem 1rem;">
                            Reset
                        </button>
                        <button onclick="increment()" style="margin: 0.5rem; padding: 0.5rem 1rem;">
                            + ${this.step}
                        </button>
                    </div>
                    
                    <p style="margin-top: 2rem; color: ${this.count > 10 ? "green" : this.count < 0 ? "red" : "black"}">
                        ${this.count > 10 ? "¡Excelente!" : this.count < 0 ? "Valor negativo" : "Sigue contando"}
                    </p>
                `;
        },
      });
    </script>
  </body>
</html>
```

## Ejemplo 2: Lista de Tareas (Todo List)

Una aplicación completa de gestión de tareas:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Lista de Tareas</title>
  </head>
  <body>
    <todo-app autoload></todo-app>

    <script type="module">
      import { Component, Modal } from "https://cdn.devetty.es/ScopeJS/js";

      Component({
        tagName: "todo-app",
        style: `
                max-width: 600px;
                margin: 2rem auto;
                padding: 2rem;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-radius: 8px;
            `,
        controller: function () {
          this.tasks = [
            { id: 1, text: "Aprender ScopeJS", completed: false, priority: "high" },
            { id: 2, text: "Crear mi primera app", completed: false, priority: "medium" },
          ];
          this.newTask = "";
          this.filter = "all"; // all, active, completed
          this.newTaskPriority = "medium";

          this.addTask = function (e) {
            e.preventDefault();
            if (!this.newTask.trim()) return;

            const task = {
              id: Date.now(),
              text: this.newTask.trim(),
              completed: false,
              priority: this.newTaskPriority,
            };

            this.tasks.push(task);
            this.newTask = "";
            this.apply();
          };

          this.toggleTask = function (id) {
            const task = this.tasks.find((t) => t.id === id);
            if (task) {
              task.completed = !task.completed;
              this.apply();
            }
          };

          this.deleteTask = function (id) {
            Modal({
              controller: function () {
                this.confirm = function () {
                  const index = this.tasks.findIndex((t) => t.id === id);
                  if (index > -1) {
                    this.tasks.splice(index, 1);
                    this.apply();
                  }
                  this.close();
                }.bind(this);

                this.cancel = function () {
                  this.close();
                };
              }.bind(this),
              render: function () {
                return `
                                <div style="padding: 2rem; text-align: center;">
                                    <h3>¿Eliminar tarea?</h3>
                                    <p>Esta acción no se puede deshacer.</p>
                                    <div style="margin-top: 1rem;">
                                        <button onclick="cancel()" style="margin: 0.5rem; padding: 0.5rem 1rem;">
                                            Cancelar
                                        </button>
                                        <button onclick="confirm()" style="margin: 0.5rem; padding: 0.5rem 1rem; background: red; color: white; border: none; border-radius: 4px;">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            `;
              },
              hideWhenClickOverlay: true,
            });
          };

          this.setFilter = function (filter) {
            this.filter = filter;
            this.apply();
          };

          this.getFilteredTasks = function () {
            switch (this.filter) {
              case "active":
                return this.tasks.filter((t) => !t.completed);
              case "completed":
                return this.tasks.filter((t) => t.completed);
              default:
                return this.tasks;
            }
          };

          this.getStats = function () {
            const total = this.tasks.length;
            const completed = this.tasks.filter((t) => t.completed).length;
            const pending = total - completed;
            return { total, completed, pending };
          };
        },
        render: function () {
          const filteredTasks = this.getFilteredTasks();
          const stats = this.getStats();

          return `
                    <h1>📝 Lista de Tareas</h1>
                    
                    <!-- Estadísticas -->
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                        <strong>Total: ${stats.total}</strong> | 
                        <span style="color: orange;">Pendientes: ${stats.pending}</span> | 
                        <span style="color: green;">Completadas: ${stats.completed}</span>
                    </div>
                    
                    <!-- Formulario -->
                    <form onsubmit="addTask()" style="margin-bottom: 2rem;">
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <input 
                                type="text" 
                                model="newTask" 
                                placeholder="Nueva tarea..." 
                                style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;"
                                required
                            >
                            <select model="newTaskPriority" style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="low">Baja</option>
                                <option value="medium" selected>Media</option>
                                <option value="high">Alta</option>
                            </select>
                            <button type="submit" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                Añadir
                            </button>
                        </div>
                    </form>
                    
                    <!-- Filtros -->
                    <div style="margin-bottom: 1rem;">
                        <button onclick="setFilter('all')" style="margin-right: 0.5rem; padding: 0.25rem 0.5rem; background: ${this.filter === "all" ? "#007bff" : "#f8f9fa"}; color: ${this.filter === "all" ? "white" : "black"}; border: 1px solid #ddd; border-radius: 4px;">
                            Todas
                        </button>
                        <button onclick="setFilter('active')" style="margin-right: 0.5rem; padding: 0.25rem 0.5rem; background: ${this.filter === "active" ? "#007bff" : "#f8f9fa"}; color: ${this.filter === "active" ? "white" : "black"}; border: 1px solid #ddd; border-radius: 4px;">
                            Pendientes
                        </button>
                        <button onclick="setFilter('completed')" style="margin-right: 0.5rem; padding: 0.25rem 0.5rem; background: ${this.filter === "completed" ? "#007bff" : "#f8f9fa"}; color: ${this.filter === "completed" ? "white" : "black"}; border: 1px solid #ddd; border-radius: 4px;">
                            Completadas
                        </button>
                    </div>
                    
                    <!-- Lista de tareas -->
                    <div>
                        ${
                          filteredTasks.length === 0
                            ? `<p style="text-align: center; color: #999; font-style: italic;">
                                ${this.filter === "all" ? "No hay tareas" : this.filter === "active" ? "No hay tareas pendientes" : "No hay tareas completadas"}
                            </p>`
                            : filteredTasks
                                .map(
                                  (task) => `
                                <div style="display: flex; align-items: center; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 0.5rem; background: ${task.completed ? "#f8f9fa" : "white"};">
                                    <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})" style="margin-right: 0.75rem;">
                                    
                                    <span style="flex: 1; text-decoration: ${task.completed ? "line-through" : "none"}; color: ${task.completed ? "#999" : "black"};">
                                        ${task.text}
                                    </span>
                                    
                                    <span style="padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem; margin-right: 0.5rem; background: ${task.priority === "high" ? "#ffebee" : task.priority === "medium" ? "#fff3e0" : "#f3e5f5"}; color: ${task.priority === "high" ? "#c62828" : task.priority === "medium" ? "#ef6c00" : "#7b1fa2"};">
                                        ${task.priority === "high" ? "Alta" : task.priority === "medium" ? "Media" : "Baja"}
                                    </span>
                                    
                                    <button onclick="deleteTask(${task.id})" style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 0.25rem 0.5rem; font-size: 0.875rem;">
                                        🗑️
                                    </button>
                                </div>
                            `
                                )
                                .join("")
                        }
                    </div>
                `;
        },
      });
    </script>
  </body>
</html>
```

## Ejemplo 3: Formulario de Contacto con Validación

Un formulario completo con validaciones y manejo de envío:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario de Contacto</title>
  </head>
  <body>
    <contact-form autoload></contact-form>

    <script type="module">
      import { Component, Modal } from "https://cdn.devetty.es/ScopeJS/js";

      Component({
        tagName: "contact-form",
        style: `
                max-width: 500px;
                margin: 2rem auto;
                padding: 2rem;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-radius: 8px;
            `,
        controller: function () {
          this.formData = {
            name: "",
            email: "",
            subject: "",
            message: "",
            urgency: "normal",
          };
          this.errors = {};
          this.isSubmitting = false;
          this.submitted = false;

          this.validateField = function (field) {
            const value = this.formData[field];
            delete this.errors[field];

            switch (field) {
              case "name":
                if (!value.trim()) this.errors[field] = "El nombre es requerido";
                else if (value.trim().length < 2) this.errors[field] = "El nombre debe tener al menos 2 caracteres";
                break;
              case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) this.errors[field] = "El email es requerido";
                else if (!emailRegex.test(value)) this.errors[field] = "Email inválido";
                break;
              case "subject":
                if (!value.trim()) this.errors[field] = "El asunto es requerido";
                break;
              case "message":
                if (!value.trim()) this.errors[field] = "El mensaje es requerido";
                else if (value.trim().length < 10) this.errors[field] = "El mensaje debe tener al menos 10 caracteres";
                break;
            }

            this.apply();
          };

          this.validateForm = function () {
            Object.keys(this.formData).forEach((field) => {
              if (field !== "urgency") this.validateField(field);
            });
            return Object.keys(this.errors).length === 0;
          };

          this.submitForm = function (e) {
            e.preventDefault();

            if (!this.validateForm()) {
              Modal({
                controller: function () {
                  this.close = function () {
                    this.close();
                  };
                },
                render: function () {
                  return `
                                    <div style="padding: 2rem; text-align: center;">
                                        <h3>❌ Errores en el formulario</h3>
                                        <p>Por favor, corrige los errores antes de enviar.</p>
                                        <button onclick="close()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                            Entendido
                                        </button>
                                    </div>
                                `;
                },
                hideWhenClickOverlay: true,
              });
              return;
            }

            this.isSubmitting = true;
            this.apply();

            // Simular envío al servidor
            setTimeout(() => {
              this.isSubmitting = false;
              this.submitted = true;
              this.apply();

              // Mostrar modal de éxito
              Modal({
                controller: function () {
                  this.reset = function () {
                    this.formData = {
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                      urgency: "normal",
                    };
                    this.submitted = false;
                    this.apply();
                    this.close();
                  }.bind(this);
                }.bind(this),
                render: function () {
                  return `
                                    <div style="padding: 2rem; text-align: center;">
                                        <h3>✅ ¡Mensaje enviado!</h3>
                                        <p>Gracias por contactarnos. Te responderemos pronto.</p>
                                        <button onclick="reset()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px;">
                                            Enviar otro mensaje
                                        </button>
                                    </div>
                                `;
                },
                hideWhenClickOverlay: false,
              });
            }, 2000);
          };

          this.resetForm = function () {
            this.formData = {
              name: "",
              email: "",
              subject: "",
              message: "",
              urgency: "normal",
            };
            this.errors = {};
            this.submitted = false;
            this.apply();
          };
        },
        render: function () {
          if (this.submitted) {
            return `
                        <div style="text-align: center; padding: 2rem;">
                            <h2>✅ ¡Gracias!</h2>
                            <p>Tu mensaje ha sido enviado correctamente.</p>
                            <button onclick="resetForm()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                Enviar otro mensaje
                            </button>
                        </div>
                    `;
          }

          return `
                    <h1>📧 Formulario de Contacto</h1>
                    
                    <form onsubmit="submitForm()">
                        <!-- Nombre -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Nombre *
                            </label>
                            <input 
                                type="text" 
                                model="formData.name"
                                oninput="validateField('name')"
                                style="width: 100%; padding: 0.75rem; border: 1px solid ${this.errors.name ? "#dc3545" : "#ddd"}; border-radius: 4px; box-sizing: border-box;"
                                placeholder="Tu nombre completo"
                            >
                            ${this.errors.name ? `<div style="color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;">${this.errors.name}</div>` : ""}
                        </div>
                        
                        <!-- Email -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Email *
                            </label>
                            <input 
                                type="email" 
                                model="formData.email"
                                oninput="validateField('email')"
                                style="width: 100%; padding: 0.75rem; border: 1px solid ${this.errors.email ? "#dc3545" : "#ddd"}; border-radius: 4px; box-sizing: border-box;"
                                placeholder="tu@email.com"
                            >
                            ${this.errors.email ? `<div style="color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;">${this.errors.email}</div>` : ""}
                        </div>
                        
                        <!-- Asunto -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Asunto *
                            </label>
                            <input 
                                type="text" 
                                model="formData.subject"
                                oninput="validateField('subject')"
                                style="width: 100%; padding: 0.75rem; border: 1px solid ${this.errors.subject ? "#dc3545" : "#ddd"}; border-radius: 4px; box-sizing: border-box;"
                                placeholder="¿De qué se trata tu mensaje?"
                            >
                            ${this.errors.subject ? `<div style="color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;">${this.errors.subject}</div>` : ""}
                        </div>
                        
                        <!-- Urgencia -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Urgencia
                            </label>
                            <select model="formData.urgency" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                <option value="low">Baja - Respuesta en 5-7 días</option>
                                <option value="normal" selected>Normal - Respuesta en 2-3 días</option>
                                <option value="high">Alta - Respuesta en 24 horas</option>
                                <option value="urgent">Urgente - Respuesta inmediata</option>
                            </select>
                        </div>
                        
                        <!-- Mensaje -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Mensaje *
                            </label>
                            <textarea 
                                model="formData.message"
                                oninput="validateField('message')"
                                rows="5"
                                style="width: 100%; padding: 0.75rem; border: 1px solid ${this.errors.message ? "#dc3545" : "#ddd"}; border-radius: 4px; box-sizing: border-box; resize: vertical;"
                                placeholder="Escribe tu mensaje aquí..."
                            ></textarea>
                            ${this.errors.message ? `<div style="color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;">${this.errors.message}</div>` : ""}
                        </div>
                        
                        <!-- Botones -->
                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button 
                                type="button" 
                                onclick="resetForm()"
                                style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
                                ${this.isSubmitting ? "disabled" : ""}
                            >
                                Limpiar
                            </button>
                            <button 
                                type="submit"
                                style="padding: 0.75rem 1.5rem; background: ${this.isSubmitting ? "#6c757d" : "#007bff"}; color: white; border: none; border-radius: 4px; cursor: ${this.isSubmitting ? "not-allowed" : "pointer"};"
                                ${this.isSubmitting ? "disabled" : ""}
                            >
                                ${this.isSubmitting ? "⏳ Enviando..." : "📤 Enviar Mensaje"}
                            </button>
                        </div>
                    </form>
                `;
        },
      });
    </script>
  </body>
</html>
```

### Patrones Comunes de Uso

**1. Estructura básica de un componente:**

```javascript
Component({
  tagName: "mi-componente", // Nombre del elemento HTML personalizado
  style: `/* CSS scoped */`, // Estilos CSS que solo afectan a este componente
  title: "Título de la página", // Título que aparecerá en el <head>
  meta: [{ name: "description", content: "..." }], // Meta tags para SEO
  controller: function () {
    // Estado del componente
    this.variable = valor;

    // Métodos del componente
    this.miMetodo = function () {
      // Lógica aquí
      this.apply(); // Importante: actualizar vista después de cambios
    };
  },
  render: function () {
    return `HTML template con ${this.variable}`;
  },
  postRender: function () {
    // Código que se ejecuta después del renderizado
  },
});
```

**2. Gestión de estado reactiva:**

```javascript
// ✅ Correcto: Siempre llamar apply() después de cambiar estado
this.counter++;
this.apply();

// ❌ Incorrecto: No llamar apply() - la vista no se actualizará
this.counter++;
```

**3. Binding de modelos (two-way data binding):**

```javascript
// En el controller
this.usuario = { nombre: "", email: "" };

// En el template
`<input type="text" model="usuario.nombre" placeholder="Nombre">
 <input type="email" model="usuario.email" placeholder="Email">
 <p>Hola ${this.usuario.nombre}!</p>`;
```

**4. Eventos HTML optimizados:**

```javascript
// Eventos sin parámetros (recibe el evento)
this.onClick = function (event) {
  console.log(event.target);
};
// Template: onclick="onClick()"

// Eventos con parámetros
this.onButtonClick = function (id, action, event) {
  console.log(id, action, event);
};
// Template: onclick="onButtonClick(123, 'delete')"
```

**5. Router para SPAs:**

```javascript
const router = Router([
  { path: "/", controller: HomeComponent, alias: "home" },
  { path: "/users/:id", controller: UserComponent, alias: "user" },
]);

// Navegación programática
router.navigate("/users/123");

// Acceso a parámetros en el componente
console.log(router.params.id); // "123"
```

**6. Modales reutilizables:**

```javascript
Modal({
  controller: function () {
    this.confirmar = function () {
      // Lógica de confirmación
      this.close(); // Cerrar modal
    };
  },
  render: function () {
    return `
      <div style="padding: 2rem;">
        <h3>¿Estás seguro?</h3>
        <button onclick="confirmar()">Sí</button>
        <button onclick="this.close()">No</button>
      </div>
    `;
  },
  hideWhenClickOverlay: true,
});
```

### Ciclo de Vida de Componentes

```javascript
Component({
  controller: function () {
    // 1. Inicialización - Se ejecuta al crear el componente
    this.data = [];

    // 2. Métodos del componente
    this.loadData = function () {
      // Simular carga de datos
      this.data = ["item1", "item2"];
      this.apply(); // 3. Actualizar vista
    };

    // 4. Cleanup (si es necesario)
    this.onDestroy = function () {
      // Limpiar timers, listeners, etc.
    };
  },
  render: function () {
    // 5. Renderizado - Se ejecuta cada vez que se llama apply()
    return `<div>...</div>`;
  },
  postRender: function () {
    // 6. Post-renderizado - Después de que el DOM esté listo
    this.loadData();
  },
});
```

### Comunicación entre Componentes

**1. Pasar datos a través de atributos:**

```javascript
// Componente padre
`<child-component data-message="Hola" data-count="5" autoload></child-component>`;

// Componente hijo
Component({
  tagName: "child-component",
  controller: function () {
    // Los atributos están disponibles automáticamente
    console.log(this.message, this.count); // "Hola", "5"
  },
});
```

**2. Eventos personalizados:**

```javascript
// Componente hijo
Component({
  tagName: "child-component",
  controller: function () {
    this.sendMessage = function () {
      // Disparar evento personalizado
      this.element.dispatchEvent(
        new CustomEvent("childMessage", {
          detail: { message: "Hola desde el hijo" },
        })
      );
    };
  },
});

// Componente padre
Component({
  postRender: function () {
    document.querySelector("child-component").addEventListener("childMessage", (e) => {
      console.log(e.detail.message);
    });
  },
});
```

### Manejo de Arrays y Listas

```javascript
Component({
  controller: function () {
    this.items = ["Item 1", "Item 2", "Item 3"];

    this.addItem = function () {
      this.items.push(`Item ${this.items.length + 1}`);
      this.apply();
    };

    this.removeItem = function (index) {
      this.items.splice(index, 1);
      this.apply();
    };

    this.moveItem = function (fromIndex, toIndex) {
      const item = this.items.splice(fromIndex, 1)[0];
      this.items.splice(toIndex, 0, item);
      this.apply();
    };
  },
  render: function () {
    return `
      <div>
        ${this.items
          .map(
            (item, index) => `
          <div style="display: flex; align-items: center; padding: 0.5rem;">
            <span style="flex: 1;">${item}</span>
            <button onclick="removeItem(${index})">Eliminar</button>
          </div>
        `
          )
          .join("")}
        <button onclick="addItem()">Añadir Item</button>
      </div>
    `;
  },
});
```

### Consejos de Rendimiento

1. **Usar apply() solo cuando sea necesario** - Solo después de cambios de estado
2. **Componentes pequeños y enfocados** - Un componente = una responsabilidad
3. **Aprovechar lazy loading para imágenes** - `<img lazy src="...">`
4. **Usar fadeIn para animaciones** - `<div fadeIn>...</div>`
5. **Estilos scoped por componente** - Evita conflictos CSS
6. **Evitar manipulación DOM directa** - Usar el sistema reactivo
7. **Validar datos antes de renderizar** - Especialmente arrays/objetos nulos

### Errores Comunes a Evitar

1. **No llamar apply()** después de cambiar el estado
2. **Manipular DOM directamente** en lugar de usar el sistema reactivo
3. **No limpiar listeners** en onDestroy (si se usa)
4. **Componentes demasiado grandes** - Mejor dividir en subcomponentes
5. **No validar datos** antes de renderizar (especialmente arrays/objetos nulos)
6. **Usar innerHTML directamente** - Mejor usar el sistema de templates
7. **No gestionar errores** en operaciones asíncronas

### Casos de Uso Ideales para ScopeJS

- ✅ **SPAs pequeñas y medianas** con Router
- ✅ **Dashboards interactivos** con widgets reutilizables
- ✅ **Formularios complejos** con validación
- ✅ **Aplicaciones CRUD** básicas
- ✅ **Prototipos rápidos** y MVPs
- ✅ **Landing pages dinámicas**
- ✅ **Componentes web** independientes
- ✅ **Aplicaciones de gestión** simples

### Cuándo NO usar ScopeJS

- ❌ **Aplicaciones muy grandes** (mejor React/Vue/Angular)
- ❌ **Necesidades de SSR críticas**
- ❌ **Ecosistemas muy específicos** (ej: React Native)
- ❌ **Equipos grandes** que necesitan tooling avanzado
- ❌ **Aplicaciones con estado muy complejo**
- ❌ **Necesidades de testing avanzado**

### Plantillas de Código Comunes

**Componente de Lista:**

```javascript
Component({
  tagName: "dynamic-list",
  controller: function () {
    this.items = [];
    this.newItem = "";

    this.addItem = function () {
      if (this.newItem.trim()) {
        this.items.push(this.newItem.trim());
        this.newItem = "";
        this.apply();
      }
    };
  },
  render: function () {
    return `
      <div>
        <input model="newItem" placeholder="Nuevo item" onkeyup="if(event.key==='Enter') addItem()">
        <button onclick="addItem()">Añadir</button>
        <ul>
          ${this.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  },
});
```

**Componente de Formulario:**

```javascript
Component({
  tagName: "user-form",
  controller: function () {
    this.user = { name: "", email: "", age: "" };
    this.errors = {};

    this.validate = function () {
      this.errors = {};
      if (!this.user.name) this.errors.name = "Nombre requerido";
      if (!this.user.email) this.errors.email = "Email requerido";
      this.apply();
      return Object.keys(this.errors).length === 0;
    };

    this.submit = function (e) {
      e.preventDefault();
      if (this.validate()) {
        console.log("Usuario válido:", this.user);
      }
    };
  },
  render: function () {
    return `
      <form onsubmit="submit()">
        <input model="user.name" placeholder="Nombre" oninput="validate()">
        ${this.errors.name ? `<span style="color:red">${this.errors.name}</span>` : ""}
        
        <input model="user.email" type="email" placeholder="Email" oninput="validate()">
        ${this.errors.email ? `<span style="color:red">${this.errors.email}</span>` : ""}
        
        <button type="submit">Enviar</button>
      </form>
    `;
  },
});
```

## Novedades V2.0.4

### Optimizaciones y Refactorización

- **Arquitectura modular**: El código ha sido refactorizado en clases especializadas para mejor mantenimiento
- **Mejores prácticas**: Uso de Map en lugar de objetos planos para mejor rendimiento
- **Optimización DOM**: Reducción significativa de manipulaciones DOM innecesarias
- **Gestión de memoria**: Mejor limpieza de estilos y componentes destruidos
- **Manejo de eventos optimizado**: Sistema más eficiente para binding de eventos HTML
- **Compatibilidad mantenida**: Todas las APIs públicas mantienen compatibilidad total

# Component

Crea un componente con capacidad de renderizado y control.

| Parámetro    | Descripción                                                                                                                                               | Tipo    | Opcional |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| `controller` | Controlador lógico del componente, donde se define la lógica que manejará las interacciones y el estado del mismo.                                        | Función | No       |
| `render`     | Función de renderizado del componente, responsable de retornar el HTML que representa visualmente el componente.                                          | Función | No       |
| `postRender` | Función que se ejecuta inmediatamente después de que el componente ha sido renderizado en el DOM, útil para realizar ajustes finales o registrar eventos. | Función | Sí       |
| `tagName`    | Etiqueta HTML asociada al componente, que define cómo se representa el componente en el HTML.                                                             | Cadena  | Sí       |
|              |

```javascript
Component({
  title: "Titulo", // Titulo de la pagina dentro del head
  meta: [
    {
      name: "description",
      content: "Mi componente",
    },
  ],
  style: `
    p {
      color: red;
    }
  `,
  tagName: "my-component",
  controller: function () {
    // Lógica aquí
  },
  render: function () {
    return "Hola Mundo";
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Eventos

Utiliza los eventos nativos de los elementos dentro del contexto del componente. Aquí se muestra un ejemplo de cómo manejar clics en botones.

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.handleClic = function (e) {
      // Por defecto, si no se pasan argumentos, se recibe el evento
      console.log(e.target);
    };
  },
  render: function () {
    return '<button onclick="handleClic()">click aquí</button>';
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

Aquí hay otro ejemplo que muestra cómo pasar parámetros a la función del controlador.

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.handleClic = function (opcion) {
      console.log(opcion); // 1 / 0
    };
  },
  render: function () {
    return `
      <button onclick="handleClic(1)">Aceptar</button>
      <button onclick="handleClic(0)">Cancelar</button>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Actualizar vista

Al actualizar el estado de una variable del contexto, se puede actualizar la vista con `apply()`. Esta acción solo actualizará lo que ha sido modificado dentro del DOM, es decir, no recargará todo el componente. Se actualizará a nivel atómico, afectando solo elementos específicos como un texto, un atributo, una clase, etc.

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.count = 1;
    this.handleClic = function (cantidad) {
      this.count += cantidad;
      this.apply(); // Renderiza de nuevo SOLO EL TEXTO DEL SPAN
    };
  },
  render: function () {
    return `
      <span>${this.count}</span>
      <button onclick="handleClic(1)">Sumar</button>
      <button onclick="handleClic(-1)">Restar</button>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Formularios

Con el atributo model, podemos asignar una variable del contexto a un campo de un formulario, la cual se actualizará en tiempo real con el valor del campo.

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.name = "";
    this.onSubmit = function (e) {
      e.preventDefault();
      console.log(this.name); // al ejecutar el formulario
    };
    this.onInput = function (e) {
      console.log(this.name); // se ira mostrando en tiempo real
    };
  },
  render: function () {
    return `
      <form onsubmit="onSubmit()">
        <input type="text" oninput="onInput()" model="name" />
        <button>Guardar</button>
      </form>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Renderizado

Existen dos métodos para renderizar elementos:

1. **A través de JavaScript**

   ```javascript
   const component = Component({
     controller: function () {
       // Lógica aquí
     },
     render: function () {
       return "Hola Mundo";
     },
     postRender: function () {
       // Lógica aquí
     },
   });

   component.render(document.body);
   ```

2. **Desde el HTML directamente**

   ```javascript
   const component = Component({
     tagName: "my-component",
     controller: function () {
      console.log(this.x, this.y); // Accede directamente a los atributos del DOM
       // Lógica aquí
     },
     render: function () {
       return "Hola Mundo";
     },
     postRender: function () {
       // Lógica aquí
     },
   });

    <!-- Si lo llamas desde otro componente de Scope no es necesario el autoload !>
   <my-component autoload x='1' y='2'></my-component>;
   ```

## Funciones Adicionales

### Fade In

Es posible implementar una animación de entrada para los elementos que aparecen en el viewport al hacer scroll, simplemente añadiendo el atributo `fadeIn` a los elementos:

```html
<img fadeIn src="" />
```

### Carga Diferida de Imágenes (Lazy Load)

Se puede evitar que las imágenes bloqueen la ejecución de la página, permitiendo que se carguen de manera paralela al hilo principal. Las imágenes se pintarán únicamente cuando hayan sido completamente cargadas, agregando el atributo `lazy`:

```html
<img lazy src="" />
```

### Transiciones de Vista (View Transitions)

Actualmente, las transiciones de vista se aplican de manera predeterminada utilizando únicamente el ID de los elementos. Si en dos páginas se tienen elementos con el mismo ID, la transición se ejecutará automáticamente:

```html
Page1 Page2 <img id="image_1" /> -> <img id="image_1" />
```

# Router

Este componente facilita la gestión de rutas del navegador, permitiendo enlazarlas a componentes previamente definidos.

Este módulo permite gestionar la navegación en una aplicación web mediante la definición de rutas y sus correspondientes controladores. Al crear una instancia de `Router` y proporcionar un arreglo de rutas, puedes controlar la navegación entre diferentes vistas de manera sencilla. Además, el método `render` se encarga de renderizar el controlador asociado a la ruta actual en el contenedor especificado.

```javascript
const router = Router(
  [
    {
      path: "/",
      controller: AppController,
      alias: "home",
    },
    {
      path: "/:id",
      controller: AppController,
      alias: "item",
    },
  ],
  {
    useHash: true, // Valor por defecto es true
  }
);
```

Si deseas desactivar el uso del hash en la URL (`useHash: false`), es necesario añadir el siguiente archivo `.htaccess` para gestionar las rutas a nivel del servidor:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Métodos

### Renderizar la ruta actual

Renderiza la ruta actual en el contenedor proporcionado (en este caso, `document.body`).

```javascript
router.render(document.body);
```

### Acceder a los parámetros de la ruta

Permite acceder a los parámetros de la ruta actual.

```javascript
const id = router.params.id;
```

### Acceder al alias actual

Accede al alias de la ruta actual.

```javascript
const alias = router.alias;
```

### Navegar a una ruta específica

Permite navegar a una ruta determinada.

```javascript
router.navigate("/1");
```

### Escuchar cambios de ruta

Escucha los cambios de ruta. **Nota**: no debe usarse dentro de un controlador de ruta, solo en componentes independientes.

```javascript
router.listen((params) => {
  // Se ejecuta cada vez que cambia la ruta
});
```

# Modal

Esta función crea y muestra un modal en la interfaz de usuario.

| Parámetro              | Descripción                                                                          | Tipo     | Opcional |
| ---------------------- | ------------------------------------------------------------------------------------ | -------- | -------- |
| `controller`           | Controlador del modal, donde se define la lógica y el comportamiento del mismo.      | Función  | No       |
| `render`               | Función de renderizado que define cómo se mostrará el contenido del modal.           | Función  | No       |
| `hideWhenClickOverlay` | Indica si el modal debe cerrarse al hacer clic en el fondo de la pantalla (overlay). | Booleano | Sí       |
| `params`               | Parámetros adicionales que se pueden pasar a la función de renderizado del modal.    | Objeto   | Sí       |

```javascript
Modal({
  controller: function () {
    this.counter = 0;
    setInterval(() => {
      this.counter++;
      this.apply();
      if (this.counter === 5) this.close();
    }, 1000);
  },
  render: function () {
    return `${this.counter}`;
  },
});
```

Este código crea un modal con un contador que se incrementa cada segundo. El modal se cierra automáticamente cuando el contador alcanza 5.

# Licencia

Esta biblioteca de código abierto ha sido desarrollada por **Pablo Martínez**, y se distribuye bajo los términos de la licencia Apache. El código es proporcionado "tal cual", sin garantía alguna de su funcionamiento, uso o adecuación a un propósito específico. Se permite la redistribución y modificación, siempre que se mantenga la atribución original al autor.

Para consultas o colaboraciones, puedes contactarme en:

- [Github ScopeJS](https://github.com/PabloTheBlink/ScopeJS)
- [Github autor](https://github.com/PabloTheBlink)
- [LinkedIn](https://www.linkedin.com/in/pablo-mart%C3%ADnez-san-jos%C3%A9-9bb24215a)
- [Instagram](https://www.instagram.com/PabloTheBlink)

El uso de esta biblioteca implica la aceptación de los términos de la licencia.
