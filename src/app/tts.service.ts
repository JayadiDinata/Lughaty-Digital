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

  async speak(text: string, lang: string = 'en-US', _rate?: number): Promise<void> {
    if (!text) return;
    await this.stop();

    // ── Android native (APK) ──
    // Google TTS via Audio element is most reliable on Android WebView
    if (this.isNative && this.isAndroid) {
      if (await this.tryGoogleTTS(text, lang)) return;
      try {
        await TextToSpeech.speak({ text, lang, rate: _rate ?? 1, pitch: 1, volume: 1 });
        return;
      } catch {}
      // Web Speech API last resort on Android
      if ('speechSynthesis' in window) {
        await this.speakWebSpeech(text, lang, _rate);
        return;
      }
      return;
    }

    // ── iOS native (Capacitor app) ──
    if (this.isNative && this.isIOS) {
      try {
        await TextToSpeech.speak({ text, lang, rate: _rate ?? 1, pitch: 1, volume: 1 });
        return;
      } catch {}
      if ('speechSynthesis' in window) {
        await this.speakWebSpeech(text, lang, _rate);
        return;
      }
      return;
    }

    // ── iOS web (Safari) ──
    if (this.isIOSWeb) {
      if ('speechSynthesis' in window) {
        await this.primeSpeech();
        await this.speakWebSpeech(text, lang, _rate);
        return;
      }
      await this.tryGoogleTTS(text, lang);
      return;
    }

    // ── Desktop / other browsers ──
    if ('speechSynthesis' in window) {
      await this.speakWebSpeech(text, lang, _rate);
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
      const p = new SpeechSynthesisUtterance('');
      p.volume = 0;
      window.speechSynthesis.speak(p);
      this.speechPrimed = true;
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
      setTimeout(() => resolve(), 5000);
    });
  }

  async speakNow(text: string, lang: string = 'ar'): Promise<void> {
    return this.speak(text, lang);
  }

  async stop(): Promise<void> {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
    window.speechSynthesis.cancel();
    if (this.isNative) { try { await TextToSpeech.stop(); } catch {} }
    if (this.isIOSWeb) {
      while (window.speechSynthesis.speaking) {
        await new Promise(r => setTimeout(r, 10));
      }
    }
  }
}
