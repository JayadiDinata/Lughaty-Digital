import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private isNative = Capacitor.isNativePlatform();
  private isIOS = Capacitor.getPlatform() === 'ios';
  private audioEl: HTMLAudioElement | null = null;

  async speak(text: string, lang: string = 'en-US', _rate?: number): Promise<void> {
    if (!text) return;
    this.stop();

    // iOS native: AVSpeechSynthesizer (via Capacitor plugin) is most reliable
    if (this.isNative && this.isIOS) {
      try {
        await TextToSpeech.speak({ text, lang, rate: _rate ?? 1, pitch: 1, volume: 1 });
        return;
      } catch {}
    }

    // Try Google TTS via audio element
    try {
      const tl = lang.startsWith('ar') ? 'ar' : lang.startsWith('id') ? 'id' : 'en';
      const q = encodeURIComponent(text.substring(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${q}&tl=${tl}&client=tw-ob`;
      this.audioEl = new Audio(url);
      this.audioEl.volume = 1;
      await this.audioEl.play();
      return;
    } catch {}

    // Fallback to Web Speech API (works on browsers / GitHub Pages / iOS Safari)
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = _rate ?? 1;
        window.speechSynthesis.speak(utterance);
        return;
      } catch {}
    }

    // Fallback to native Capacitor plugin (Android / iOS if above failed)
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
