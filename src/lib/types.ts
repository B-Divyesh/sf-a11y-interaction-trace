export type TraceNode = {
  tag: string;
  role: string;
  name: string;
  selector: string;
  states: string[];
  focused?: boolean;
};

export type TraceSnapshot = {
  scope: string;
  nodes: TraceNode[];
};

export type TraceEvent = {
  id: string;
  at: number;
  kind: 'start' | 'keyboard' | 'focus' | 'marker' | 'stop';
  action: string;
  modifiers?: string[];
  focus?: TraceNode;
  snapshot?: TraceSnapshot;
  screenshot?: string;
  screenshotError?: string;
};

export type TraceSession = {
  schema: 1;
  id: string;
  status: 'recording' | 'stopped';
  startedAt: string;
  endedAt?: string;
  tabId: number;
  windowId: number;
  url: string;
  title: string;
  viewport: { width: number; height: number; devicePixelRatio: number };
  userAgent: string;
  screenshotsEnabled: boolean;
  events: TraceEvent[];
};

export type RecorderState = {
  session: TraceSession | null;
  error?: string;
};

export type RuntimeMessage =
  | { type: 'GET_STATE' }
  | { type: 'START_SESSION'; screenshotsEnabled: boolean }
  | { type: 'STOP_SESSION' }
  | { type: 'CLEAR_SESSION' }
  | { type: 'EXPORT_SESSION' }
  | { type: 'CONTENT_READY' }
  | { type: 'TRACE_EVENT'; event: Omit<TraceEvent, 'id' | 'at'>; elapsed: number; requestScreenshot?: boolean }
  | { type: 'CONTENT_META'; url: string; title: string; viewport: TraceSession['viewport']; userAgent: string }
  | { type: 'CONTENT_STOP' };
