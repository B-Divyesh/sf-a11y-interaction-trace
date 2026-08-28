import { maskSensitiveFields, unmaskSensitiveFields } from '../../src/lib/screenshot-mask';

Object.assign(window, {
  tracePrivacyFixture: { mask: maskSensitiveFields, unmask: unmaskSensitiveFields }
});
