/**
 * ScopeJS ES6 Module Exports
 * Modern import/export syntax for ES6 modules
 */

// Load the UMD script and access global exports
const script = document.createElement('script');
script.src = './ScopeJS.js';
document.head.appendChild(script);

// Wait for script to load then export
await new Promise(resolve => {
  script.onload = resolve;
});

// Re-export from global scope
export const Component = window.Component;
export const Modal = window.Modal;
export const Router = window.Router;
export const enableDebugger = window.enableDebugger;

// Default export
export default window.ScopeJS;