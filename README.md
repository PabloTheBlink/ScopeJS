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

## Ejemplo 4: Aplicación de Una Sola Página (SPA) con Router

Una aplicación completa con navegación entre páginas:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi SPA con ScopeJS</title>
    <style>
      body {
        margin: 0;
        font-family: "Segoe UI", sans-serif;
      }
      .navbar {
        background: #343a40;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .navbar a {
        color: white;
        text-decoration: none;
        margin: 0 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background 0.3s;
      }
      .navbar a:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .navbar a.active {
        background: #007bff;
      }
      .content {
        padding: 2rem;
        min-height: calc(100vh - 140px);
      }
      .footer {
        background: #f8f9fa;
        text-align: center;
        padding: 1rem;
        border-top: 1px solid #ddd;
      }
    </style>
  </head>
  <body>
    <spa-app autoload></spa-app>

    <script type="module">
      import { Component, Router, Modal } from "https://cdn.devetty.es/ScopeJS/js";

      // Componente de navegación
      Component({
        tagName: "navbar-component",
        controller: function () {
          this.currentPath = "";

          this.isActive = function (path) {
            return this.currentPath === path ? "active" : "";
          };
        },
        render: function () {
          return `
                    <nav class="navbar">
                        <div>
                            <strong>Mi SPA</strong>
                        </div>
                        <div>
                            <a href="#/" class="${this.isActive("/")}">🏠 Inicio</a>
                            <a href="#/productos" class="${this.isActive("/productos")}">🛍️ Productos</a>
                            <a href="#/acerca" class="${this.isActive("/acerca")}">ℹ️ Acerca</a>
                            <a href="#/contacto" class="${this.isActive("/contacto")}">📧 Contacto</a>
                        </div>
                    </nav>
                `;
        },
      });

      // Página de inicio
      const HomePage = {
        title: "Inicio - Mi SPA",
        controller: function () {
          this.stats = {
            productos: 150,
            usuarios: 1250,
            ventas: 89,
          };

          this.showWelcome = function () {
            Modal({
              controller: function () {},
              render: function () {
                return `
                                <div style="padding: 2rem; text-align: center;">
                                    <h2>🎉 ¡Bienvenido!</h2>
                                    <p>Gracias por visitar nuestra aplicación.</p>
                                    <p>Esta es una demostración de ScopeJS con Router.</p>
                                    <button onclick="this.close()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                        ¡Genial!
                                    </button>
                                </div>
                            `;
              },
              hideWhenClickOverlay: true,
            });
          };
        },
        render: function () {
          return `
                    <div class="content">
                        <h1>🏠 Bienvenido a Mi SPA</h1>
                        <p>Esta es una aplicación de ejemplo construida con ScopeJS que demuestra:</p>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 8px; text-align: center;">
                                <h2>${this.stats.productos}</h2>
                                <p>Productos Disponibles</p>
                            </div>
                            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 2rem; border-radius: 8px; text-align: center;">
                                <h2>${this.stats.usuarios}</h2>
                                <p>Usuarios Registrados</p>
                            </div>
                            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 2rem; border-radius: 8px; text-align: center;">
                                <h2>${this.stats.ventas}%</h2>
                                <p>Satisfacción</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 2rem;">
                            <button onclick="showWelcome()" style="padding: 1rem 2rem; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer;">
                                🎉 ¡Mostrar Bienvenida!
                            </button>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
                            <h3>Características Demostradas:</h3>
                            <ul>
                                <li>📱 Navegación SPA con Router</li>
                                <li>🎨 Componentes reutilizables</li>
                                <li>💾 Gestión de estado local</li>
                                <li>🎭 Modales interactivos</li>
                                <li>📊 Renderizado dinámico</li>
                                <li>🔄 Actualizaciones reactivas</li>
                            </ul>
                        </div>
                    </div>
                `;
        },
      };

      // Página de productos
      const ProductsPage = {
        title: "Productos - Mi SPA",
        controller: function () {
          this.products = [
            { id: 1, name: "Laptop Pro", price: 1299, category: "tech", stock: 15, image: "💻" },
            { id: 2, name: "Smartphone X", price: 899, category: "tech", stock: 23, image: "📱" },
            { id: 3, name: "Cámara 4K", price: 599, category: "photo", stock: 8, image: "📷" },
            { id: 4, name: "Auriculares Pro", price: 299, category: "audio", stock: 34, image: "🎧" },
            { id: 5, name: "Tablet Plus", price: 449, category: "tech", stock: 12, image: "📟" },
            { id: 6, name: "Smartwatch", price: 199, category: "tech", stock: 45, image: "⌚" },
          ];
          this.filter = "all";
          this.cart = [];

          this.setFilter = function (category) {
            this.filter = category;
            this.apply();
          };

          this.getFilteredProducts = function () {
            if (this.filter === "all") return this.products;
            return this.products.filter((p) => p.category === this.filter);
          };

          this.addToCart = function (productId) {
            const product = this.products.find((p) => p.id === productId);
            if (product && product.stock > 0) {
              this.cart.push({ ...product });
              product.stock--;
              this.apply();

              // Mostrar confirmación
              Modal({
                controller: function () {},
                render: function () {
                  return `
                                    <div style="padding: 2rem; text-align: center;">
                                        <h3>✅ ¡Producto Añadido!</h3>
                                        <p>${product.name} ha sido añadido al carrito.</p>
                                        <p><strong>Carrito: ${this.cart.length} artículos</strong></p>
                                        <button onclick="this.close()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px;">
                                            Continuar Comprando
                                        </button>
                                    </div>
                                `;
                }.bind(this),
                hideWhenClickOverlay: true,
              });
            }
          };

          this.showCart = function () {
            const total = this.cart.reduce((sum, item) => sum + item.price, 0);

            Modal({
              controller: function () {
                this.clearCart = function () {
                  this.cart = [];
                  this.apply();
                  this.close();
                }.bind(this);
              }.bind(this),
              render: function () {
                return `
                                <div style="padding: 2rem; min-width: 400px;">
                                    <h3>🛒 Mi Carrito</h3>
                                    ${
                                      this.cart.length === 0
                                        ? "<p>El carrito está vacío</p>"
                                        : `
                                        <div style="max-height: 300px; overflow-y: auto;">
                                            ${this.cart
                                              .map(
                                                (item) => `
                                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #eee;">
                                                    <span>${item.image} ${item.name}</span>
                                                    <strong>$${item.price}</strong>
                                                </div>
                                            `
                                              )
                                              .join("")}
                                        </div>
                                        <div style="border-top: 2px solid #007bff; margin-top: 1rem; padding-top: 1rem;">
                                            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                                                <span>Total:</span>
                                                <span>$${total}</span>
                                            </div>
                                        </div>
                                        `
                                    }
                                    <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
                                        ${this.cart.length > 0 ? '<button onclick="clearCart()" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px;">Vaciar</button>' : ""}
                                        <button onclick="this.close()" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">Cerrar</button>
                                    </div>
                                </div>
                            `;
              }.bind(this),
              hideWhenClickOverlay: true,
            });
          };
        },
        render: function () {
          const filteredProducts = this.getFilteredProducts();
          const categories = [...new Set(this.products.map((p) => p.category))];

          return `
                    <div class="content">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                            <h1>🛍️ Nuestros Productos</h1>
                            <button onclick="showCart()" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                🛒 Carrito (${this.cart.length})
                            </button>
                        </div>
                        
                        <!-- Filtros -->
                        <div style="margin-bottom: 2rem;">
                            <button onclick="setFilter('all')" style="margin-right: 0.5rem; padding: 0.5rem 1rem; background: ${this.filter === "all" ? "#007bff" : "#f8f9fa"}; color: ${this.filter === "all" ? "white" : "black"}; border: 1px solid #ddd; border-radius: 4px;">
                                Todos
                            </button>
                            ${categories
                              .map(
                                (cat) => `
                                <button onclick="setFilter('${cat}')" style="margin-right: 0.5rem; padding: 0.5rem 1rem; background: ${this.filter === cat ? "#007bff" : "#f8f9fa"}; color: ${this.filter === cat ? "white" : "black"}; border: 1px solid #ddd; border-radius: 4px;">
                                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            `
                              )
                              .join("")}
                        </div>
                        
                        <!-- Productos -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                            ${filteredProducts
                              .map(
                                (product) => `
                                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                    <div style="text-align: center; font-size: 3rem; margin-bottom: 1rem;">
                                        ${product.image}
                                    </div>
                                    <h3 style="margin: 0 0 0.5rem 0;">${product.name}</h3>
                                    <p style="color: #666; text-transform: capitalize; font-size: 0.9rem;">${product.category}</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
                                        <span style="font-size: 1.5rem; font-weight: bold; color: #007bff;">$${product.price}</span>
                                        <span style="color: ${product.stock < 10 ? "#dc3545" : "#28a745"}; font-size: 0.9rem;">
                                            Stock: ${product.stock}
                                        </span>
                                    </div>
                                    <button 
                                        onclick="addToCart(${product.id})" 
                                        style="width: 100%; padding: 0.75rem; background: ${product.stock > 0 ? "#007bff" : "#6c757d"}; color: white; border: none; border-radius: 4px; cursor: ${product.stock > 0 ? "pointer" : "not-allowed"};"
                                        ${product.stock === 0 ? "disabled" : ""}
                                    >
                                        ${product.stock > 0 ? "🛒 Añadir al Carrito" : "❌ Sin Stock"}
                                    </button>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `;
        },
      };

      // Página Acerca de
      const AboutPage = {
        title: "Acerca de - Mi SPA",
        controller: function () {
          this.team = [
            { name: "Ana García", role: "CEO & Fundadora", avatar: "👩‍💼" },
            { name: "Carlos López", role: "CTO", avatar: "👨‍💻" },
            { name: "María Rodríguez", role: "Diseñadora UX", avatar: "👩‍🎨" },
            { name: "Juan Martínez", role: "Desarrollador", avatar: "👨‍💻" },
          ];

          this.showMember = function (memberName) {
            const member = this.team.find((m) => m.name === memberName);

            Modal({
              controller: function () {},
              render: function () {
                return `
                                <div style="padding: 2rem; text-align: center;">
                                    <div style="font-size: 4rem; margin-bottom: 1rem;">${member.avatar}</div>
                                    <h3>${member.name}</h3>
                                    <p style="color: #666;">${member.role}</p>
                                    <p>Miembro destacado de nuestro equipo con años de experiencia en el sector.</p>
                                    <button onclick="this.close()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">
                                        Cerrar
                                    </button>
                                </div>
                            `;
              },
              hideWhenClickOverlay: true,
            });
          };
        },
        render: function () {
          return `
                    <div class="content">
                        <h1>ℹ️ Acerca de Nosotros</h1>
                        
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                            <h2 style="margin: 0 0 1rem 0;">Nuestra Misión</h2>
                            <p style="font-size: 1.2rem; margin: 0;">
                                Crear soluciones tecnológicas innovadoras que simplifiquen la vida de las personas
                                y impulsen el crecimiento de los negocios.
                            </p>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 3rem 0;">
                            <div style="text-align: center; padding: 2rem;">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                                <h3>Innovación</h3>
                                <p>Utilizamos las últimas tecnologías para crear productos que marquen la diferencia.</p>
                            </div>
                            <div style="text-align: center; padding: 2rem;">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">🤝</div>
                                <h3>Colaboración</h3>
                                <p>Trabajamos mano a mano con nuestros clientes para entender sus necesidades.</p>
                            </div>
                            <div style="text-align: center; padding: 2rem;">
                                <div style="font-size: 3rem; margin-bottom: 1rem;">💡</div>
                                <h3>Creatividad</h3>
                                <p>Pensamos fuera de la caja para encontrar soluciones únicas y efectivas.</p>
                            </div>
                        </div>
                        
                        <h2>👥 Nuestro Equipo</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                            ${this.team
                              .map(
                                (member) => `
                                <div style="text-align: center; padding: 1.5rem; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; transition: transform 0.2s;" onclick="showMember('${member.name}')">
                                    <div style="font-size: 3rem; margin-bottom: 1rem;">${member.avatar}</div>
                                    <h4 style="margin: 0 0 0.5rem 0;">${member.name}</h4>
                                    <p style="color: #666; margin: 0; font-size: 0.9rem;">${member.role}</p>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `;
        },
      };

      // Página de contacto (reutilizando el formulario anterior pero simplificado)
      const ContactPage = {
        title: "Contacto - Mi SPA",
        controller: function () {
          this.formData = { name: "", email: "", message: "" };
          this.submitted = false;

          this.submitForm = function (e) {
            e.preventDefault();
            if (!this.formData.name || !this.formData.email || !this.formData.message) {
              alert("Por favor, completa todos los campos");
              return;
            }

            this.submitted = true;
            this.apply();

            setTimeout(() => {
              this.submitted = false;
              this.formData = { name: "", email: "", message: "" };
              this.apply();
            }, 3000);
          };
        },
        render: function () {
          if (this.submitted) {
            return `
                        <div class="content" style="text-align: center; padding: 4rem 2rem;">
                            <h1>✅ ¡Mensaje Enviado!</h1>
                            <p>Gracias por contactarnos. Te responderemos pronto.</p>
                        </div>
                    `;
          }

          return `
                    <div class="content">
                        <h1>📧 Contactanos</h1>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 2rem;">
                            <div>
                                <h3>Información de Contacto</h3>
                                <div style="space-y: 1rem;">
                                    <p><strong>📍 Dirección:</strong><br>Calle Principal 123<br>Ciudad, País 12345</p>
                                    <p><strong>📞 Teléfono:</strong><br>+1 (555) 123-4567</p>
                                    <p><strong>✉️ Email:</strong><br>info@miempresa.com</p>
                                    <p><strong>🕒 Horario:</strong><br>Lun-Vie: 9:00 AM - 6:00 PM<br>Sáb: 10:00 AM - 2:00 PM</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3>Envíanos un Mensaje</h3>
                                <form onsubmit="submitForm()" style="space-y: 1rem;">
                                    <div style="margin-bottom: 1rem;">
                                        <input type="text" model="formData.name" placeholder="Tu nombre" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" required>
                                    </div>
                                    <div style="margin-bottom: 1rem;">
                                        <input type="email" model="formData.email" placeholder="Tu email" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" required>
                                    </div>
                                    <div style="margin-bottom: 1rem;">
                                        <textarea model="formData.message" placeholder="Tu mensaje" rows="5" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" required></textarea>
                                    </div>
                                    <button type="submit" style="width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem;">
                                        📤 Enviar Mensaje
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
        },
      };

      // Configuración del router
      const router = Router([
        { path: "/", controller: HomePage, alias: "home" },
        { path: "/productos", controller: ProductsPage, alias: "products" },
        { path: "/acerca", controller: AboutPage, alias: "about" },
        { path: "/contacto", controller: ContactPage, alias: "contact" },
      ]);

      // Componente principal de la aplicación
      Component({
        tagName: "spa-app",
        controller: function () {
          // Escuchar cambios de ruta para actualizar navbar
          router.listen(() => {
            const navbar = document.querySelector("navbar-component");
            if (navbar && navbar.componentInstance) {
              navbar.componentInstance.currentPath = router.path;
              navbar.componentInstance.apply();
            }
          });
        },
        render: function () {
          return `
                    <navbar-component autoload></navbar-component>
                    <main id="app-content"></main>
                    <footer class="footer">
                        <p>&copy; 2024 Mi SPA - Construida con ScopeJS | 
                        Ruta actual: <strong>${router.path || "/"}</strong> | 
                        Alias: <strong>${router.alias || "N/A"}</strong></p>
                    </footer>
                `;
        },
        postRender: function () {
          // Renderizar la ruta actual
          const content = document.getElementById("app-content");
          if (content) {
            router.render(content);
          }
        },
      });
    </script>
  </body>
</html>
```

## Ejemplo 5: Dashboard con Componentes Reutilizables

Un ejemplo avanzado que muestra componentes modulares y composición:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Dashboard ScopeJS</title>
    <style>
      body {
        margin: 0;
        font-family: "Segoe UI", sans-serif;
        background: #f8f9fa;
      }
      .dashboard {
        display: grid;
        grid-template-columns: 250px 1fr;
        min-height: 100vh;
      }
      .sidebar {
        background: #343a40;
        color: white;
        padding: 1rem;
      }
      .main-content {
        padding: 2rem;
      }
      .widget {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
      }
      .grid {
        display: grid;
        gap: 1.5rem;
      }
      .grid-2 {
        grid-template-columns: 1fr 1fr;
      }
      .grid-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }
    </style>
  </head>
  <body>
    <dashboard-app autoload></dashboard-app>

    <script type="module">
      import { Component } from "https://cdn.devetty.es/ScopeJS/js";

      // Componente de tarjeta estadística
      Component({
        tagName: "stat-card",
        controller: function () {
          // Los datos vienen de los atributos del elemento
          this.onChangeAttribute = function (name) {
            if (["title", "value", "icon", "color", "trend"].includes(name)) {
              this.apply();
            }
          };
        },
        render: function () {
          const color = this.color || "#007bff";
          const trend = parseFloat(this.trend || "0");
          const trendColor = trend > 0 ? "#28a745" : trend < 0 ? "#dc3545" : "#6c757d";
          const trendIcon = trend > 0 ? "↗️" : trend < 0 ? "↘️" : "➡️";

          return `
                    <div class="widget" style="border-left: 4px solid ${color};">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h3 style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem; text-transform: uppercase;">
                                    ${this.title || "Estadística"}
                                </h3>
                                <div style="font-size: 2rem; font-weight: bold; color: ${color};">
                                    ${this.value || "0"}
                                </div>
                                ${
                                  trend !== 0
                                    ? `
                                    <div style="color: ${trendColor}; font-size: 0.85rem; margin-top: 0.5rem;">
                                        ${trendIcon} ${Math.abs(trend)}% vs mes anterior
                                    </div>
                                `
                                    : ""
                                }
                            </div>
                            <div style="font-size: 2.5rem; opacity: 0.7;">
                                ${this.icon || "📊"}
                            </div>
                        </div>
                    </div>
                `;
        },
      });

      // Componente de gráfico simple
      Component({
        tagName: "simple-chart",
        controller: function () {
          this.generateBars = function () {
            const data = (this.data || "10,20,15,25,30,18,35").split(",").map(Number);
            const max = Math.max(...data);

            return data
              .map((value) => {
                const height = (value / max) * 100;
                return `<div style="background: ${this.color || "#007bff"}; height: ${height}%; width: 100%; border-radius: 2px 2px 0 0;"></div>`;
              })
              .join("");
          };
        },
        render: function () {
          return `
                    <div class="widget">
                        <h3 style="margin: 0 0 1rem 0;">${this.title || "Gráfico"}</h3>
                        <div style="display: flex; align-items: end; height: 150px; gap: 4px;">
                            ${this.generateBars()}
                        </div>
                        <div style="margin-top: 1rem; color: #666; font-size: 0.85rem;">
                            ${this.description || "Datos de ejemplo"}
                        </div>
                    </div>
                `;
        },
      });

      // Componente de lista de tareas
      Component({
        tagName: "task-list",
        controller: function () {
          this.tasks = [
            { id: 1, text: "Revisar informes mensuales", completed: false, priority: "high" },
            { id: 2, text: "Reunión con equipo de ventas", completed: true, priority: "medium" },
            { id: 3, text: "Actualizar documentación", completed: false, priority: "low" },
            { id: 4, text: "Planificar sprint siguiente", completed: false, priority: "high" },
            { id: 5, text: "Review de código pendiente", completed: true, priority: "medium" },
          ];

          this.toggleTask = function (id) {
            const task = this.tasks.find((t) => t.id === id);
            if (task) {
              task.completed = !task.completed;
              this.apply();
            }
          };

          this.getPriorityColor = function (priority) {
            switch (priority) {
              case "high":
                return "#dc3545";
              case "medium":
                return "#ffc107";
              case "low":
                return "#28a745";
              default:
                return "#6c757d";
            }
          };
        },
        render: function () {
          const pendingTasks = this.tasks.filter((t) => !t.completed);
          const completedTasks = this.tasks.filter((t) => t.completed);

          return `
                    <div class="widget">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;">📋 Tareas del Día</h3>
                            <span style="background: #007bff; color: white; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.75rem;">
                                ${pendingTasks.length} pendientes
                            </span>
                        </div>
                        
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${this.tasks
                              .map(
                                (task) => `
                                <div style="display: flex; align-items: center; padding: 0.75rem; border-left: 3px solid ${this.getPriorityColor(task.priority)}; margin-bottom: 0.5rem; background: ${task.completed ? "#f8f9fa" : "white"}; border-radius: 0 4px 4px 0;">
                                    <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleTask(${task.id})" style="margin-right: 0.75rem;">
                                    <span style="flex: 1; text-decoration: ${task.completed ? "line-through" : "none"}; color: ${task.completed ? "#6c757d" : "inherit"};">
                                        ${task.text}
                                    </span>
                                    <span style="font-size: 0.75rem; color: ${this.getPriorityColor(task.priority)}; text-transform: uppercase; font-weight: bold;">
                                        ${task.priority}
                                    </span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `;
        },
      });

      // Componente de actividad reciente
      Component({
        tagName: "activity-feed",
        controller: function () {
          this.activities = [
            { time: "2 min", text: "Juan completó la tarea #1234", type: "success", icon: "✅" },
            { time: "15 min", text: "Nuevo cliente registrado", type: "info", icon: "👤" },
            { time: "1 hora", text: "Error en servidor resuelto", type: "warning", icon: "⚠️" },
            { time: "2 horas", text: "Backup completado exitosamente", type: "success", icon: "💾" },
            { time: "3 horas", text: "Actualización del sistema", type: "info", icon: "🔄" },
          ];

          this.getTypeColor = function (type) {
            switch (type) {
              case "success":
                return "#28a745";
              case "warning":
                return "#ffc107";
              case "error":
                return "#dc3545";
              case "info":
                return "#17a2b8";
              default:
                return "#6c757d";
            }
          };
        },
        render: function () {
          return `
                    <div class="widget">
                        <h3 style="margin: 0 0 1rem 0;">🔔 Actividad Reciente</h3>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${this.activities
                              .map(
                                (activity) => `
                                <div style="display: flex; align-items: flex-start; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0;">
                                    <div style="background: ${this.getTypeColor(activity.type)}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; margin-right: 0.75rem; flex-shrink: 0;">
                                        ${activity.icon}
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 0.9rem;">${activity.text}</div>
                                        <div style="font-size: 0.75rem; color: #6c757d; margin-top: 0.25rem;">
                                            hace ${activity.time}
                                        </div>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `;
        },
      });

      // Componente principal del dashboard
      Component({
        tagName: "dashboard-app",
        controller: function () {
          this.user = { name: "Ana García", role: "Administradora" };
          this.currentTime = new Date().toLocaleString();

          // Actualizar hora cada minuto
          setInterval(() => {
            this.currentTime = new Date().toLocaleString();
            this.apply();
          }, 60000);
        },
        render: function () {
          return `
                    <div class="dashboard">
                        <!-- Sidebar -->
                        <div class="sidebar">
                            <div style="text-align: center; padding: 1rem 0; border-bottom: 1px solid #495057; margin-bottom: 1rem;">
                                <div style="font-size: 2rem; margin-bottom: 0.5rem;">👩‍💼</div>
                                <div style="font-weight: bold;">${this.user.name}</div>
                                <div style="font-size: 0.85rem; color: #adb5bd;">${this.user.role}</div>
                            </div>
                            
                            <nav>
                                <div style="margin-bottom: 1rem;">
                                    <div style="padding: 0.5rem 0; color: #adb5bd; font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Principal</div>
                                    <a href="#" style="display: block; color: white; text-decoration: none; padding: 0.5rem; border-radius: 4px; background: #007bff;">📊 Dashboard</a>
                                    <a href="#" style="display: block; color: #adb5bd; text-decoration: none; padding: 0.5rem; margin-top: 0.25rem;">📈 Análisis</a>
                                    <a href="#" style="display: block; color: #adb5bd; text-decoration: none; padding: 0.5rem; margin-top: 0.25rem;">👥 Usuarios</a>
                                </div>
                                
                                <div style="margin-bottom: 1rem;">
                                    <div style="padding: 0.5rem 0; color: #adb5bd; font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Gestión</div>
                                    <a href="#" style="display: block; color: #adb5bd; text-decoration: none; padding: 0.5rem;">🛍️ Productos</a>
                                    <a href="#" style="display: block; color: #adb5bd; text-decoration: none; padding: 0.5rem; margin-top: 0.25rem;">📦 Pedidos</a>
                                    <a href="#" style="display: block; color: #adb5bd; text-decoration: none; padding: 0.5rem; margin-top: 0.25rem;">💰 Finanzas</a>
                                </div>
                            </nav>
                            
                            <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem; font-size: 0.75rem; color: #adb5bd;">
                                ${this.currentTime}
                            </div>
                        </div>
                        
                        <!-- Contenido principal -->
                        <div class="main-content">
                            <div style="margin-bottom: 2rem;">
                                <h1 style="margin: 0 0 0.5rem 0;">📊 Dashboard</h1>
                                <p style="color: #6c757d; margin: 0;">Bienvenida de vuelta, ${this.user.name}. Aquí tienes un resumen de tu negocio.</p>
                            </div>
                            
                            <!-- Estadísticas principales -->
                            <div class="grid grid-3">
                                <stat-card 
                                    autoload
                                    title="Ventas Totales" 
                                    value="€45,280" 
                                    icon="💰" 
                                    color="#28a745"
                                    trend="12.5"
                                ></stat-card>
                                
                                <stat-card 
                                    autoload
                                    title="Nuevos Usuarios" 
                                    value="1,240" 
                                    icon="👥" 
                                    color="#007bff"
                                    trend="8.2"
                                ></stat-card>
                                
                                <stat-card 
                                    autoload
                                    title="Pedidos Hoy" 
                                    value="89" 
                                    icon="📦" 
                                    color="#ffc107"
                                    trend="-2.1"
                                ></stat-card>
                            </div>
                            
                            <!-- Gráficos -->
                            <div class="grid grid-2">
                                <simple-chart 
                                    autoload
                                    title="Ventas Semanales"
                                    data="120,150,180,220,190,250,280"
                                    color="#007bff"
                                    description="Ventas de los últimos 7 días"
                                ></simple-chart>
                                
                                <simple-chart 
                                    autoload
                                    title="Tráfico del Sitio"
                                    data="80,95,110,125,140,160,145"
                                    color="#28a745"
                                    description="Visitantes únicos por día"
                                ></simple-chart>
                            </div>
                            
                            <!-- Tareas y actividad -->
                            <div class="grid grid-2">
                                <task-list autoload></task-list>
                                <activity-feed autoload></activity-feed>
                            </div>
                        </div>
                    </div>
                `;
        },
      });
    </script>
  </body>
</html>
```

## Mejores Prácticas y Consejos para IA

Esta sección proporciona patrones, consejos y mejores prácticas para que una IA pueda entender y usar ScopeJS de manera efectiva.

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

## Novedades V2.0.3

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
