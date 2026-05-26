import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '../translate.service';
import { TtsService } from '../tts.service';
import { ThemeService } from '../theme.service';
import { StorageService } from '../storage.service';

interface Lang {
  code: string;
  label: string;
  voiceLang?: string;
}

const idAr: Record<string, string> = {
  'halo': 'السَّلَامُ عَلَيْكُمْ',
  'hai': 'السَّلَامُ عَلَيْكُمْ',
  'apa kabar': 'كَيْفَ حَالُكَ',
  'baik': 'بِخَيْرٍ',
  'terima kasih': 'شُكْرًا',
  'sama sama': 'عَفْوًا',
  'selamat pagi': 'صَبَاحُ الْخَيْرِ',
  'selamat siang': 'نَهَارُكَ سَعِيدٌ',
  'selamat sore': 'مَسَاءُ الْخَيْرِ',
  'selamat malam': 'لَيْلَةٌ سَعِيدَةٌ',
  'sampai jumpa': 'إِلَى اللِّقَاءِ',
  'siapa nama kamu': 'مَا اسْمُكَ',
  'nama saya': 'اسْمِي',
  'senang bertemu denganmu': 'أَنَا سَعِيدٌ بِلِقَائِكَ',
  'dimana kamu tinggal': 'أَيْنَ تَسْكُنُ',
  'saya tinggal di': 'أَسْكُنُ فِي',
  'selamat datang': 'أَهْلًا وَسَهْلًا',
  'bagaimana kabarmu': 'كَيْفَ حَالُكَ',
  'iya': 'نَعَمْ',
  'tidak': 'لَا',
  'mari': 'هَيَّا بِنَا',
  'silakan': 'تَفَضَّلْ',
  'maaf': 'آسِفٌ',
  'permisi': 'عَفْوًا',
  'tolong': 'مِنْ فَضْلِكَ',
  'selamat': 'مَبْرُوكٌ',
  'semoga berhasil': 'بِالتَّوْفِيقِ',
  'ayo pergi': 'هَيَّا نَذْهَبُ',
  'saya mengerti': 'أَنَا أَفْهَمُ',
  'saya tidak mengerti': 'لَا أَفْهَمُ',
  'bisa tolong ulangi': 'هَلْ يُمْكِنُكَ إِعَادَةُ ذَلِكَ',
};

const arId: Record<string, string> = {};
for (const [k, v] of Object.entries(idAr)) {
  arId[v] = k;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnDestroy {

  // TTS
  text: string = '';
  language: string = 'ar';
  speed: number = 0.8;
  isPlaying: boolean = false;
  isPaused: boolean = false;
  mode: 'full' | 'step' = 'full';
  words: string[] = [];
  currentWordIndex: number = -1;
  utterance: SpeechSynthesisUtterance | null = null;

  ttsLanguages: Lang[] = [
    { code: 'ar', label: 'Arab', voiceLang: 'ar' },
    { code: 'id', label: 'Indonesia', voiceLang: 'id' },
    { code: 'en', label: 'Inggris', voiceLang: 'en' },
  ];

  // Translator
  dictionaryEntries: [string, string][] = Object.entries(idAr);
  transLanguages: Lang[] = [
    { code: 'detect', label: 'Deteksi' },
    { code: 'id', label: 'Indonesia' },
    { code: 'ar', label: 'Arab' },
    { code: 'en', label: 'Inggris' },
  ];
  sourceLang: string = 'detect';
  targetLang: string = 'ar';
  transInput: string = '';
  translatedText: string = '';
  loading: boolean = false;
  error: string = '';
  online: boolean = navigator.onLine;

  constructor(private translateSvc: TranslateService, private tts: TtsService, public theme: ThemeService, private progress: StorageService) {
    this.tts.stop();
    window.addEventListener('online', () => { this.online = true; });
    window.addEventListener('offline', () => { this.online = false; });
  }

  ionViewWillEnter() {
    this.progress.addXp(2);
    const savedText = localStorage.getItem('istima_text');
    const savedLang = localStorage.getItem('istima_lang');
    if (savedText) {
      this.text = savedText;
      localStorage.removeItem('istima_text');
    }
    if (savedLang && this.ttsLanguages.find(l => l.code === savedLang)) {
      this.language = savedLang;
      localStorage.removeItem('istima_lang');
    }
  }

  ngOnDestroy() {
    this.tts.stop();
  }

  get voiceLang(): string {
    return this.ttsLanguages.find(l => l.code === this.language)?.voiceLang || 'ar';
  }

  getLabel(): string {
    return this.ttsLanguages.find(l => l.code === this.language)?.label || '';
  }

  // --- TTS ---

  private async speak(text: string, stepCallback?: () => void) {
    // stop() is called internally by tts.speak() — no await here to preserve gesture
    this.isPlaying = true;
    this.isPaused = false;
    this.utterance = null;

    const lang = this.voiceLang;

    if (stepCallback) {
      await this.tts.speak(text, lang, this.speed);
      stepCallback();
    } else {
      await this.tts.speak(text, lang, this.speed);
      this.isPlaying = false;
      this.isPaused = false;
      this.currentWordIndex = -1;
    }
  }

  playFull() {
    if (!this.text.trim()) return;
    this.progress.addXp(1);
    this.updateProgress();
    this.mode = 'full';
    this.currentWordIndex = -1;
    this.words = [];
    this.speak(this.text.trim());
  }

  playStepByStep() {
    if (!this.text.trim()) return;
    this.progress.addXp(1);
    this.updateProgress();
    this.mode = 'step';
    this.words = this.text.trim().split(/\s+/);
    this.currentWordIndex = -1;
    this.nextWord();
  }

  private nextWord() {
    this.currentWordIndex++;
    if (this.currentWordIndex >= this.words.length) {
      this.isPlaying = false;
      this.currentWordIndex = -1;
      this.utterance = null;
      return;
    }
    const idx = this.currentWordIndex;
    this.speak(this.words[idx], () => {
      if (this.mode === 'step' && this.currentWordIndex === idx) {
        this.nextWord();
      }
    });
  }

  playPause() {
    if (this.isPaused) {
      this.isPaused = false;
      if (this.mode === 'step') {
        this.nextWord();
      } else {
        this.playFull();
      }
    } else {
      this.tts.stop();
      this.isPaused = true;
    }
  }

  stop() {
    this.tts.stop();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentWordIndex = -1;
    this.utterance = null;
  }

  nextWordManual() {
    if (this.mode === 'step' && this.isPlaying) {
      this.tts.stop();
      this.nextWord();
    }
  }

  prevWordManual() {
    if (this.mode === 'step' && this.currentWordIndex > 0) {
      this.tts.stop();
      this.currentWordIndex -= 2;
      this.nextWord();
    }
  }

  // --- Translator ---

  swapLangs() {
    const tmp = this.sourceLang;
    this.sourceLang = this.targetLang;
    this.targetLang = tmp;
    this.translatedText = '';
    this.error = '';
  }

  translateLocal(text: string): string | null {
    if (this.sourceLang === 'id' && this.targetLang === 'ar') {
      const lower = text.toLowerCase().trim();
      if (idAr[lower]) return idAr[lower];
      for (const key of Object.keys(idAr)) {
        if (lower.includes(key)) {
          const rest = lower.replace(key, '').trim();
          return (rest ? rest + ' ' : '') + idAr[key];
        }
      }
    }
    if (this.sourceLang === 'ar' && this.targetLang === 'id') {
      if (arId[text]) return arId[text];
    }
    return null;
  }

  async translate() {
    const text = this.transInput.trim();
    if (!text) return;

    const local = this.translateLocal(text);
    if (local) {
      this.translatedText = local;
      this.error = '';
      return;
    }

    this.loading = true;
    this.error = '';
    this.translatedText = '';

    if (!this.online) {
      this.error = 'Tidak ada koneksi internet.';
      this.loading = false;
      return;
    }

    try {
      this.translatedText = await this.translateSvc.translate(text, this.sourceLang, this.targetLang);
    } catch (e: any) {
      this.error = e.message || 'Gagal menerjemahkan. Coba lagi.';
    } finally {
      this.loading = false;
    }
  }

  sendToTTS() {
    this.text = this.translatedText;
    const ttsLang = this.ttsLanguages.find(l => l.code === this.targetLang);
    if (ttsLang) this.language = this.targetLang;
    this.transInput = '';
    this.translatedText = '';
  }

  clearTrans() {
    this.transInput = '';
    this.translatedText = '';
    this.error = '';
  }

  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1000);
  }

  private readonly SKILL_INDEX = 0;

  get skillProgress(): number {
    return this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
  }

  private updateProgress() {
    const cur = this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
    this.progress.updateSkillProgress(this.SKILL_INDEX, Math.min(100, cur + 5));
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

}
