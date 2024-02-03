# ScopeJS

Libreria sencilla para crear componentes reactivos en JavaScript vanilla.

## Componentes

### `Component({ tagName, controller, render })``

Crea un componente con capacidades de renderizado y control.

Parámetros:

- `tagName` (opcional): Nombre de la etiqueta HTML asociada al componente.
- `controller` (opcional): Controlador del componente.
- `render` Función de renderizado del componente.

Retorna: Instancia del componente con métodos de renderizado y control.

Ejemplo de Uso:

```javascript
import { Component } from "https://cdn.devetty.es/ScopeJS/js";

Component({
  tagName: "counter",
  controller: function () {
    this.counter = 0;
    setInterval(() => {
      this.counter++;
      this.apply();
    }, 1000);
  },
  render: function () {
    return `${this.counter}`;
  },
});

Component({
  render: () => `<counter></counter>`,
}).render();
```

## Modales

### `Modal({ controller, render, hideWhenClickOverlay }, params = {})`

`
Crea y muestra un modal en la interfaz de usuario.

Parámetros:

- `controller`: Controlador del modal.
- `render`: Función de renderizado del modal.
- `hideWhenClickOverlay` (opcional): Indica si el modal debe cerrarse al hacer clic en el fondo.
- `params` (opcional): Parámetros adicionales para pasar a la función de renderizado del modal.

Ejemplo de Uso:

```javascript
import { Modal } from "https://cdn.devetty.es/ScopeJS/js";

Modal({
  controller: function () {
    this.counter = 0;
    setInterval(() => {
      this.counter++;
      this.apply();
      if (this.counter == 5) this.close();
    }, 1000);
  },
  render: function () {
    return `${this.counter}`;
  },
});
```

## Router

### `Router(routes)`

`
Crea y gestiona la navegación y renderizado de rutas en una aplicación web.

Parámetros:

- `routes`: (Array): Arreglo de objetos de ruta con propiedades 'path' y 'controller'.

Ejemplo de Uso:

```javascript
import { Router } from "https://cdn.devetty.es/ScopeJS/js";

// Definir rutas y controladores
const router = Router([
  {
    path: "/",
    controller: AppController,
  },
  {
    path: "/:id",
    controller: AppController,
  },
]);

// Renderizar la ruta actual en el contenedor proporcionado (en este caso, document.body)
router.render(document.body);

// Acceder a los parámetros de la ruta actual
const id = router.params.id;

// Navegar a una ruta específica
router.navigate("/1");
```

Este módulo permite gestionar la navegación en una aplicación web mediante la definición de rutas y sus correspondientes controladores. Al crear una instancia de `Router` y proporcionar un arreglo de rutas, puedes controlar la navegación entre diferentes vistas de manera sencilla. Además, el método `render` se encarga de renderizar el controlador asociado a la ruta actual en el contenedor especificado.
