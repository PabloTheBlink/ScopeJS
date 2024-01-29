/**
 * Initializes a new Router object.
 *
 * @constructor
 * @this {Router}
 * @return {void}
 */
export const Router = new (function Router() {
  this.params = {};
  this.navigate = (path) => (location.hash = `#${path}`);
  /**
   * Renders the specified routes to the given component.
   *
   * @param {Array} routes - An array of route objects.
   * @param {HTMLElement} component - The component to render the routes to.
   * @param {boolean} first_time - Indicates whether it is the first time rendering.
   */
  this.render = (routes = [], component = document.body, first_time = true) => {
    function matchDynamicRoute(routePattern, path) {
      const patternSegments = routePattern.split("/");
      const pathSegments = path.split("/");
      if (patternSegments.length !== pathSegments.length) return null;
      let params = {};
      for (let i = 0; i < patternSegments.length; i++) {
        const pattern = patternSegments[i];
        const value = pathSegments[i];
        if (pattern.startsWith(":")) {
          const paramName = pattern.slice(1);
          params[paramName] = value;
        } else if (pattern !== value) {
          return null;
        }
      }
      return { params };
    }
    if (!location.hash) location.hash = "#/";
    this.path = location.hash.replace("#", "");
    let route = routes.find((r) => r.path === this.path);
    this.params = {};
    if (!route) {
      for (let r of routes) {
        const match = matchDynamicRoute(r.path, this.path);
        if (match) {
          this.params = match.params;
          route = r;
          break;
        }
      }
    }
    if (route) {
      const state = document.createElement("div");
      state.classList.add("state");
      state.style.transition = "0.1s";
      if (component.querySelectorAll(".state").length > 0) state.style.display = "none";
      state.innerHTML = route.template;
      component.appendChild(state);
      setTimeout(function () {
        const states = component.querySelectorAll(".state");
        if (states.length > 1) {
          states.forEach(function (element, index) {
            if (index < states.length - 1) {
              element.style.opacity = "0";
              setTimeout(function () {
                element.remove();
              }, 100);
            } else {
              setTimeout(function () {
                element.style.display = "";
                window.dispatchEvent(new Event("route-changed"));
              }, 100);
            }
          });
        } else {
          window.dispatchEvent(new Event("route-changed"));
        }
      }, 100);
    }
    if (first_time) {
      window.onhashchange = () => this.render(routes, component, false);
    }
  };
})();
