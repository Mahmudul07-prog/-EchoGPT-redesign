// Minimal ambient types for the (non-standard, vendor-prefixed) Web Speech
// Recognition API. TypeScript's bundled lib.dom.d.ts ships the *event* types
// (SpeechRecognitionEvent, SpeechRecognitionErrorEvent) but not the
// controller interface or the `webkitSpeechRecognition` global, so we
// declare just enough surface area to use it safely without `any`.
// This file has no imports/exports, so it augments the global scope.

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

interface Window {
  SpeechRecognition?: SpeechRecognitionStatic;
  webkitSpeechRecognition?: SpeechRecognitionStatic;
}
