# Instalación

Esta librería ha sido desarrollada utilizando módulos ES (ES Modules) y puede ser usada directamente desde uno de los siguientes CDN:

```javascript
import { Component, Router, Modal } from "https://cdn.devetty.es/ScopeJS/js";
import { Component, Router, Modal } from "https://cdn.jsdelivr.net/gh/pablotheblink/ScopeJS/js/ScopeJS.min.js";
```

# Componentes

Crea un componente con capacidad de renderizado y control.

## Parámetros

| Parámetro     | Descripción                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller*` | Controlador lógico del componente, donde se define la lógica que manejará las interacciones y el estado del mismo.                                        |
| `render*`     | Función de renderizado del componente, responsable de retornar el HTML que representa visualmente el componente.                                          |
| `postRender`  | Función que se ejecuta inmediatamente después de que el componente ha sido renderizado en el DOM, útil para realizar ajustes finales o registrar eventos. |
| `tagName`     | Etiqueta HTML asociada al componente, que define cómo se representa el componente en el HTML.                                                             |

```javascript
Component({
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
      <button onclick="this.handleClic(1)">Aceptar</button>
      <button onclick="this.handleClic(0)">Cancelar</button>
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
      <button onclick="this.handleClic(1)">Sumar</button>
      <button onclick="this.handleClic(-1)">Restar</button>
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

# Licencia

Esta biblioteca de código abierto ha sido desarrollada por **Pablo Martínez**, y se distribuye bajo los términos de la licencia Apache. El código es proporcionado "tal cual", sin garantía alguna de su funcionamiento, uso o adecuación a un propósito específico. Se permite la redistribución y modificación, siempre que se mantenga la atribución original al autor.

Para consultas o colaboraciones, puedes contactarme en:

- [Github ScopeJS](https://github.com/PabloTheBlink/ScopeJS)
- [Github autor](https://github.com/PabloTheBlink)
- [LinkedIn](https://www.linkedin.com/in/pablo-mart%C3%ADnez-san-jos%C3%A9-9bb24215a)
- [Instagram](https://www.instagram.com/PabloTheBlink)

El uso de esta biblioteca implica la aceptación de los términos de la licencia.
