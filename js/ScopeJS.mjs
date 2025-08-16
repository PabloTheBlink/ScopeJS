/**
 * ScopeJS ES6 Module Exports
 * Modern import/export syntax for ES6 modules
 */

// Import the UMD version
import ScopeJSUMD from './ScopeJS.js';

// Re-export individual functions
export const Component = ScopeJSUMD.Component;
export const Modal = ScopeJSUMD.Modal;
export const Router = ScopeJSUMD.Router;
export const enableDebugger = ScopeJSUMD.enableDebugger;

// Default export
export default ScopeJSUMD;