# ScopeJS

Libreria sencilla para crear componentes reactivos en JavaScript vanilla.

## Componentes

### `Component({ tagName, controller, render })``

Crea un componente con capacidades de renderizado y control.

Parámetros:

- tagName (opcional): Nombre de la etiqueta HTML asociada al componente.
- controller (opcional): Controlador del componente.
- render: Función de renderizado del componente.

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

- controller: Controlador del modal.
- render: Función de renderizado del modal.
- hideWhenClickOverlay (opcional): Indica si el modal debe cerrarse al hacer clic en el fondo.
- params (opcional): Parámetros adicionales para pasar a la función de renderizado del modal.

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
