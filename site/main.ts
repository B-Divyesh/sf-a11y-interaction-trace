const offline = document.querySelector<HTMLElement>('#offline');

const redirectingToDemo = location.pathname === '/' && new URLSearchParams(location.search).get('demo') === '1';
if (redirectingToDemo) {
  sessionStorage.setItem('a11y-trace:route-focus', '1');
  location.replace('/demo/');
}

function updateNetworkState() {
  if (!offline) return;
  offline.hidden = navigator.onLine;
}

window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));

const routeStatus = document.querySelector<HTMLElement>('#route-status') ?? (() => {
  const region = document.createElement('div');
  region.id = 'route-status';
  region.className = 'sr-only';
  region.setAttribute('aria-live', 'polite');
  document.body.prepend(region);
  return region;
})();
const heading = document.querySelector<HTMLElement>('main h1');
heading?.setAttribute('tabindex', '-1');

document.addEventListener('click', event => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (link && link.origin === location.origin && !link.hasAttribute('download') && !link.hash) {
    sessionStorage.setItem('a11y-trace:route-focus', '1');
  }
});

function announceRoute(shouldFocus: boolean) {
  if (!heading) return;
  if (shouldFocus) heading.focus({ preventScroll: true });
  routeStatus.textContent = '';
  requestAnimationFrame(() => { routeStatus.textContent = heading.textContent ?? document.title; });
}

const shouldFocus = true;
sessionStorage.removeItem('a11y-trace:route-focus');
if (redirectingToDemo) sessionStorage.setItem('a11y-trace:route-focus', '1');
requestAnimationFrame(() => announceRoute(shouldFocus));
window.addEventListener('pageshow', event => { if (event.persisted) announceRoute(true); });
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' && !event.shiftKey && document.activeElement === heading) {
    event.preventDefault();
    document.querySelector<HTMLElement>('.skip')?.focus();
  }
}, { once: true });
