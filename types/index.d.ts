export interface ComponentOptions {
  controller?: new () => any;
  render?: () => string;
  postRender?: () => void;
  tagName?: string;
  style?: string;
  title?: string;
  meta?: Array<{ name: string; content: string }>;
  attributes?: string[];
  router?: RouterInstance;
}

export interface ComponentInstance {
  render(container?: HTMLElement, children?: HTMLElement[]): any;
  apply(): void;
  onDestroy?(): void;
  children?: ComponentInstance[];
  _render_times?: number;
  [key: string]: any;
}

export interface ModalOptions {
  controller?: new () => any;
  render?: () => string;
  hideWhenClickOverlay?: boolean;
  className?: string;
  referrer?: HTMLElement;
}

export interface RouteConfig {
  path: string;
  controller?: ComponentOptions;
  alias?: string;
  middleware?: (next: () => void) => void;
}

export interface RouterConfig {
  useHash?: boolean;
  error?: {
    controller?: ComponentOptions;
    alias?: string;
  };
}

export interface RouterInstance {
  routes: RouteConfig[];
  config: RouterConfig;
  params: Record<string, string>;
  alias?: string;
  path?: string;
  body?: any;
  current_component?: ComponentInstance;
  
  navigate(path: string, body?: any): void;
  listen(callback: (params: Record<string, string>) => void): string;
  unlisten(uuid: string): void;
  render(container?: HTMLElement): void;
}

declare global {
  interface Window {
    ScopeJS: {
      Component: typeof Component;
      Modal: typeof Modal;
      Router: typeof Router;
      enableDebugger: typeof enableDebugger;
    };
    Component: typeof Component;
    Modal: typeof Modal;
    Router: typeof Router;
    enableDebugger: typeof enableDebugger;
  }
}

export declare function Component(options: ComponentOptions): ComponentInstance;

export declare function Modal(
  options: ModalOptions,
  params?: Record<string, any>,
  events?: { onClose?: (...args: any[]) => void }
): void;

export declare function Router(
  routes?: RouteConfig[],
  config?: RouterConfig
): RouterInstance;

export declare function enableDebugger(enabled: boolean): void;

export default {
  Component,
  Modal,
  Router,
  enableDebugger
};