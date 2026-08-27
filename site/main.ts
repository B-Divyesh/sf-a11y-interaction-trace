const offline = document.querySelector<HTMLElement>('#offline');

function updateNetworkState() {
  if (!offline) return;
  offline.hidden = navigator.onLine;
}

window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
