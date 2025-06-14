# Instalación (Súper Fácil)

Esta librería ha sido desarrollada utilizando módulos ES (ES Modules) y puede ser usada directamente desde uno de los siguientes CDN (¡porque la vida es muy corta para complicarse!):

```javascript
import { Component, Router, Modal } from "https://cdn.jsdelivr.net/gh/pablotheblink/ScopeJS/js/ScopeJS.min.js";
```

# Ejemplos Prácticos (Que Realmente Funcionan)

Esta sección contiene ejemplos completos y funcionales para diferentes casos de uso comunes. Porque los ejemplos que no funcionan son como promesas de político en época electoral 😏

## Ejemplo 1: Contador Interactivo (El Clásico)

Un contador simple que demuestra el manejo de estado y eventos. ¡Perfecto para empezar sin quemarte las neuronas!

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Contador ScopeJS (¡Mi Primera Obra Maestra!)</title>
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
                /* Porque hasta los contadores merecen verse bien */
            `,
        controller: function () {
          this.count = 0;
          this.step = 1;

          this.increment = function () {
            this.count += this.step;
            this.apply(); // ¡La magia pura!
          };

          this.decrement = function () {
            this.count -= this.step;
            this.apply();
          };

          this.reset = function () {
            this.count = 0;
            this.apply(); // Siempre acuérdate del apply()
          };

          this.changeStep = function () {
            // El step se actualiza automáticamente por el model binding (¡genial, ¿no?!)
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
                        ${this.count > 10 ? "¡Excelente! 🎉" : this.count < 0 ? "Valor negativo 😬" : "Sigue contando 😊"}
                    </p>
                `;
        },
      });
    </script>
  </body>
</html>
```

## Ejemplo 2: Lista de Tareas (Todo List) - El Proyecto Que Todo Dev Ha Hecho

Una aplicación completa de gestión de tareas que te va a impresionar (¡y a ti mismo!):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Lista de Tareas - Productividad Level 💯</title>
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
                /* Porque las tareas merecen un hogar bonito */
            `,
        controller: function () {
          this.tasks = [
            { id: 1, text: "Aprender ScopeJS", completed: false, priority: "high" },
            { id: 2, text: "Crear mi primera app", completed: false, priority: "medium" },
            // Ya tienes dos tareas para empezar 😉
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
            this.apply(); // ¡No te olvides nunca de esto!
          };

          this.toggleTask = function (id) {
            const task = this.tasks.find((t) => t.id === id);
            if (task) {
              task.completed = !task.completed;
              this.apply();
            }
          };

          this.deleteTask = function (id) {
            // Confirmación con estilo - ¡usando nuestro propio Modal!
            Modal({
              controller: function () {
                this.confirm = function () {
                  const index = this.tasks.findIndex((t) => t.id === id);
                  if (index > -1) {
                    this.tasks.splice(index, 1);
                    this.apply();
                  }
                  this.close();
                }.bind(this); // Bind para mantener el contexto

                this.cancel = function () {
                  this.close();
                };
              }.bind(this),
              render: function () {
                return `
                                <div style="padding: 2rem; text-align: center;">
                                    <h3>¿Eliminar tarea? 🤔</h3>
                                    <p>Esta acción no se puede deshacer (¡no somos Google Drive!).</p>
                                    <div style="margin-top: 1rem;">
                                        <button onclick="cancel()" style="margin: 0.5rem; padding: 0.5rem 1rem;">
                                            Cancelar
                                        </button>
                                        <button onclick="confirm()" style="margin: 0.5rem; padding: 0.5rem 1rem; background: red; color: white; border: none; border-radius: 4px;">
                                            Eliminar 🗑️
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
                    
                    <!-- Estadísticas (porque los números molan) -->
                    <div style="background: #f5f5f5; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
                        <strong>Total: ${stats.total}</strong> | 
                        <span style="color: orange;">Pendientes: ${stats.pending}</span> | 
                        <span style="color: green;">Completadas: ${stats.completed}</span>
                    </div>
                    
                    <!-- Formulario (donde nace la productividad) -->
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
                                <option value="low">Baja 😌</option>
                                <option value="medium" selected>Media 😐</option>
                                <option value="high">Alta 🔥</option>
                            </select>
                            <button type="submit" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                Añadir ➕
                            </button>
                        </div>
                    </form>
                    
                    <!-- Filtros (para los perfeccionistas) -->
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
                    
                    <!-- Lista de tareas (el corazón del asunto) -->
                    <div>
                        ${
                          filteredTasks.length === 0
                            ? `<p style="text-align: center; color: #999; font-style: italic;">
                                ${this.filter === "all" ? "No hay tareas 🎉" : this.filter === "active" ? "No hay tareas pendientes 🏖️" : "No hay tareas completadas 😴"}
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
                                        ${task.priority === "high" ? "Alta 🔥" : task.priority === "medium" ? "Media 😐" : "Baja 😌"}
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

## Ejemplo 3: Formulario de Contacto con Validación (El Profesional)

Un formulario completo con validaciones y manejo de envío que impresiona hasta a tu jefe:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario de Contacto - Nivel Pro 🚀</title>
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
                /* Un formulario digno de ser llenado */
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
            delete this.errors[field]; // Limpiar errores previos

            switch (field) {
              case "name":
                if (!value.trim()) this.errors[field] = "El nombre es requerido (¡no seas tímido!)";
                else if (value.trim().length < 2) this.errors[field] = "El nombre debe tener al menos 2 caracteres";
                break;
              case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) this.errors[field] = "El email es requerido";
                else if (!emailRegex.test(value)) this.errors[field] = "Email inválido (revisa que esté bien escrito)";
                break;
              case "subject":
                if (!value.trim()) this.errors[field] = "El asunto es requerido";
                break;
              case "message":
                if (!value.trim()) this.errors[field] = "El mensaje es requerido";
                else if (value.trim().length < 10) this.errors[field] = "El mensaje debe tener al menos 10 caracteres (¡cuenta una historia!)";
                break;
            }

            this.apply(); // Actualizar vista con errores
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
                                        <h3>❌ Oops! Hay errores en el formulario</h3>
                                        <p>Por favor, corrige los errores antes de enviar. ¡Tú puedes! 💪</p>
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

            // Simular envío al servidor (porque no tenemos backend todavía)
            setTimeout(() => {
              this.isSubmitting = false;
              this.submitted = true;
              this.apply();

              // Mostrar modal de éxito (celebremos los pequeños triunfos)
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
                                        <h3>✅ ¡Mensaje enviado con éxito! 🎉</h3>
                                        <p>Gracias por contactarnos. Te responderemos más rápido que Flash corriendo.</p>
                                        <button onclick="reset()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px;">
                                            Enviar otro mensaje
                                        </button>
                                    </div>
                                `;
                },
                hideWhenClickOverlay: false,
              });
            }, 2000); // 2 segundos para crear suspense
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
                            <h2>✅ ¡Gracias por contactarnos! 🎊</h2>
                            <p>Tu mensaje ha sido enviado correctamente. ¡Eres increíble!</p>
                            <button onclick="resetForm()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                Enviar otro mensaje
                            </button>
                        </div>
                    `;
          }

          return `
                    <h1>📧 Formulario de Contacto</h1>
                    
                    <form onsubmit="submitForm()">
                        <!-- Nombre (porque queremos saber con quién hablamos) -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Nombre * 👤
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
                        
                        <!-- Email (fundamental para responderte) -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Email * 📧
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
                        
                        <!-- Asunto (para saber de qué va el tema) -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Asunto * 📝
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
                        
                        <!-- Urgencia (para priorizar) -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Urgencia ⏰
                            </label>
                            <select model="formData.urgency" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                <option value="low">Baja - Respuesta en 5-7 días (relájate) 😌</option>
                                <option value="normal" selected>Normal - Respuesta en 2-3 días (estándar) 😐</option>
                                <option value="high">Alta - Respuesta en 24 horas (corriendo) 🏃‍♂️</option>
                                <option value="urgent">Urgente - Respuesta inmediata (modo Flash) ⚡</option>
                            </select>
                        </div>
                        
                        <!-- Mensaje (aquí está la magia) -->
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">
                                Mensaje * 💬
                            </label>
                            <textarea 
                                model="formData.message"
                                oninput="validateField('message')"
                                rows="5"
                                style="width: 100%; padding: 0.75rem; border: 1px solid ${this.errors.message ? "#dc3545" : "#ddd"}; border-radius: 4px; box-sizing: border-box; resize: vertical;"
                                placeholder="Escribe tu mensaje aquí... ¡Cuéntanos todo!"
                            ></textarea>
                            ${this.errors.message ? `<div style="color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;">${this.errors.message}</div>` : ""}
                        </div>
                        
                        <!-- Botones (la decisión final) -->
                        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                            <button 
                                type="button" 
                                onclick="resetForm()"
                                style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;"
                                ${this.isSubmitting ? "disabled" : ""}
                            >
                                Limpiar 🧹
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

### Patrones Comunes de Uso (La Guía del Ninja)

**1. Estructura básica de un componente (el fundamento de todo):**

```javascript
Component({
  tagName: "mi-componente", // Nombre del elemento HTML personalizado
  style: `/* CSS scoped - solo para este componente */`,
  title: "Título de la página", // Título que aparecerá en el <head>
  meta: [{ name: "description", content: "..." }], // Meta tags para SEO (¡importante!)
  controller: function () {
    // Estado del componente (aquí vive la magia)
    this.variable = valor;

    // Métodos del componente (las funciones que hacen cosas)
    this.miMetodo = function () {
      // Lógica aquí
      this.apply(); // ¡Importante! Actualizar vista después de cambios
    };
  },
  render: function () {
    return `HTML template con ${this.variable}`;
  },
  postRender: function () {
    // Código que se ejecuta después del renderizado (para ajustes finales)
  },
});
```

**2. Gestión de estado reactiva (sin complicaciones):**

```javascript
// ✅ Correcto: Siempre llamar apply() después de cambiar estado
this.counter++;
this.apply(); // ¡Esta línea es oro puro!

// ❌ Incorrecto: No llamar apply() - la vista no se actualizará (rookie mistake)
this.counter++;
```

**3. Binding de modelos (two-way data binding automático):**

```javascript
// En el controller
this.usuario = { nombre: "", email: "" };

// En el template (magia pura)
`<input type="text" model="usuario.nombre" placeholder="Nombre">
 <input type="email" model="usuario.email" placeholder="Email">
 <p>Hola ${this.usuario.nombre}! 👋</p>`;
```

**4. Eventos HTML optimizados (fácil como respirar):**

```javascript
// Eventos sin parámetros (recibe el evento)
this.onClick = function (event) {
  console.log(event.target);
};
// Template: onclick="onClick()"

// Eventos con parámetros (porque a veces necesitas más info)
this.onButtonClick = function (id, action, event) {
  console.log(id, action, event);
};
// Template: onclick="onButtonClick(123, 'delete')"
```

**5. Router para SPAs (navegación sin dolores de cabeza):**

```javascript
const router = Router([
  { path: "/", controller: HomeComponent, alias: "home" },
  { path: "/users/:id", controller: UserComponent, alias: "user" },
]);

// Navegación programática (como un jefe)
router.navigate("/users/123");

// Acceso a parámetros en el componente
console.log(router.params.id); // "123" - ¡fácil!
```

**6. Modales reutilizables (elegantes y funcionales):**

```javascript
Modal({
  controller: function () {
    this.confirmar = function () {
      // Lógica de confirmación
      this.close(); // Cerrar modal (chao pescao)
    };
  },
  render: function () {
    return `
      <div style="padding: 2rem;">
        <h3>¿Estás seguro? 🤔</h3>
        <button onclick="confirmar()">Sí, dale 👍</button>
        <button onclick="this.close()">No, mejor no 👎</button>
      </div>
    `;
  },
  hideWhenClickOverlay: true, // Cerrar al hacer clic fuera
});
```

### Ciclo de Vida de Componentes (El Journey Completo)

```javascript
Component({
  controller: function () {
    // 1. Inicialización - Se ejecuta al crear el componente
    this.data = [];
    console.log("¡Componente naciendo! 👶");

    // 2. Métodos del componente
    this.loadData = function () {
      // Simular carga de datos
      this.data = ["item1", "item2"];
      this.apply(); // 3. Actualizar vista
    };

    // 4. Cleanup (si es necesario)
    this.onDestroy = function () {
      // Limpiar timers, listeners, etc.
      console.log("Adiós mundo cruel... 💀");
    };
  },
  render: function () {
    // 5. Renderizado - Se ejecuta cada vez que se llama apply()
    return `<div>...</div>`;
  },
  postRender: function () {
    // 6. Post-renderizado - Después de que el DOM esté listo
    this.loadData();
    console.log("¡Todo listo para la acción! 🚀");
  },
});
```

### Comunicación entre Componentes (Hablando el mismo idioma)

**1. Pasar datos a través de atributos (el método clásico):**

```javascript
// Componente padre
`<child-component data-message="Hola" data-count="5" autoload></child-component>`;

// Componente hijo
Component({
  tagName: "child-component",
  controller: function () {
    // Los atributos están disponibles automáticamente (¡magia!)
    console.log(this.message, this.count); // "Hola", "5"
  },
});
```

**2. Eventos personalizados (para comunicación avanzada):**

```javascript
// Componente hijo
Component({
  tagName: "child-component",
  controller: function () {
    this.sendMessage = function () {
      // Disparar evento personalizado
      this.element.dispatchEvent(
        new CustomEvent("childMessage", {
          detail: { message: "Hola desde el hijo 👋" },
        })
      );
    };
  },
});

// Componente padre (escuchando como buen padre)
Component({
  postRender: function () {
    document.querySelector("child-component").addEventListener("childMessage", (e) => {
      console.log(e.detail.message);
    });
  },
});
```

### Manejo de Arrays y Listas (Porque la vida son datos)

```javascript
Component({
  controller: function () {
    this.items = ["Item 1", "Item 2", "Item 3"];

    this.addItem = function () {
      this.items.push(`Item ${this.items.length + 1}`);
      this.apply(); // ¡No te olvides!
    };

    this.removeItem = function (index) {
      this.items.splice(index, 1);
      this.apply();
    };

    this.moveItem = function (fromIndex, toIndex) {
      const item = this.items.splice(fromIndex, 1)[0];
      this.items.splice(toIndex, 0, item);
      this.apply(); // Magia de reorganización
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
            <button onclick="removeItem(${index})">Eliminar 🗑️</button>
          </div>
        `
          )
          .join("")}
        <button onclick="addItem()">Añadir Item ➕</button>
      </div>
    `;
  },
});
```

### Consejos de Rendimiento (Para que vuele como cohete 🚀)

1. **Usar apply() solo cuando sea necesario** - Solo después de cambios de estado
2. **Componentes pequeños y enfocados** - Un componente = una responsabilidad (SOLID rules!)
3. **Aprovechar lazy loading para imágenes** - `<img lazy src="...">` (porque la velocidad importa)
4. **Usar fadeIn para animaciones** - `<div fadeIn>...</div>` (transiciones suaves)
5. **Estilos scoped por componente** - Evita conflictos CSS (la paz mundial del CSS)
6. **Evitar manipulación DOM directa** - Usar el sistema reactivo (déjanos hacer la magia)
7. **Validar datos antes de renderizar** - Especialmente arrays/objetos nulos (mejor prevenir que lamentar)

### Errores Comunes a Evitar (Aprende de los errores de otros)

1. **No llamar apply()** después de cambiar el estado (el error del millón de dólares)
2. **Manipular DOM directamente** en lugar de usar el sistema reactivo (no seas rebelde)
3. **No limpiar listeners** en onDestroy (memory leaks are not cool)
4. **Componentes demasiado grandes** - Mejor dividir en subcomponentes (divide y vencerás)
5. **No validar datos** antes de renderizar (crashes no son divertidos)
6. **Usar innerHTML directamente** - Mejor usar el sistema de templates (we got you covered)
7. **No gestionar errores** en operaciones asíncronas (siempre ten un plan B)

### Casos de Uso Ideales para ScopeJS (Donde brillamos)

- ✅ **SPAs pequeñas y medianas** con Router (our sweet spot)
- ✅ **Dashboards interactivos** con widgets reutilizables (dashboards that impress)
- ✅ **Formularios complejos** con validación (forms that actually work)
- ✅ **Aplicaciones CRUD** básicas (create, read, update, delete made easy)
- ✅ **Prototipos rápidos** y MVPs (from idea to reality in minutes)
- ✅ **Landing pages dinámicas** (landing pages with superpowers)
- ✅ **Componentes web** independientes (reusable pieces of awesomeness)
- ✅ **Aplicaciones de gestión** simples (management apps without the complexity)

### Cuándo NO usar ScopeJS (Honestidad ante todo)

- ❌ **Aplicaciones muy grandes** (mejor React/Vue/Angular - they're built for that)
- ❌ **Necesidades de SSR críticas** (server-side rendering is not our thing)
- ❌ **Ecosistemas muy específicos** (ej: React Native - different worlds)
- ❌ **Equipos grandes** que necesitan tooling avanzado (enterprise level stuff)
- ❌ **Aplicaciones con estado muy complejo** (state management nightmares)
- ❌ **Necesidades de testing avanzado** (unit testing frameworks paradise)

### Plantillas de Código Comunes (Copy & Paste Paradise)

**Componente de Lista (el básico que siempre necesitas):**

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
        this.apply(); // ¡La línea de oro!
      }
    };
  },
  render: function () {
    return `
      <div>
        <input model="newItem" placeholder="Nuevo item" onkeyup="if(event.key==='Enter') addItem()">
        <button onclick="addItem()">Añadir ➕</button>
        <ul>
          ${this.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  },
});
```

**Componente de Formulario (validation included):**

```javascript
Component({
  tagName: "user-form",
  controller: function () {
    this.user = { name: "", email: "", age: "" };
    this.errors = {};

    this.validate = function () {
      this.errors = {};
      if (!this.user.name) this.errors.name = "Nombre requerido 📛";
      if (!this.user.email) this.errors.email = "Email requerido 📧";
      this.apply();
      return Object.keys(this.errors).length === 0;
    };

    this.submit = function (e) {
      e.preventDefault();
      if (this.validate()) {
        console.log("Usuario válido:", this.user);
        // Aquí harías algo genial con los datos
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
        
        <button type="submit">Enviar 🚀</button>
      </form>
    `;
  },
});
```

## Novedades V2.0.4 (Las Mejoras que Esperabas)

### Optimizaciones y Refactorización (Under the Hood Magic)

- **Arquitectura modular**: El código ha sido refactorizado en clases especializadas para mejor mantenimiento (clean code rules!)
- **Mejores prácticas**: Uso de Map en lugar de objetos planos para mejor rendimiento (porque los milisegundos importan)
- **Optimización DOM**: Reducción significativa de manipulaciones DOM innecesarias (surgical precision)
- **Gestión de memoria**: Mejor limpieza de estilos y componentes destruidos (no more memory leaks)
- **Manejo de eventos optimizado**: Sistema más eficiente para binding de eventos HTML (smoother than silk)
- **Compatibilidad mantenida**: Todas las APIs públicas mantienen compatibilidad total (upgrade without fear)

# Component (El Corazón de Todo)

Crea un componente con capacidad de renderizado y control. Es como crear tu propio elemento HTML personalizado, pero con superpoderes.

| Parámetro    | Descripción                                                                                                                                                                      | Tipo    | Opcional |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- |
| `controller` | Controlador lógico del componente, donde se define la lógica que manejará las interacciones y el estado del mismo. (El cerebro del asunto)                                       | Función | No       |
| `render`     | Función de renderizado del componente, responsable de retornar el HTML que representa visualmente el componente. (La cara bonita)                                                | Función | No       |
| `postRender` | Función que se ejecuta inmediatamente después de que el componente ha sido renderizado en el DOM, útil para realizar ajustes finales o registrar eventos. (Los retoques finales) | Función | Sí       |
| `tagName`    | Etiqueta HTML asociada al componente, que define cómo se representa el componente en el HTML. (Tu marca personal)                                                                | Cadena  | Sí       |

```javascript
Component({
  title: "Mi App Genial", // Titulo de la pagina dentro del head
  meta: [
    {
      name: "description",
      content: "Mi componente que va a cambiar el mundo",
    },
  ],
  style: `
    p {
      color: red;
      /* Estilos que solo afectan a este componente */
    }
  `,
  tagName: "my-component",
  controller: function () {
    // Lógica aquí (donde pasa la magia)
  },
  render: function () {
    return "Hola Mundo 👋"; // Tan simple como eso
  },
  postRender: function () {
    // Lógica aquí (para los detalles finales)
  },
});
```

## Eventos (Que Realmente Funcionan)

Utiliza los eventos nativos de los elementos dentro del contexto del componente. Aquí se muestra un ejemplo de cómo manejar clics en botones sin quebraderos de cabeza.

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.handleClic = function (e) {
      // Por defecto, si no se pasan argumentos, se recibe el evento
      console.log(e.target); // ¡Fácil!
    };
  },
  render: function () {
    return '<button onclick="handleClic()">click aquí 👆</button>';
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

Aquí hay otro ejemplo que muestra cómo pasar parámetros a la función del controlador (porque a veces necesitas más info).

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.handleClic = function (opcion) {
      console.log(opcion); // 1 / 0 - ¡Perfecto!
    };
  },
  render: function () {
    return `
      <button onclick="handleClic(1)">Aceptar ✅</button>
      <button onclick="handleClic(0)">Cancelar ❌</button>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Actualizar Vista (La Magia del apply())

Al actualizar el estado de una variable del contexto, se puede actualizar la vista con `apply()`. Esta acción solo actualizará lo que ha sido modificado dentro del DOM, es decir, no recargará todo el componente. Se actualizará a nivel atómico, afectando solo elementos específicos como un texto, un atributo, una clase, etc. ¡Eficiencia pura!

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.count = 1;
    this.handleClic = function (cantidad) {
      this.count += cantidad;
      this.apply(); // ¡La línea mágica! Renderiza de nuevo SOLO EL TEXTO DEL SPAN
    };
  },
  render: function () {
    return `
      <span>${this.count}</span>
      <button onclick="handleClic(1)">Sumar ➕</button>
      <button onclick="handleClic(-1)">Restar ➖</button>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Formularios (Two-Way Data Binding Automático)

Con el atributo model, podemos asignar una variable del contexto a un campo de un formulario, la cual se actualizará en tiempo real con el valor del campo. ¡Magia pura sin configuraciones raras!

```javascript
Component({
  tagName: "my-component",
  controller: function () {
    this.name = "";
    this.onSubmit = function (e) {
      e.preventDefault();
      console.log(this.name); // al ejecutar el formulario - ¡perfecto!
    };
    this.onInput = function (e) {
      console.log(this.name); // se ira mostrando en tiempo real - ¡increíble!
    };
  },
  render: function () {
    return `
      <form onsubmit="onSubmit()">
        <input type="text" oninput="onInput()" model="name" placeholder="Escribe tu nombre" />
        <button>Guardar 💾</button>
      </form>
    `;
  },
  postRender: function () {
    // Lógica aquí
  },
});
```

## Renderizado (Dos Formas de Hacerlo)

Existen dos métodos para renderizar elementos (elige tu favorito):

1. **A través de JavaScript (programático)**

   ```javascript
   const component = Component({
     controller: function () {
       // Lógica aquí
     },
     render: function () {
       return "Hola Mundo 👋";
     },
     postRender: function () {
       // Lógica aquí
     },
   });

   component.render(document.body); // ¡Boom! Ya está en pantalla
   ```

2. **Desde el HTML directamente (declarativo)**

   ```javascript
   const component = Component({
     tagName: "my-component",
     controller: function () {
      console.log(this.x, this.y); // Accede directamente a los atributos del DOM - ¡genial!
       // Lógica aquí
     },
     render: function () {
       return "Hola Mundo 👋";
     },
     postRender: function () {
       // Lógica aquí
     },
   });

    <!-- Si lo llamas desde otro componente de Scope no es necesario el autoload -->
   <my-component autoload x='1' y='2'></my-component>;
   ```

## Funciones Adicionales (Porque nos gusta dar más)

### Fade In (Animaciones Suaves)

Es posible implementar una animación de entrada para los elementos que aparecen en el viewport al hacer scroll, simplemente añadiendo el atributo `fadeIn` a los elementos:

```html
<img fadeIn src="mi-imagen-genial.jpg" />
<!-- ¡Aparece suavemente como por arte de magia! ✨ -->
```

### Carga Diferida de Imágenes (Lazy Load) - Para la Velocidad

Se puede evitar que las imágenes bloqueen la ejecución de la página, permitiendo que se carguen de manera paralela al hilo principal. Las imágenes se pintarán únicamente cuando hayan sido completamente cargadas, agregando el atributo `lazy`:

```html
<img lazy src="imagen-pesada.jpg" />
<!-- Solo se carga cuando realmente se necesita - ¡inteligente! 🧠 -->
```

### Transiciones de Vista (View Transitions) - Porque lo Smooth Mola

Actualmente, las transiciones de vista se aplican de manera predeterminada utilizando únicamente el ID de los elementos. Si en dos páginas se tienen elementos con el mismo ID, la transición se ejecutará automáticamente:

```html
Page1 Page2 <img id="image_1" /> -> <img id="image_1" />
<!-- ¡Transición automática entre páginas! 🔄 -->
```

# Router (Navegación Sin Dolores de Cabeza)

Este componente facilita la gestión de rutas del navegador, permitiendo enlazarlas a componentes previamente definidos. Es como tener un GPS para tu aplicación web.

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
    useHash: true, // Valor por defecto es true (funciona en todos lados)
  }
);
```

Si deseas desactivar el uso del hash en la URL (`useHash: false`), es necesario añadir el siguiente archivo `.htaccess` para gestionar las rutas a nivel del servidor (solo si sabes lo que haces):

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

## Métodos (Las Herramientas del Router)

### Renderizar la ruta actual

Renderiza la ruta actual en el contenedor proporcionado (en este caso, `document.body`).

```javascript
router.render(document.body); // ¡Y ya tienes SPA funcionando!
```

### Acceder a los parámetros de la ruta

Permite acceder a los parámetros de la ruta actual.

```javascript
const id = router.params.id; // Fácil acceso a parámetros dinámicos
```

### Acceder al alias actual

Accede al alias de la ruta actual.

```javascript
const alias = router.alias; // Para saber exactamente dónde estás
```

### Navegar a una ruta específica

Permite navegar a una ruta determinada.

```javascript
router.navigate("/1"); // Navegación programática - ¡como un jefe!
```

### Escuchar cambios de ruta

Escucha los cambios de ruta. **Nota**: no debe usarse dentro de un controlador de ruta, solo en componentes independientes.

```javascript
router.listen((params) => {
  // Se ejecuta cada vez que cambia la ruta - ¡perfecto para analytics!
});
```

# Modal (Ventanas Emergentes con Clase)

Esta función crea y muestra un modal en la interfaz de usuario. Porque los alerts del navegador están pasados de moda.

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
      if (this.counter === 5) this.close(); // Auto-cierre dramático
    }, 1000);
  },
  render: function () {
    return `
      <div style="padding: 2rem; text-align: center;">
        <h2>Contador: ${this.counter}</h2>
        <p>El modal se cerrará en ${5 - this.counter} segundos... ⏰</p>
      </div>
    `;
  },
});
```

Este código crea un modal con un contador que se incrementa cada segundo. El modal se cierra automáticamente cuando el contador alcanza 5. ¡Suspense garantizado!

# Licencia (Lo Legal, Pero Humano)

Esta biblioteca de código abierto ha sido desarrollada por **Pablo Martínez** con mucho ❤️ y café ☕, y se distribuye bajo los términos de la licencia Apache. El código es proporcionado "tal cual", sin garantía alguna de su funcionamiento, uso o adecuación a un propósito específico (pero hemos hecho nuestro mejor esfuerzo para que funcione genial). Se permite la redistribución y modificación, siempre que se mantenga la atribución original al autor (porque el crédito donde el crédito es debido).

Para consultas, colaboraciones, o simplemente para decir hola, puedes contactarme en:

- [Github ScopeJS](https://github.com/PabloTheBlink/ScopeJS) - El hogar del código
- [Github autor](https://github.com/PabloTheBlink) - Mis otros experimentos
- [LinkedIn](https://www.linkedin.com/in/pablo-mart%C3%ADnez-san-jos%C3%A9-9bb24215a) - Para cosas serias
- [Instagram](https://www.instagram.com/PabloTheBlink) - Para cosas menos serias 📸

El uso de esta biblioteca implica la aceptación de los términos de la licencia (y la promesa de crear cosas geniales con ella).

¡Ahora ve y construye algo increíble! 🚀✨
