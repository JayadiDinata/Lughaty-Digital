import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private isNative = Capacitor.isNativePlatform();
  private isIOS = Capacitor.getPlatform() === 'ios';
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private speechPrimed = false;
  private isIOSWeb = false;

  constructor() {
    this.isIOSWeb = !this.isNative && /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctor) {
        this.audioCtx = new Ctor();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx!;
  }

  async speak(text: string, lang: string = 'en-US', _rate?: number): Promise<void> {
    if (!text) return;
    this.stop();

    // iOS native (Capacitor app): AVSpeechSynthesizer
    if (this.isNative && this.isIOS) {
      try {
        await TextToSpeech.speak({ text, lang, rate: _rate ?? 1, pitch: 1, volume: 1 });
        return;
      } catch {}
    }

    // On iOS web (Safari), Google TTS is blocked by CORS.
    // Use Web Speech API as primary for all web browsers.
    if ('speechSynthesis' in window) {
      // Prime speech synthesis on iOS (needs one silent call before first real call)
      if (this.isIOSWeb && !this.speechPrimed) {
        try {
          const p = new SpeechSynthesisUtterance('');
          p.volume = 0;
          window.speechSynthesis.speak(p);
          this.speechPrimed = true;
        } catch {}
      }

      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = _rate ?? 1;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
        setTimeout(() => resolve(), 10000);
      });
    }

    // Fallback: Google TTS via audio element (desktop browsers)
    try {
      const tl = lang.startsWith('ar') ? 'ar' : lang.startsWith('id') ? 'id' : 'en';
      const q = encodeURIComponent(text.substring(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${tl}&client=tw-ob`;
      this.audioEl = new Audio(url);
      this.audioEl.volume = 1;
      await this.audioEl.play();
      return;
    } catch {}

    // Last resort: native Capacitor plugin
    if (this.isNative) {
      try { await TextToSpeech.speak({ text, lang, rate: _rate ?? 1, pitch: 1, volume: 1 }); } catch {}
    }
  }

  async speakNow(text: string, lang: string = 'ar'): Promise<void> {
    return this.speak(text, lang);
  }

  async stop(): Promise<void> {
    if (this.audioEl) { this.audioEl.pause(); this.audioEl.src = ''; }
    window.speechSynthesis.cancel();
    if (this.isNative) { try { await TextToSpeech.stop(); } catch {} }
  }
}
