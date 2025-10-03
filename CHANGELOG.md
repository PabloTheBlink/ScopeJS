# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.8] - 2025-10-03

### Changed

- Version bump to 2.0.8

## [2.0.7] - 2025-01-16

### Added

- **Modales Arrastrables**: Sistema completo de ventanas movibles con barra de título
  - Parámetro `draggable: true` para hacer modales arrastrables desde la barra de título
  - Restricciones automáticas de viewport (no se salen de pantalla)
  - Barra de título con gradiente elegante y botón de cerrar integrado
- **Modo Ventana**: Múltiples modales simultáneos sin overlay
  - Parámetro `windowMode: true` para abrir modales como ventanas independientes
  - Sin overlay de fondo, permitiendo interacción con la página
  - Sistema de gestión de múltiples ventanas con apilamiento automático
- **Sistema de Apilamiento**: Bring-to-front automático
  - Z-index incremental para gestión automática de capas
  - Clic en cualquier ventana la trae al frente automáticamente
  - Registro global de modales activos para cleanup inteligente
- **Posicionamiento Personalizado**: Control total sobre ubicación inicial
  - Parámetro `position: {x, y}` para posición inicial específica
  - Apilamiento automático con offset para múltiples ventanas
  - Posicionamiento inteligente relativo al viewport
- **Título Personalizable**: Barra de título configurable
  - Parámetro `title: "Mi Ventana"` para título personalizado
  - Diseño consistente con gradiente corporativo
  - Botón de cerrar integrado con efectos hover

### Enhanced

- Modal system mejorado con compatibilidad total hacia atrás
- Gestión inteligente de overlays (tradicional vs modo ventana)
- Sistema de cleanup automático para event listeners de drag
- Detección automática de funcionalidades según parámetros
- Documentación interactiva con 4 tipos diferentes de demos

### Fixed

- Compatibilidad mejorada entre `hideWhenClickOverlay` y modo ventana
- Cleanup adecuado de event listeners al cerrar ventanas arrastrables
- Gestión correcta de memoria para múltiples modales simultáneos

### Technical

- Funciones `setupModalDrag()` y `bringModalToFront()` para gestión de movimiento
- Map global `activeModals` para tracking de ventanas abiertas
- Sistema de z-index incremental con `modalZIndex` global
- Nuevos estilos `WINDOW_MODAL`, `TITLE_BAR`, `CLOSE_BUTTON`
- Event handlers optimizados para prevenir interferencias entre funcionalidades

### Browser Compatibility

- Funcionalidad de arrastre compatible con todos los navegadores modernos
- Restricciones de viewport que respetan diferentes tamaños de pantalla
- Detección automática de mobile para deshabilitar drag en dispositivos táctiles

## [2.0.5] - 2025-01-16

### Added

- **Rutas Anidadas**: Sistema completo de rutas jerárquicas para aplicaciones complejas
  - Herencia automática de paths padre a hijos (`/admin` + `/usuarios` = `/admin/usuarios`)
  - Soporte para `<router-outlet></router-outlet>` en componentes padre
  - Layouts compartidos que se mantienen mientras cambia solo el contenido hijo
  - Navegación fluida sin recargar el layout completo
- Nuevos métodos del Router:
  - `getAllRoutes()`: Obtiene todas las rutas incluidas las anidadas
  - `getChildRoutes(parentPath)`: Obtiene rutas hijas de un padre específico
- Sistema de detección automática de componentes padre e instancias vs configuraciones
- Documentación interactiva completa con ejemplos visuales de rutas anidadas
- Sección dedicada en index.html con demostración funcional

### Enhanced

- Router mejorado con soporte para estructuras jerárquicas complejas
- Renderizado inteligente que detecta automáticamente layouts padre/hijo
- Mejor manejo de la destrucción de componentes anidados
- Documentación actualizada con ejemplos prácticos de uso

### Fixed

- Compatibilidad mejorada entre instancias de componentes y configuraciones
- Mejor manejo de rutas padre accedidas directamente
- Limpieza adecuada de componentes padre e hijos al navegar

### Technical

- Función `flattenRoutes()` para aplanar rutas jerárquicas
- Lógica de renderizado padre/hijo con detección de `<router-outlet>`
- Sistema de cleanup automático para componentes anidados
- Soporte completo para middleware en rutas anidadas

## [2.0.4] - 2025-01-15

### Added

- Framework JavaScript ligero para desarrollo basado en componentes
- Sistema de componentes reactivos con renderizado quirúrgico
- Router SPA con soporte para rutas dinámicas
- Sistema de modales con animaciones
- Data binding bidireccional automático
- Lazy loading de imágenes
- Animaciones fade-in automáticas
- Soporte UMD (funciona con CommonJS, AMD y como variable global)
- Zero dependencies
- TypeScript definitions incluidas

### Features

- Componentes encapsulados con estado reactivo
- CSS scoped por componente
- Sistema de eventos inteligente con parsing de parámetros
- View Transitions para navegación fluida
- Compatibilidad con ES6 modules e import/export
- Renderizado solo de elementos que cambiaron (performance optimizada)
- Documentación completa en español
- Ejemplos interactivos en index.html

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Navegadores móviles modernos

### Package

- Tamaño: ~15KB sin minificar
- Licencia: Apache-2.0
- Disponible en NPM como `@pablotheblink/scopejs`
