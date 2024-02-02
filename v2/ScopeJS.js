const components = {};
export function Component({ tagName, controller, render }) {
  const c = new (function Component() {
    this.render = function (container = document.body) {
      const apply = function () {
        container.innerHTML = render.bind(c)();
        for (const htmlEvent of ["onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onkeydown", "onkeypress", "onkeyup", "onabort", "onbeforeunload", "onerror", "onload", "onresize", "onscroll", "onunload", "onblur", "onchange", "onfocus", "onreset", "onselect", "onsubmit", "oncontextmenu", "oninput", "oninvalid", "onsearch", "ondrag", "ondragend", "ondragenter", "ondragleave", "ondragover", "ondragstart", "ondrop", "oncopy", "oncut", "onpaste", "onwheel", "ontouchcancel", "ontouchend", "ontouchmove", "ontouchstart"]) {
          container.querySelectorAll(`*[${htmlEvent}]`).forEach((el) => {
            const clickEventName = el.getAttribute(htmlEvent);
            const parts = clickEventName.split(".");
            let func = c;
            for (const part of parts) {
              func = func[part];
            }
            if (typeof func === "function") {
              el[htmlEvent] = function (event) {
                event.preventDefault();
                setTimeout(func.bind(c), 0, event);
              };
            }
          });
        }
        container.querySelectorAll("*").forEach((element) => {
          if (components[element.tagName.toUpperCase()]) {
            components[element.tagName.toUpperCase()].render(element);
          }
        });
      };
      const c = controller ? new controller() : new (function () {})();
      c.apply = apply;
      apply();
      return c;
    };
  })();
  if (tagName) components[tagName.toUpperCase()] = c;
  return c;
}
export function Modal({ controller, render, hideWhenClickOverlay }, params = {}) {
  const MODAL_STYLE = {
    OVERLAY: "position: fixed; top: 0; left: 0; width: 100%; height: 100%",
    MODAL: "position: fixed; top: 50%; left: 50%; border-radius: 0.25rem; min-width: 20rem; max-width: calc(100% - 2rem); transform: translate(-50%, -50%); background-color: white; color: black; transition: opacity 0.3s, transform 0.3s",
  };
  const component = Component({ controller, render });
  const modal = document.createElement("div");
  modal.setAttribute("style", MODAL_STYLE.MODAL);
  modal.style.opacity = 0;
  modal.style.transform = "translate(-50%, 65%)";
  modal.classList.add("scopejs-modal");
  const close = function () {
    modal.style.opacity = 0;
    modal.style.transform = "translate(-50%, 65%)";
    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
  };
  const r = component.render(modal);
  for (let key in params) r[key] = params[key];
  r.apply();
  r.close = close;
  const overlay = document.createElement("div");
  overlay.setAttribute("style", MODAL_STYLE.OVERLAY);
  overlay.classList.add("scopejs-overlay");
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.style.opacity = 1;
    modal.style.transform = "translate(-50%, -50%)";
  }, 50);
  if (hideWhenClickOverlay) {
    overlay.onclick = close;
  }
}
