# Instalación

Esta librería ha sido desarrollada utilizando módulos ES (ES Modules) y puede ser usada directamente desde uno de los siguientes CDN:

```javascript
import { Component, Router, Modal } from "https://cdn.devetty.es/ScopeJS/js";
import { Component, Router, Modal } from "https://cdn.jsdelivr.net/gh/pablotheblink/ScopeJS/js/ScopeJS.min.js";
```

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
   <my-component autoload></my-component>;
   ```

````


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
````

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

```

```
