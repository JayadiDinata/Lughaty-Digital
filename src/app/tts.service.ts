import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private isNative = Capacitor.isNativePlatform();
  private isAndroid = Capacitor.getPlatform() === 'android';
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

  stopSynchronous(): void {
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.src = '';
      } catch {}
      this.audioEl = null;
    }
    try {
      window.speechSynthesis.cancel();
    } catch {}
    if (this.isNative) {
      try {
        TextToSpeech.stop().catch(() => {});
      } catch {}
    }
  }

  async speak(text: string, lang: string = 'en-US', _rate?: number): Promise<void> {
    if (!text) return;
    this.stopSynchronous();

    const rate = _rate ?? 1;

    // ── Android native (APK) ──
    if (this.isNative && this.isAndroid) {
      if (await this.tryGoogleTTS(text, lang)) return;
      try {
        await TextToSpeech.speak({ text, lang, rate, pitch: 1, volume: 1 });
        return;
      } catch {}
      if ('speechSynthesis' in window) {
        await this.speakWebSpeech(text, lang, rate);
        return;
      }
      return;
    }

    // ── iOS native (Capacitor app) ──
    if (this.isNative && this.isIOS) {
      await this.primeSpeech();
      try {
        await TextToSpeech.speak({ text, lang, rate, pitch: 1, volume: 1 });
        return;
      } catch {}
      if (await this.tryGoogleTTS(text, lang)) return;
      if ('speechSynthesis' in window) {
        await this.speakWebSpeech(text, lang, rate);
        return;
      }
      return;
    }

    // ── iOS web (Safari) ──
    if (this.isIOSWeb) {
      await this.primeSpeech();
      if ('speechSynthesis' in window) {
        await this.speakWebSpeech(text, lang, rate);
        return;
      }
      await this.tryGoogleTTS(text, lang);
      return;
    }

    // ── Desktop / other browsers ──
    if ('speechSynthesis' in window) {
      await this.speakWebSpeech(text, lang, rate);
      return;
    }
    await this.tryGoogleTTS(text, lang);
  }

  private async tryGoogleTTS(text: string, lang: string): Promise<boolean> {
    try {
      const tl = lang.startsWith('ar') ? 'ar' : lang.startsWith('id') ? 'id' : 'en';
      const q = encodeURIComponent(text.substring(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${tl}&client=tw-ob`;
      this.audioEl = new Audio(url);
      this.audioEl.volume = 1;
      await this.audioEl.play();
      return true;
    } catch {
      return false;
    }
  }

  private async primeSpeech(): Promise<void> {
    if (this.speechPrimed) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        const p = new SpeechSynthesisUtterance('.');
        p.volume = 0;
        window.speechSynthesis.speak(p);
        this.speechPrimed = true;
      }
    } catch {}
  }

  private speakWebSpeech(text: string, lang: string, rate?: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate ?? 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
      const timeout = Math.min(30000, Math.max(5000, text.length * 60));
      setTimeout(() => resolve(), timeout);
    });
  }

  async speakNow(text: string, lang: string = 'ar'): Promise<void> {
    return this.speak(text, lang);
  }

  async stop(): Promise<void> {
    this.stopSynchronous();
    if (this.isIOSWeb) {
      while (window.speechSynthesis.speaking) {
        await new Promise(r => setTimeout(r, 10));
      }
    }
  }
}
