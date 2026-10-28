import { createContext, useContext, useEffect, useMemo, useState, type MouseEvent, type ReactElement, type ReactNode } from 'react';

type RouteRecord = { path: string; element: ReactElement };
type RouterValue = { pathname: string; params: Record<string, string> };
type NavigationValue = RouterValue & { navigate: (to: string, replace?: boolean) => void };

const RouterContext = createContext<NavigationValue>({ pathname: '/', params: {}, navigate: () => undefined });

// Hash mode is used only for static preview hosting (VITE_HASH_ROUTER=true).
let memPath: string | null = null;
const HASH = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_HASH_ROUTER === 'true';

function getPathname() {
  if (HASH) {
    if (memPath === null) {
      const h = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      memPath = h ? `/${h}` : '/';
    }
    return memPath;
  }
  return window.location.pathname || '/';
}

function matchRoute(pattern: string, pathname: string) {
  if (pattern === '*') return { params: {} };
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(':')) params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    else if (patternPart !== pathPart) return null;
  }
  return { params };
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const onPopState = () => setPathname(getPathname());
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => { window.removeEventListener('popstate', onPopState); window.removeEventListener('hashchange', onPopState); };
  }, []);

  const navigate = (to: string, replace = false) => {
    if (HASH) { memPath = to.split('?')[0] || '/'; setPathname(memPath); return; }
    if (replace) window.history.replaceState({}, '', to);
    else window.history.pushState({}, '', to);
    setPathname(getPathname());
  };
  const value = useMemo(() => ({ pathname, params: {}, navigate }), [pathname]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function Link({ to, onClick, children, ...props }: { to: string; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void; children: ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const router = useContext(RouterContext);
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    router.navigate(to);
  };

  return <a href={HASH ? `#${to}` : to} onClick={navigate} {...props}>{children}</a>;
}

export function Routes({ children }: { children: ReactNode }) {
  const router = useContext(RouterContext);
  const { pathname } = router;
  const routes = Array.from(children as ReactElement[]).map((child) => child.props as RouteRecord);
  const route = routes.find((candidate) => matchRoute(candidate.path, pathname));
  if (!route) return null;
  const match = matchRoute(route.path, pathname);
  return <RouterContext.Provider value={{ ...router, pathname, params: match?.params ?? {} }}>{route.element}</RouterContext.Provider>;
}

export function Route(_props: RouteRecord) {
  return null;
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to, replace);
  }, [navigate, replace, to]);
  return null;
}

export function useLocation() {
  return { pathname: useContext(RouterContext).pathname };
}

export function useParams<T extends Record<string, string | undefined>>() {
  return useContext(RouterContext).params as T;
}
