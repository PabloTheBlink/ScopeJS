# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScopeJS is a lightweight JavaScript framework (~15KB) for building component-based web applications. It provides reactive components, SPA routing, modal management, and two-way data binding with zero dependencies.

## Development Commands

```bash
# Start local development server
npm run dev

# Alternative local server
npm run serve

# No build step needed (vanilla JS)
npm run build  # Will output "No build step needed - vanilla JS"

# Testing (currently not implemented)
npm run test   # Shows "Error: no test specified"
```

## Architecture Overview

### Core Structure
- **js/ScopeJS.js** - Main UMD bundle (1,275+ lines) containing the entire framework
- **js/ScopeJS.mjs** - ES6 module wrapper for modern imports
- **types/index.d.ts** - Complete TypeScript definitions
- **index.html** - Interactive documentation with live examples

### Framework Architecture
The framework uses a class-based component system with these key concepts:

1. **Component Registry**: Global Map storing component instances with UUID tracking
2. **Surgical Rendering**: Efficient DOM updates that only modify changed elements
3. **UMD Pattern**: Supports CommonJS, AMD, and global script usage
4. **StyleManager**: Handles scoped CSS injection and global style management

### Key Classes and APIs

**Component System:**
```javascript
const MyComponent = Component({
  controller: class {
    constructor() { /* reactive state */ }
    postRender() { /* lifecycle hook */ }
    onDestroy() { /* cleanup */ }
  },
  render() { return `<template>`; },
  style: `scoped css styles`,
  attributes: ['custom-attr']
});
```

**Modal System:**
- Supports draggable and resizable modals (v2.0.8+)
- Window mode with title bars
- Automatic z-index stacking and overlay management

**Router System:**
- Hash-based or pushState routing
- Nested routes with `<router-outlet>` tags
- Dynamic parameters (`:id`)
- Route middleware and aliases

### Data Binding Features
- **Two-way binding**: `model` attribute for form inputs
- **Event parameters**: Smart parameter injection in event handlers  
- **Lazy loading**: Built-in `lazy` attribute for images
- **Fade animations**: `fadeIn` attribute with intersection observer

## Code Conventions

### File Organization
- Main framework code is in `/js/ScopeJS.js` as a single file
- No build system - direct browser compatibility
- TypeScript definitions maintained separately in `/types/`

### Development Patterns
- Use ES6+ syntax throughout
- Components are class-based with reactive state
- CSS is scoped per component via StyleManager
- Event handlers use declarative HTML attributes

### Browser Support
- Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
- No Internet Explorer support
- Modern ES6+ features used without transpilation

## Documentation and Examples

The project includes comprehensive Spanish documentation:
- **README.md**: 900+ lines of detailed usage examples
- **CONTRIBUTING.md**: Development workflow and contribution guidelines
- **index.html**: Interactive demo with live code examples
- **CHANGELOG.md**: Version history with feature descriptions

## Testing and Quality

Currently no formal testing framework is configured. Manual testing is done through:
- Interactive examples in index.html
- Debug mode via `enableDebugger()` function
- Live development server for testing changes

## Package Distribution

Published as `@pablotheblink/scopejs` on NPM with:
- UMD build supporting multiple module systems
- CDN availability via unpkg
- Complete TypeScript support
- Apache 2.0 license