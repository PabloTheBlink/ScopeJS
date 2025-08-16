/**
 * ScopeJS V2.0.5 - Optimized & Refactored
 * A lightweight JavaScript framework for component-based development
 * Supports both ES6 modules and global script usage
 */

// UMD (Universal Module Definition) wrapper
(function (root, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else {
    // Global variable
    const ScopeJS = factory();
    root.ScopeJS = ScopeJS;
    root.Component = ScopeJS.Component;
    root.Modal = ScopeJS.Modal;
    root.Router = ScopeJS.Router;
    root.enableDebugger = ScopeJS.enableDebugger;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Constants and Configuration
  const COMPONENT_REGISTRY = new Map();
  const UUID_ATTRIBUTE = "scopejs-component";
  const HTML_EVENTS = ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"];

  // Global state
  let debuggerEnabled = false;

  /**
   * Enables or disables the debugger
   * @param {boolean} enabled - Whether to enable debugging
   */
  function enableDebugger(enabled) {
    debuggerEnabled = enabled;
  }

  /**
   * Logs messages when debugger is enabled
   * @param {...any} args - Arguments to log
   */
  function log(...args) {
    if (debuggerEnabled) {
      console.log(...args);
    }
  }

  /**
   * Generates a unique identifier
   * @returns {string} - Unique ID
   */
  function generateUUID() {
    return crypto.randomUUID?.() || Math.random().toString(36).slice(2);
  }

  /**
   * Gets cloned children from an element
   * @param {HTMLElement} element - Source element
   * @returns {HTMLElement[]} - Array of cloned children
   */
  function getChildren(element) {
    if (element.tagName?.toUpperCase() === "SLOT") {
      return getChildren(element.querySelector("slot"));
    }

    return Array.from(element.children || []).map((child) => child.cloneNode(true));
  }

  /**
   * Initializes fade-in animation for elements with fadeIn attribute
   */
  function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute("fadeIn", entry.isIntersecting ? "1" : "0");
      });
    });

    document.querySelectorAll("*[fadeIn]").forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * CSS Styles Manager - Handles all style injection and management
   */
  class StyleManager {
    static globalStylesInjected = false;

    static injectGlobalStyles() {
      if (this.globalStylesInjected) return;

      const style = document.createElement("style");
      style.setAttribute("scopejs", "");
      style.innerHTML = /* CSS */ `
      @keyframes lazy-loading {
        0% { background-position: 100% 50%; }
        100% { background-position: 0 50%; }
      }

      img[lazy] {
        position: relative;
      }

      img[lazy]::after {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, #ccc 25%, #eee 50%, #ccc 75%);
        background-size: 400% 400%;
        animation: lazy-loading 0.5s ease infinite;
      }

      ::view-transition-old(*),
      ::view-transition-new(*) {
        animation-timing-function: ease-in-out;
        animation-duration: 0.25s;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(2.5rem); }
        to { opacity: 1; transform: translateY(0); }
      }

      *[fadeIn] {
        opacity: 0;
        transform: translateY(2.5rem);
        transition: 0.5s;
      }

      *[fadeIn='1'] {
        opacity: 1;
        transform: translateY(0);
      }
    `;

      document.head.appendChild(style);
      this.globalStylesInjected = true;
    }

    static injectViewTransitionStyles(element) {
      if (!element.hasAttribute?.("id")) return;

      const id = element.getAttribute("id");
      const style = document.querySelector("style[scopejs='']");

      if (!style || style.innerHTML.includes(`#${id}`)) return;

      style.innerHTML += `
      #${id} { view-transition-name: ${id}; }
      ::view-transition-group(${id}) { 
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); 
        animation-duration: 0.5s; 
      }
    `;
    }

    static injectComponentStyle(uuid, cssText) {
      if (!cssText || document.querySelector(`style[scopejs="${uuid}"]`)) return;

      const style = document.createElement("style");
      style.setAttribute("scopejs", uuid);
      style.innerHTML = `*[${UUID_ATTRIBUTE}="${uuid}"] { ${cssText} }`;
      document.head.appendChild(style);
    }
  }

  /**
   * Lazy Image Loader - Handles lazy loading of images
   */
  class LazyImageLoader {
    static loadImages(element) {
      if (!element) return;

      if (element.tagName === "IMG" && element.hasAttribute("lazy")) {
        this.loadSingleImage(element);
      }

      element.querySelectorAll?.("img[lazy]").forEach((img) => this.loadSingleImage(img));
    }

    static loadSingleImage(img) {
      const src = img.getAttribute("src");
      if (!src) return;

      img.removeAttribute("src");

      const image = new Image();
      image.src = src;
      image.onload = () => {
        img.setAttribute("src", src);
        img.removeAttribute("lazy");
      };
    }
  }

  /**
   * DOM Updater - Handles efficient DOM updates with minimal manipulation
   */
  class DOMUpdater {
    constructor(uuid) {
      this.uuid = uuid;
    }

    updateChildren(container, clone) {
      if (!container?.getAttribute || (container.getAttribute(UUID_ATTRIBUTE) && container.getAttribute(UUID_ATTRIBUTE) !== this.uuid)) {
        return;
      }

      StyleManager.injectGlobalStyles();

      const originalChildren = container.childNodes;
      const updatedChildren = clone.childNodes;
      const maxLength = Math.max(originalChildren.length, updatedChildren.length);

      this.processViewTransitions(updatedChildren);
      this.reconcileChildren(container, originalChildren, updatedChildren, maxLength);
    }

    processViewTransitions(updatedChildren) {
      Array.from(updatedChildren).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          StyleManager.injectViewTransitionStyles(child);
        }
      });
    }

    reconcileChildren(container, originalChildren, updatedChildren, maxLength) {
      for (let i = 0; i < maxLength; i++) {
        const originalChild = originalChildren[i];
        const updatedChild = updatedChildren[i];

        if (!originalChild && updatedChild) {
          this.addChild(container, updatedChild);
        } else if (originalChild && !updatedChild) {
          originalChild.remove();
        } else if (originalChild && updatedChild) {
          this.updateChild(originalChild, updatedChild);
        }
      }
    }

    addChild(container, updatedChild) {
      const newElement = updatedChild.cloneNode(true);
      LazyImageLoader.loadImages(newElement);
      container.appendChild(newElement);
    }

    updateChild(originalChild, updatedChild) {
      if (originalChild.nodeType === Node.TEXT_NODE && updatedChild.nodeType === Node.TEXT_NODE) {
        this.updateTextNode(originalChild, updatedChild);
      } else if (originalChild.tagName === updatedChild.tagName) {
        this.updateElementNode(originalChild, updatedChild);
      } else {
        this.replaceNode(originalChild, updatedChild);
      }
    }

    updateTextNode(originalChild, updatedChild) {
      const originalText = originalChild.textContent.replace(/\s/g, "");
      const updatedText = updatedChild.textContent.replace(/\s/g, "");

      if (originalText !== updatedText) {
        log(this.uuid, "Replacing text", originalChild.textContent, updatedChild.textContent);
        originalChild.textContent = updatedChild.textContent;
      }
    }

    updateElementNode(originalChild, updatedChild) {
      this.updateAttributes(originalChild, updatedChild);
      this.updateChildren(originalChild, updatedChild);
    }

    updateAttributes(originalChild, updatedChild) {
      // Remove attributes not in updated child
      Array.from(originalChild.attributes || []).forEach((attr) => {
        if (attr.name === UUID_ATTRIBUTE || updatedChild.hasAttribute(attr.name)) return;
        originalChild.removeAttribute(attr.name);
      });

      // Add/update attributes from updated child
      Array.from(updatedChild.attributes || []).forEach((attr) => {
        if (attr.name === UUID_ATTRIBUTE) return;

        if (!originalChild.hasAttribute(attr.name) || originalChild.getAttribute(attr.name) !== attr.value) {
          originalChild.setAttribute(attr.name, attr.value);
        }
      });
    }

    replaceNode(originalChild, updatedChild) {
      const clonedNode = updatedChild.cloneNode(true);
      log(this.uuid, "Replacing element", originalChild, clonedNode);
      originalChild.parentNode?.replaceChild(clonedNode, originalChild);
    }
  }

  /**
   * Event Handler Manager - Optimized event binding and parameter parsing
   */
  class EventManager {
    static bindEvents(container, componentInstance) {
      HTML_EVENTS.forEach((eventName) => {
        container.querySelectorAll(`*[${eventName}]`).forEach((element) => {
          this.bindSingleEvent(element, eventName, componentInstance);
        });
      });
    }

    static bindSingleEvent(element, eventName, componentInstance) {
      const eventValue = element.getAttribute(eventName);
      const functionName = eventValue.split("(")[0];
      const func = componentInstance[functionName];

      if (typeof func !== "function") return;

      element[eventName] = (event) => {
        event.preventDefault();
        const params = this.parseEventParameters(eventValue, componentInstance, event);
        setTimeout(() => func.apply(componentInstance, Object.values(params)), 0);
      };
    }

    static parseEventParameters(eventValue, componentInstance, event) {
      const paramsMatch = eventValue.match(/\(([^)]*)\)/);
      if (!paramsMatch || !paramsMatch[1]) {
        return { event };
      }

      const paramStrings = paramsMatch[1].split(",").map((p) => p.trim());
      const params = {};

      paramStrings.forEach((param, index) => {
        params[index] = componentInstance[param] !== undefined ? componentInstance[param] : eval(param);
      });

      params[paramStrings.length] = event;
      return params;
    }
  }

  /**
   * Model Binding Manager - Handles two-way data binding
   */
  class ModelManager {
    static bindModels(container, componentInstance) {
      container.querySelectorAll("*[model]").forEach((element) => {
        this.bindSingleModel(element, componentInstance);
      });
    }

    static bindSingleModel(element, componentInstance) {
      const modelPath = element.getAttribute("model");
      const pathSegments = modelPath.split(".");

      // Set initial value
      const value = this.getValueByPath(componentInstance, pathSegments);
      if (value !== undefined) {
        element.value = value;
      }

      // Bind input event
      element.addEventListener("input", () => {
        this.setValueByPath(componentInstance, pathSegments, element.value);
      });
    }

    static getValueByPath(obj, pathSegments) {
      return pathSegments.reduce((current, segment) => current?.[segment], obj);
    }

    static setValueByPath(obj, pathSegments, value) {
      const lastSegment = pathSegments.pop();
      const target = pathSegments.reduce((current, segment) => current?.[segment], obj);
      if (target && lastSegment) {
        target[lastSegment] = value;
      }
    }
  }

  /**
   * Component Instance - Main component logic
   */
  class ComponentInstance {
    constructor(options) {
      this.options = options;
    }

    render(container = document.createElement("div"), children = []) {
      const uuid = container.getAttribute(UUID_ATTRIBUTE) ?? generateUUID();
      const domUpdater = new DOMUpdater(uuid);

      // Create controller instance
      const controllerInstance = this.options.controller ? new this.options.controller() : {};

      controllerInstance.children = [];
      controllerInstance._render_times = 0;

      // Setup render function
      const applyRender = () => {
        if (!container) return;

        const rendered = this.options.render?.bind(controllerInstance)();
        if (!rendered) return;

        controllerInstance._render_times++;

        const clone = container.cloneNode(true);
        clone.innerHTML = rendered;

        domUpdater.updateChildren(container, clone);

        // Bind models and events
        ModelManager.bindModels(container, controllerInstance);
        EventManager.bindEvents(container, controllerInstance);

        // Handle router links
        this.handleRouterLinks(container);

        // Render slots
        this.renderSlots(container, children);

        // Render sub-components
        this.renderSubComponents(container, controllerInstance);

        // Post-render callback
        if (this.options.postRender) {
          setTimeout(() => this.options.postRender.bind(controllerInstance)(), 100);
        }

        // Update attributes
        this.updateAttributes(container, controllerInstance);

        // Dispatch events
        container.dispatchEvent(new Event("change"));
        setTimeout(initFadeIn);

        return container.innerHTML;
      };

      // Setup container
      container.setAttribute(UUID_ATTRIBUTE, uuid);

      // Inject styles and meta
      StyleManager.injectComponentStyle(uuid, this.options.style);
      this.injectMeta();

      if (this.options.title) {
        document.title = this.options.title;
      }

      // Assign apply function
      controllerInstance.apply = applyRender;

      // Initial render
      applyRender();

      // Initialize attributes
      this.initializeAttributes(container, controllerInstance);

      // Dispatch load event
      container.dispatchEvent(new Event("load"));

      return controllerInstance;
    }

    handleRouterLinks(container) {
      if (!this.options.router) return;

      container.querySelectorAll("a[href]").forEach((element) => {
        if (element.dataset.listenerAdded) return;

        element.dataset.listenerAdded = "true";
        element.addEventListener("click", (event) => {
          event.preventDefault();
          this.options.router.navigate(element.getAttribute("href"));
        });
      });
    }

    renderSlots(container, children) {
      container.querySelectorAll("slot").forEach((slot) => {
        children.forEach((child) => slot.appendChild(child));
      });
    }

    renderSubComponents(container, controllerInstance) {
      container.querySelectorAll("*").forEach((element) => {
        const tagName = element.tagName.toUpperCase();
        const component = COMPONENT_REGISTRY.get(tagName);

        if (!component || element.hasAttribute(UUID_ATTRIBUTE)) return;

        controllerInstance.children.push(component.render(element, getChildren(element)));
      });
    }

    updateAttributes(container, controllerInstance) {
      const allAttributes = new Set([...container.getAttributeNames(), ...(this.options.attributes || [])]);

      allAttributes.forEach((name) => {
        const value = container.hasAttribute(name) ? container.getAttribute(name) : undefined;

        if (controllerInstance[name] !== value) {
          controllerInstance[name] = value;
          controllerInstance.onChangeAttribute?.(name);
        }
      });
    }

    initializeAttributes(container, controllerInstance) {
      const allAttributes = new Set([...container.getAttributeNames(), ...(this.options.attributes || [])]);

      allAttributes.forEach((name) => {
        const value = container.hasAttribute(name) ? container.getAttribute(name) : undefined;
        controllerInstance[name] = value;
      });
    }

    injectMeta() {
      if (!this.options.meta) return;

      this.options.meta.forEach((item) => {
        if (document.querySelector(`meta[name="${item.name}"]`)) return;

        const meta = document.createElement("meta");
        meta.setAttribute("name", item.name);
        meta.setAttribute("content", item.content);
        document.head.appendChild(meta);
      });
    }
  }

  /**
   * Creates a component with rendering and control capabilities
   * @param {Object} options - Component configuration options
   * @returns {ComponentInstance} - Component instance
   */
  function Component(options) {
    const component = new ComponentInstance(options);

    // Register component if tagName is provided
    if (options.tagName) {
      COMPONENT_REGISTRY.set(options.tagName.toUpperCase(), component);
    }

    return component;
  }

  /**
   * Modal configuration constants
   */
  const MODAL_STYLES = {
    OVERLAY: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999999999",
    MODAL: "position: fixed; top: 50%; left: 50%; border-radius: 0.25rem; min-width: 20rem; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); background-color: white; color: black; transition: opacity 0.3s, transform 0.3s; z-index: 999999999",
  };

  /**
   * Creates and displays a modal in the user interface
   * @param {Object} options - Modal configuration options
   * @param {Object} params - Additional parameters for the modal
   * @param {Object} events - Event handlers for the modal
   */
  function Modal(options, params = {}, events = {}) {
    const { controller, render, hideWhenClickOverlay, className, referrer } = options;

    const component = Component({ controller, render });
    const modal = document.createElement("div");

    // Setup modal styles
    modal.setAttribute("style", MODAL_STYLES.MODAL);
    modal.classList.add("modal");
    if (className) modal.classList.add(className);

    // Position modal relative to referrer or center
    if (referrer) {
      const pos = referrer.getBoundingClientRect();
      modal.style.top = `${pos.top + pos.height + 1}px`;
      modal.style.left = `${pos.left + pos.width + 1}px`;
      modal.style.transform = "";
    } else {
      modal.style.opacity = 0;
      modal.style.transform = "translate(-50%, 65%)";
    }

    // Close function
    const close = (...args) => {
      events.onClose?.(...args);

      if (!referrer) {
        modal.style.opacity = 0;
        modal.style.transform = "translate(-50%, 65%)";
        setTimeout(() => {
          overlay.remove();
          modal.remove();
        }, 300);
      } else {
        overlay.remove();
        modal.remove();
      }
    };

    // Render modal content
    const componentInstance = component.render(modal);
    Object.assign(componentInstance, params);
    componentInstance.apply();
    componentInstance.close = close;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("style", MODAL_STYLES.OVERLAY);
    overlay.classList.add("overlay");
    if (referrer) overlay.style.opacity = 0;

    // Add to DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Show modal with animation
    if (!referrer) {
      setTimeout(() => {
        modal.style.opacity = 1;
        modal.style.transform = "translate(-50%, -50%)";
      }, 50);
    }

    // Close on overlay click if enabled
    if (hideWhenClickOverlay) {
      overlay.onclick = close;
    }
  }

  /**
   * Route Matcher - Handles dynamic route matching
   */
  class RouteMatcher {
    static match(routePattern, path) {
      const patternSegments = routePattern.split("/");
      const pathSegments = path.split("/");

      if (patternSegments.length !== pathSegments.length) return null;

      const params = {};

      for (let i = 0; i < patternSegments.length; i++) {
        const pattern = patternSegments[i];
        const value = pathSegments[i];

        if (pattern.startsWith(":")) {
          params[pattern.slice(1)] = value;
        } else if (pattern !== value) {
          return null;
        }
      }

      return { params };
    }
  }

  /**
   * Router Instance - Handles navigation and route rendering
   */
  class RouterInstance {
    constructor(routes, config) {
      this.routes = routes;
      this.flatRoutes = this.flattenRoutes(routes);
      this.config = { useHash: true, ...config };
      this.params = {};
      this.alias = undefined;
      this.path = undefined;
      this.body = undefined;
      this.current_component = undefined;
      this.current_parent_component = undefined;
      this.listeners = new Map();
      this.container = undefined;

      this.setupEventListeners();
    }

    setupEventListeners() {
      window.addEventListener("popstate", () => this.render());
    }

    /**
     * Flattens nested routes into a single array with inherited paths
     * @param {Array} routes - Array of route configurations
     * @param {string} parentPath - Parent route path
     * @returns {Array} - Flattened routes array
     */
    flattenRoutes(routes, parentPath = "") {
      const flattened = [];
      
      routes.forEach(route => {
        const fullPath = parentPath + route.path;
        const flatRoute = {
          ...route,
          path: fullPath,
          originalPath: route.path,
          parentPath: parentPath,
          hasChildren: !!(route.children && route.children.length > 0)
        };
        
        // Add the parent route
        flattened.push(flatRoute);
        
        // Recursively flatten children
        if (route.children) {
          const childRoutes = this.flattenRoutes(route.children, fullPath);
          flattened.push(...childRoutes);
        }
      });
      
      return flattened;
    }

    navigate(path, body = null) {
      const targetPath = this.config.useHash ? `#${path}` : path;
      const currentPath = this.config.useHash ? window.location.hash : window.location.pathname;

      if (targetPath === currentPath) return;

      history.pushState({ urlPath: targetPath }, "", targetPath);
      this.body = body;

      if (document.startViewTransition) {
        document.startViewTransition(() => this.render());
      } else {
        this.render();
      }
    }

    listen(callback) {
      const uuid = generateUUID();
      this.listeners.set(uuid, callback);
      return uuid;
    }

    unlisten(uuid) {
      this.listeners.delete(uuid);
    }

    render(container = null) {
      if (container) this.container = container;
      if (!this.container) return;

      this.cleanupStyles();
      this.updateCurrentPath();

      const route = this.findMatchingRoute();

      if (route) {
        this.renderRoute(route);
      } else {
        this.renderErrorPage();
      }

      this.notifyListeners();
      setTimeout(initFadeIn);
    }

    cleanupStyles() {
      document.querySelectorAll("style[scopejs]").forEach((style) => {
        const scopeValue = style.getAttribute("scopejs");
        if (scopeValue === "" || scopeValue === "global") return;
        style.remove();
      });
    }

    updateCurrentPath() {
      if (this.config.useHash) {
        if (!location.hash) location.hash = "#/";
        this.path = location.hash.replace("#", "");
      } else {
        this.path = location.pathname;
      }

      if (this.path.endsWith("/") && this.path !== "/") {
        this.path = this.path.slice(0, -1);
      }
    }

    findMatchingRoute() {
      this.params = {};

      // Try exact match first in flattened routes
      let route = this.flatRoutes.find((r) => r.path === this.path);

      // Try dynamic match
      if (!route) {
        for (const r of this.flatRoutes) {
          const match = RouteMatcher.match(r.path, this.path);
          if (match) {
            this.params = match.params;
            route = r;
            break;
          }
        }
      }

      return route;
    }

    /**
     * Finds the parent route for a given route
     * @param {Object} route - Current route
     * @returns {Object|null} - Parent route or null
     */
    findParentRoute(route) {
      if (!route.parentPath) return null;
      
      return this.flatRoutes.find(r => 
        r.path === route.parentPath && r.hasChildren
      );
    }

    renderRoute(route) {
      if (this.current_component) {
        this.destroyComponent(this.current_component);
      }
      if (this.current_parent_component) {
        this.destroyComponent(this.current_parent_component);
      }

      const renderComponent = () => {
        this.alias = this.resolveAlias(route.alias);
        
        const parentRoute = this.findParentRoute(route);
        
        if (parentRoute) {
          // Render parent component first
          if (parentRoute.controller && typeof parentRoute.controller.render === 'function') {
            this.current_parent_component = parentRoute.controller.render(this.container);
          } else {
            this.current_parent_component = Component({
              ...parentRoute.controller,
              router: this,
            }).render(this.container);
          }
          
          // Find router-outlet in parent component
          const outlet = this.container.querySelector('router-outlet');
          if (outlet) {
            // Render child component in outlet
            if (route.controller && typeof route.controller.render === 'function') {
              this.current_component = route.controller.render(outlet);
            } else {
              this.current_component = Component({
                ...route.controller,
                router: this,
              }).render(outlet);
            }
          } else {
            console.warn('Parent component must include <router-outlet></router-outlet> to render child routes');
            // Fallback: render child in main container
            if (route.controller && typeof route.controller.render === 'function') {
              this.current_component = route.controller.render(this.container);
            } else {
              this.current_component = Component({
                ...route.controller,
                router: this,
              }).render(this.container);
            }
          }
        } else if (route.hasChildren) {
          // This is a parent route accessed directly - render with empty outlet
          if (route.controller && typeof route.controller.render === 'function') {
            this.current_component = route.controller.render(this.container);
          } else {
            this.current_component = Component({
              ...route.controller,
              router: this,
            }).render(this.container);
          }
          
          // Find router-outlet and show default message
          const outlet = this.container.querySelector('router-outlet');
          if (outlet) {
            outlet.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Select an option from the navigation</div>';
          }
        } else {
          // Render standalone component
          if (route.controller && typeof route.controller.render === 'function') {
            // It's already a component instance
            this.current_component = route.controller.render(this.container);
          } else {
            // It's a component configuration
            this.current_component = Component({
              ...route.controller,
              router: this,
            }).render(this.container);
          }
        }
      };

      if (route.middleware) {
        route.middleware(renderComponent);
      } else {
        renderComponent();
      }
    }

    renderErrorPage() {
      const errorConfig = this.config.error;
      this.alias = this.resolveAlias(errorConfig?.alias) || "404";

      this.current_component = Component(errorConfig ? { ...errorConfig.controller, router: this } : { render: () => "404" }).render(this.container);
    }

    resolveAlias(alias) {
      if (!alias) return undefined;
      return alias.startsWith(":") ? this.params[alias.slice(1)] : alias;
    }

    destroyComponent(component) {
      component.onDestroy?.();
      component.children?.forEach((child) => this.destroyComponent(child));
    }

    /**
     * Gets all routes including nested ones
     * @returns {Array} - All routes flattened
     */
    getAllRoutes() {
      return this.flatRoutes;
    }

    /**
     * Gets routes by parent path
     * @param {string} parentPath - Parent route path
     * @returns {Array} - Child routes
     */
    getChildRoutes(parentPath) {
      return this.flatRoutes.filter(route => route.parentPath === parentPath);
    }

    notifyListeners() {
      this.listeners.forEach((callback) => callback(this.params));
    }
  }

  /**
   * Router - Manages navigation and route rendering
   * @param {Array} routes - Array of route objects
   * @param {Object} config - Router configuration
   * @returns {RouterInstance} - Router instance
   */
  function Router(routes = [], config = {}) {
    return new RouterInstance(routes, config);
  }

  /**
   * Initialize auto-loading components when page loads
   */
  window.addEventListener("load", () => {
    document.querySelectorAll("*[autoload]").forEach((element) => {
      if (element.hasAttribute(UUID_ATTRIBUTE)) return;

      const tagName = element.tagName.toUpperCase();
      const component = COMPONENT_REGISTRY.get(tagName);

      if (component) {
        component.render(element, getChildren(element));
      }
    });
  });

  // Export for ES6 modules and return for UMD
  const ScopeJSExports = {
    Component,
    Modal,
    Router,
    enableDebugger,
  };

  // ES6 Module exports for modern import syntax (only when used as module)
  if (typeof module !== "undefined" && module.exports) {
    // CommonJS
    ScopeJSExports.Component = Component;
    ScopeJSExports.Modal = Modal;
    ScopeJSExports.Router = Router;
    ScopeJSExports.enableDebugger = enableDebugger;
    ScopeJSExports.default = ScopeJSExports;
  }

  // Return for UMD wrapper
  return ScopeJSExports;
});
