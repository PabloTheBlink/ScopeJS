# ScopeJS

Libreria sencilla para crear componentes reactivos en JavaScript vanilla.

## ScopeJS

### `createComponent(Function function)`

Este método permite crear componentes utilizando una función como controlador.
A continuación, se muestra un ejemplo de uso:

```javascript
ScopeJS.createComponent(function AppController({ render }) {
  render(function () {
    return "<h1>Hola</h1>";
  });
});
```

### `$scope`

La variable $scope es un objeto que actúa como un contenedor para el estado del componente. Permite almacenar y acceder a datos específicos del componente, facilitando así la manipulación y actualización del DOM de manera reactiva.

```javascript
ScopeJS.createComponent(function AppController({ render, $scope }) {
  $scope.contador = 0;
  setInterval(function () {
    $scope.contador++;
  });
  render(function () {
    return `<h1>${$scope.contador}</h1>`;
  });
});
```

### `render(String html, HTMLElement root = document.body)`

Este método facilita la renderización de componentes en el DOM. Aquí hay un ejemplo de uso:

```javascript
ScopeJS.render(`<AppController></AppController>`);
```

¡Disfruta utilizando ScopeJS para desarrollar componentes reactivos de manera sencilla!
