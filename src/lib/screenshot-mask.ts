import { sensitiveElements } from './privacy';

const MASK_LAYER_ID = '__a11y_trace_masks__';

/**
 * Covers every field recognised by the shared privacy classifier immediately
 * before browser capture. It resolves only after two animation frames, so the
 * compositor has had a chance to paint the complete layer before capture.
 * The caller must remove the layer after capture has settled.
 */
export async function maskSensitiveFields(documentRoot: Document = document): Promise<void> {
  documentRoot.getElementById(MASK_LAYER_ID)?.remove();
  const layer = documentRoot.createElement('div');
  layer.id = MASK_LAYER_ID;
  layer.setAttribute('aria-hidden', 'true');
  for (const element of sensitiveElements(documentRoot)) {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const mask = documentRoot.createElement('span');
    Object.assign(mask.style, {
      position: 'fixed', zIndex: '2147483646', left: `${rect.left}px`, top: `${rect.top}px`,
      width: `${rect.width}px`, height: `${rect.height}px`, background: '#1b1e1a',
      color: '#f2f0e8', border: '2px solid #cbef45', font: '700 12px/1 system-ui',
      display: 'grid', placeItems: 'center'
    });
    mask.textContent = 'MASKED';
    layer.append(mask);
  }
  documentRoot.documentElement.append(layer);
  const view = documentRoot.defaultView;
  if (!view) return;
  await new Promise<void>(resolve => view.requestAnimationFrame(() => resolve()));
  await new Promise<void>(resolve => view.requestAnimationFrame(() => resolve()));
}

export function unmaskSensitiveFields(documentRoot: Document = document): void {
  documentRoot.getElementById(MASK_LAYER_ID)?.remove();
}
