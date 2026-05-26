import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TtsService } from '../tts.service';
import { ThemeService } from '../theme.service';
import { StorageService } from '../storage.service';

interface Level {
  id: number;
  title: string;
  soal: any;
  status: 'locked' | 'unlocked' | 'correct' | 'wrong';
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnDestroy {

  view: 'levels' | 'quiz' = 'levels';
  levels: Level[] = [];
  currentLevel: Level | null = null;
  touchedAnswers: Record<string, 'correct' | 'wrong'> = {};
  answered: boolean = false;
  totalScore: number = 0;

  private allQuestions: any[] = [
    { soal: 'السَّلَامُ عَلَيْكُمْ', A: 'Selamat pagi', B: 'Selamat siang', C: 'Assalamualaikum', D: 'Selamat malam', kunci: 'C' },
    { soal: 'كَيْفَ حَالُكَ', A: 'Apa kabar', B: 'Dimana rumahmu', C: 'Siapa namamu', D: 'Berapa umurmu', kunci: 'A' },
    { soal: 'شُكْرًا', A: 'Maaf', B: 'Tolong', C: 'Terima kasih', D: 'Permisi', kunci: 'C' },
    { soal: 'إِلَى اللِّقَاءِ', A: 'Selamat jalan', B: 'Sampai jumpa', C: 'Selamat datang', D: 'Selamat tinggal', kunci: 'B' },
    { soal: 'بِسْمِ اللَّهِ', A: 'Maha Suci Allah', B: 'Segala puji bagi Allah', C: 'Dengan nama Allah', D: 'Allah Maha Besar', kunci: 'C' },
    { soal: 'آكِلٌ', A: 'Minum', B: 'Makan', C: 'Tidur', D: 'Duduk', kunci: 'B' },
    { soal: 'مَدْرَسَة', A: 'Rumah', B: 'Masjid', C: 'Sekolah', D: 'Kantor', kunci: 'C' },
    { soal: 'صَبَاحُ الْخَيْرِ', A: 'Selamat sore', B: 'Selamat malam', C: 'Selamat pagi', D: 'Selamat siang', kunci: 'C' },
    { soal: 'كِتَاب', A: 'Pulpen', B: 'Buku', C: 'Meja', D: 'Kursi', kunci: 'B' },
    { soal: 'مَاء', A: 'Susu', B: 'Jus', C: 'Teh', D: 'Air', kunci: 'D' },
    { soal: 'مَسْجِد', A: 'Sekolah', B: 'Rumah', C: 'Masjid', D: 'Taman', kunci: 'C' },
    { soal: 'بَاب', A: 'Jendela', B: 'Pintu', C: 'Atap', D: 'Dinding', kunci: 'B' },
    { soal: 'قَلَم', A: 'Pensil', B: 'Buku', C: 'Pulpen', D: 'Penghapus', kunci: 'C' },
    { soal: 'كُرْسِيّ', A: 'Meja', B: 'Kursi', C: 'Lemari', D: 'Ranjang', kunci: 'B' },
    { soal: 'بَيْت', A: 'Sekolah', B: 'Masjid', C: 'Kantor', D: 'Rumah', kunci: 'D' },
    { soal: 'طَالِب', A: 'Guru', B: 'Murid', C: 'Kepala sekolah', D: 'Penjaga', kunci: 'B' },
    { soal: 'مُدَرِّس', A: 'Murid', B: 'Kepala sekolah', C: 'Guru', D: 'Penjaga', kunci: 'C' },
    { soal: 'أَنَا', A: 'Kamu', B: 'Dia', C: 'Kami', D: 'Saya', kunci: 'D' },
    { soal: 'أَنْتَ', A: 'Saya', B: 'Kamu (lk)', C: 'Dia', D: 'Kami', kunci: 'B' },
    { soal: 'نَحْنُ', A: 'Mereka', B: 'Kalian', C: 'Kami', D: 'Dia', kunci: 'C' },
    { soal: 'رَأْس', A: 'Tangan', B: 'Kaki', C: 'Kepala', D: 'Mata', kunci: 'C' },
    { soal: 'يَد', A: 'Kaki', B: 'Tangan', C: 'Kepala', D: 'Mata', kunci: 'B' },
    { soal: 'عَيْن', A: 'Telinga', B: 'Hidung', C: 'Mata', D: 'Mulut', kunci: 'C' },
    { soal: 'أُذُن', A: 'Mata', B: 'Telinga', C: 'Hidung', D: 'Mulut', kunci: 'B' },
    { soal: 'فَم', A: 'Hidung', B: 'Telinga', C: 'Mata', D: 'Mulut', kunci: 'D' },
    { soal: 'شَمْس', A: 'Bulan', B: 'Bintang', C: 'Matahari', D: 'Awan', kunci: 'C' },
    { soal: 'قَمَر', A: 'Matahari', B: 'Bulan', C: 'Bintang', D: 'Awan', kunci: 'B' },
    { soal: 'نَجْم', A: 'Bulan', B: 'Matahari', C: 'Awan', D: 'Bintang', kunci: 'D' },
    { soal: 'زَهْرَة', A: 'Pohon', B: 'Bunga', C: 'Daun', D: 'Buah', kunci: 'B' },
    { soal: 'شَجَر', A: 'Bunga', B: 'Buah', C: 'Daun', D: 'Pohon', kunci: 'D' },
    { soal: 'كَبِير', A: 'Kecil', B: 'Besar', C: 'Panjang', D: 'Pendek', kunci: 'B' },
    { soal: 'صَغِير', A: 'Besar', B: 'Panjang', C: 'Kecil', D: 'Pendek', kunci: 'C' },
    { soal: 'جَمِيل', A: 'Buruk', B: 'Cantik', C: 'Kotor', D: 'Keras', kunci: 'B' },
    { soal: 'سَيَّارَة', A: 'Motor', B: 'Sepeda', C: 'Mobil', D: 'Pesawat', kunci: 'C' },
    { soal: 'طَائِرَة', A: 'Mobil', B: 'Pesawat', C: 'Kereta', D: 'Kapal', kunci: 'B' },
    { soal: 'بَحْر', A: 'Gunung', B: 'Sungai', C: 'Laut', D: 'Danau', kunci: 'C' },
    { soal: 'جَبَل', A: 'Laut', B: 'Sungai', C: 'Danau', D: 'Gunung', kunci: 'D' },
    { soal: 'طَبِيب', A: 'Guru', B: 'Insinyur', C: 'Dokter', D: 'Petani', kunci: 'C' },
    { soal: 'مُهَنْدِس', A: 'Dokter', B: 'Guru', C: 'Petani', D: 'Insinyur', kunci: 'D' },
    { soal: 'فَلَّاح', A: 'Dokter', B: 'Guru', C: 'Petani', D: 'Insinyur', kunci: 'C' },
    { soal: 'أَسَد', A: 'Kucing', B: 'Anjing', C: 'Singa', D: 'Kelinci', kunci: 'C' },
    { soal: 'قِطّ', A: 'Anjing', B: 'Kucing', C: 'Singa', D: 'Sapi', kunci: 'B' },
    { soal: 'كَلْب', A: 'Kucing', B: 'Sapi', C: 'Kambing', D: 'Anjing', kunci: 'D' },
    { soal: 'بَقَر', A: 'Kambing', B: 'Sapi', C: 'Unta', D: 'Kerbau', kunci: 'B' },
    { soal: 'جَمَل', A: 'Sapi', B: 'Kambing', C: 'Unta', D: 'Kuda', kunci: 'C' },
    { soal: 'خُبْز', A: 'Nasi', B: 'Roti', C: 'Daging', D: 'Ikan', kunci: 'B' },
    { soal: 'لَحْم', A: 'Roti', B: 'Nasi', C: 'Daging', D: 'Susu', kunci: 'C' },
    { soal: 'لَبَن', A: 'Air', B: 'Jus', C: 'Teh', D: 'Susu', kunci: 'D' },
    { soal: 'بَيْض', A: 'Nasi', B: 'Telur', C: 'Daging', D: 'Ikan', kunci: 'B' },
    { soal: 'تُفَّاح', A: 'Pisang', B: 'Jeruk', C: 'Apel', D: 'Anggur', kunci: 'C' },
    { soal: 'مَوْز', A: 'Apel', B: 'Jeruk', C: 'Anggur', D: 'Pisang', kunci: 'D' },
    { soal: 'بُرْتُقَال', A: 'Apel', B: 'Pisang', C: 'Jeruk', D: 'Anggur', kunci: 'C' },
    { soal: 'عِنَب', A: 'Jeruk', B: 'Apel', C: 'Pisang', D: 'Anggur', kunci: 'D' },
    { soal: 'وَاحِد', A: 'Dua', B: 'Satu', C: 'Tiga', D: 'Empat', kunci: 'B' },
    { soal: 'اِثْنَان', A: 'Satu', B: 'Tiga', C: 'Dua', D: 'Empat', kunci: 'C' },
    { soal: 'ثَلَاثَة', A: 'Dua', B: 'Empat', C: 'Lima', D: 'Tiga', kunci: 'D' },
    { soal: 'أَرْبَعَة', A: 'Tiga', B: 'Lima', C: 'Empat', D: 'Enam', kunci: 'C' },
    { soal: 'خَمْسَة', A: 'Empat', B: 'Enam', C: 'Tujuh', D: 'Lima', kunci: 'D' },
    { soal: 'سِتَّة', A: 'Lima', B: 'Tujuh', C: 'Enam', D: 'Delapan', kunci: 'C' },
    { soal: 'سَبْعَة', A: 'Enam', B: 'Delapan', C: 'Sembilan', D: 'Tujuh', kunci: 'D' },
    { soal: 'ثَمَانِيَة', A: 'Tujuh', B: 'Sembilan', C: 'Delapan', D: 'Sepuluh', kunci: 'C' },
    { soal: 'تِسْعَة', A: 'Delapan', B: 'Sepuluh', C: 'Sebelas', D: 'Sembilan', kunci: 'D' },
    { soal: 'عَشَرَة', A: 'Sembilan', B: 'Sebelas', C: 'Sepuluh', D: 'Dua belas', kunci: 'C' },
    { soal: 'أَحْمَر', A: 'Biru', B: 'Hijau', C: 'Kuning', D: 'Merah', kunci: 'D' },
    { soal: 'أَزْرَق', A: 'Merah', B: 'Hijau', C: 'Biru', D: 'Kuning', kunci: 'C' },
    { soal: 'أَخْضَر', A: 'Biru', B: 'Kuning', C: 'Merah', D: 'Hijau', kunci: 'D' },
    { soal: 'أَصْفَر', A: 'Merah', B: 'Hijau', C: 'Biru', D: 'Kuning', kunci: 'D' },
    { soal: 'أَبْيَض', A: 'Hitam', B: 'Putih', C: 'Abu-abu', D: 'Coklat', kunci: 'B' },
    { soal: 'أَسْوَد', A: 'Putih', B: 'Abu-abu', C: 'Hitam', D: 'Coklat', kunci: 'C' },
    { soal: 'صَبَاح', A: 'Malam', B: 'Sore', C: 'Pagi', D: 'Siang', kunci: 'C' },
    { soal: 'مَسَاء', A: 'Pagi', B: 'Siang', C: 'Sore', D: 'Malam', kunci: 'C' },
    { soal: 'لَيْل', A: 'Pagi', B: 'Siang', C: 'Sore', D: 'Malam', kunci: 'D' },
    { soal: 'نَهَار', A: 'Malam', B: 'Sore', C: 'Siang', D: 'Pagi', kunci: 'C' },
    { soal: 'يَوْم', A: 'Bulan', B: 'Tahun', C: 'Minggu', D: 'Hari', kunci: 'D' },
    { soal: 'أُسْبُوع', A: 'Hari', B: 'Bulan', C: 'Minggu', D: 'Tahun', kunci: 'C' },
    { soal: 'شَهْر', A: 'Minggu', B: 'Tahun', C: 'Hari', D: 'Bulan', kunci: 'D' },
    { soal: 'سَنَة', A: 'Bulan', B: 'Minggu', C: 'Hari', D: 'Tahun', kunci: 'D' },
    { soal: 'حَارّ', A: 'Dingin', B: 'Panas', C: 'Sejuk', D: 'Basah', kunci: 'B' },
    { soal: 'بَارِد', A: 'Panas', B: 'Sejuk', C: 'Dingin', D: 'Kering', kunci: 'C' },
  ];

  private STORAGE_KEY = 'alqiroah_progress';

  constructor(private alertCtrl: AlertController, private tts: TtsService, public theme: ThemeService, private progress: StorageService) {
    this.initLevels();
  }

  ionViewWillEnter() { this.progress.addXp(2); }

  ngOnDestroy() {
    this.tts.stop();
  }

  private initLevels() {
    const levelTitles = [
      'Sapaan', 'Tanya Kabar', 'Terima Kasih', 'Perpisahan', 'Basmalah',
      'Aktivitas', 'Tempat', 'Waktu', 'Alat Tulis', 'Rumah',
      'Profesi', 'Kata Ganti', 'Anggota Tubuh', 'Alam', 'Tumbuhan',
      'Sifat', 'Kendaraan', 'Geografi', 'Profesi 2', 'Review',
      'Hewan 1', 'Hewan 2', 'Hewan 3', 'Hewan 4', 'Hewan 5',
      'Makanan 1', 'Makanan 2', 'Minuman', 'Telur', 'Buah 1',
      'Buah 2', 'Buah 3', 'Buah 4', 'Angka 1', 'Angka 2',
      'Angka 3', 'Angka 4', 'Angka 5', 'Angka 6', 'Angka 7',
      'Angka 8', 'Angka 9', 'Angka 10', 'Warna 1', 'Warna 2',
      'Warna 3', 'Warna 4', 'Warna 5', 'Warna 6', 'Waktu 1',
      'Waktu 2', 'Waktu 3', 'Waktu 4', 'Waktu 5', 'Kalender 1',
      'Kalender 2', 'Kalender 3', 'Kalender 4', 'Cuaca 1', 'Cuaca 2',
      'Sopan', 'Salam', 'Tubuh 1', 'Tubuh 2', 'Tubuh 3',
      'Alam 1', 'Alam 2', 'Alam 3', 'Langit', 'Tumbuhan 1',
      'Tumbuhan 2', 'Sifat 1', 'Sifat 2', 'Sifat 3', 'Sifat 4',
      'Kendaraan 1', 'Kendaraan 2', 'Profesi 3', 'Profesi 4', 'Review Akhir',
    ];

    this.levels = [];
    for (let i = 0; i < 80; i++) {
      this.levels.push({
        id: i + 1,
        title: levelTitles[i] || 'Level ' + (i + 1),
        soal: this.allQuestions[i],
        status: i === 0 ? 'unlocked' : 'locked',
      });
    }

    this.loadProgress();
    this.updateScore();
  }

  private updateScore() {
    this.totalScore = this.levels.filter(l => l.status === 'correct').length;
  }

  private loadProgress() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        for (const lvl of this.levels) {
          if (data[lvl.id]) {
            lvl.status = data[lvl.id].status;
          }
        }
      }
    } catch {}
  }

  private saveProgress() {
    const data: any = {};
    for (const lvl of this.levels) {
      data[lvl.id] = { status: lvl.status };
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  startLevel(level: Level) {
    if (level.status === 'locked') return;
    this.currentLevel = level;
    this.touchedAnswers = {};
    this.answered = false;
    this.view = 'quiz';
  }

  getIcon(jawaban: string): string {
    if (this.touchedAnswers[jawaban] === 'correct') return 'checkmark-circle';
    if (this.touchedAnswers[jawaban] === 'wrong') return 'close-circle';
    return 'radio-button-off-outline';
  }

  getWarna(jawaban: string): string {
    if (this.touchedAnswers[jawaban] === 'correct') return '#d4edda';
    if (this.touchedAnswers[jawaban] === 'wrong') return '#f8d7da';
    return 'transparent';
  }

  private playSound(type: 'correct' | 'wrong') {
    try {
      const ctx = this.tts.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.3;

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {}
  }

  async playArabic(text: string) {
    this.progress.addXp(1);
    this.tts.stop(); // sync inside speak() — no await to preserve gesture
    const clean = text.replace(/["""]/g, '').trim();
    if (!clean) return;
    await this.tts.speak(clean, 'ar', 0.7);
  }

  async pilihJawaban(jawaban: string) {
    if (!this.currentLevel || this.answered) return;
    const s = this.currentLevel.soal;
    if (this.touchedAnswers[jawaban]) return;

    const benar = jawaban === s.kunci;
    this.touchedAnswers[jawaban] = benar ? 'correct' : 'wrong';
    this.answered = true;

    if (benar) {
      this.playSound('correct');
      this.currentLevel.status = 'correct';
      const next = this.levels.find(l => l.id === this.currentLevel!.id + 1);
      if (next && next.status === 'locked') next.status = 'unlocked';
      this.saveProgress();
      this.updateScore();
      this.updateProgress();

      const alert = await this.alertCtrl.create({
        header: '✅ Benar!',
        message: 'Jawaban kamu tepat!',
        buttons: [{
          text: 'Kembali ke Peta',
          handler: () => { this.view = 'levels'; }
        }]
      });
      await alert.present();
    } else {
      this.playSound('wrong');
      this.currentLevel.status = 'wrong';
      this.saveProgress();
      this.updateScore();

      const alert = await this.alertCtrl.create({
        header: '❌ Salah!',
        buttons: [
          { text: 'Ulangi', handler: () => this.retryLevel() },
          { text: 'Kembali ke Peta', handler: () => { this.view = 'levels'; } }
        ]
      });
      await alert.present();
    }
  }

  retryLevel() {
    if (!this.currentLevel) return;
    this.currentLevel.status = 'unlocked';
    this.touchedAnswers = {};
    this.answered = false;
  }

  backToLevels() {
    this.view = 'levels';
    this.currentLevel = null;
  }

  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1000);
  }

  private readonly SKILL_INDEX = 2;

  get skillProgress(): number {
    return this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
  }

  private updateProgress() {
    this.progress.updateSkillProgress(this.SKILL_INDEX, Math.min(100, Math.round((this.totalScore / 80) * 100)));
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

}
