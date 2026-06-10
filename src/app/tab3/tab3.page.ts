import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ThemeService } from '../theme.service';

interface QuizCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  questions: any[];
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnDestroy {
  view: 'categories' | 'quiz' = 'categories';
  categories: QuizCategory[] = [];
  currentCategory: QuizCategory | null = null;
  currentQuestionIndex: number = 0;
  touchedAnswers: Record<string, 'correct' | 'wrong'> = {};
  answered: boolean = false;
  totalScore: number = 0;
  totalQuestions: number = 0;
  showResult: boolean = false;

  constructor(private alertCtrl: AlertController, public theme: ThemeService) {
    this.initCategories();
  }

  private initCategories() {
    this.categories = [
      {
        id: 'arabic',
        title: 'Bahasa Arab Dasar',
        icon: 'language-outline',
        color: 'from-amber-500 to-amber-600',
        description: 'Kosakata dan frasa bahasa Arab dasar',
        questions: [
          { soal: 'السَّلَامُ عَلَيْكُمْ', A: 'Selamat pagi', B: 'Selamat siang', C: 'Assalamualaikum', D: 'Selamat malam', kunci: 'C' },
          { soal: 'كَيْفَ حَالُكَ', A: 'Apa kabar', B: 'Dimana rumahmu', C: 'Siapa namamu', D: 'Berapa umurmu', kunci: 'A' },
          { soal: 'شُكْرًا', A: 'Maaf', B: 'Tolong', C: 'Terima kasih', D: 'Permisi', kunci: 'C' },
          { soal: 'كِتَاب', A: 'Pulpen', B: 'Buku', C: 'Meja', D: 'Kursi', kunci: 'B' },
          { soal: 'مَدْرَسَة', A: 'Rumah', B: 'Masjid', C: 'Sekolah', D: 'Kantor', kunci: 'C' },
          { soal: 'مَسْجِد', A: 'Sekolah', B: 'Rumah', C: 'Masjid', D: 'Taman', kunci: 'C' },
          { soal: 'بَيْت', A: 'Sekolah', B: 'Masjid', C: 'Kantor', D: 'Rumah', kunci: 'D' },
          { soal: 'مَاء', A: 'Susu', B: 'Jus', C: 'Teh', D: 'Air', kunci: 'D' },
          { soal: 'صَبَاحُ الْخَيْرِ', A: 'Selamat sore', B: 'Selamat malam', C: 'Selamat pagi', D: 'Selamat siang', kunci: 'C' },
          { soal: 'إِلَى اللِّقَاءِ', A: 'Selamat jalan', B: 'Sampai jumpa', C: 'Selamat datang', D: 'Selamat tinggal', kunci: 'B' },
        ],
      },
      {
        id: 'islamic_knowledge',
        title: 'Pengetahuan Islam',
        icon: 'bulb-outline',
        color: 'from-emerald-500 to-emerald-600',
        description: 'Pengetahuan dasar tentang ajaran Islam',
        questions: [
          { soal: 'Berapa jumlah rukun Islam?', A: '3', B: '4', C: '5', D: '6', kunci: 'C' },
          { soal: 'Berapa jumlah rukun Iman?', A: '3', B: '4', C: '5', D: '6', kunci: 'D' },
          { soal: 'Apa kitab suci umat Islam?', A: 'Injil', B: 'Taurat', C: 'Al-Quran', D: 'Zabur', kunci: 'C' },
          { soal: 'Siapa nabi terakhir?', A: 'Nabi Musa', B: 'Nabi Isa', C: 'Nabi Muhammad', D: 'Nabi Ibrahim', kunci: 'C' },
          { soal: 'Apa ibadah yang menjadi tiang agama?', A: 'Puasa', B: 'Zakat', C: 'Sholat', D: 'Haji', kunci: 'C' },
          { soal: 'Berapa jumlah surah dalam Al-Quran?', A: '110', B: '114', C: '120', D: '124', kunci: 'B' },
          { soal: 'Apa nama malaikat pembagi rezeki?', A: 'Jibril', B: 'Mikail', C: 'Israfil', D: 'Izrail', kunci: 'B' },
          { soal: 'Apa rukun Islam yang keempat?', A: 'Syahadat', B: 'Sholat', C: 'Puasa', D: 'Zakat', kunci: 'C' },
          { soal: 'Dimana Al-Quran pertama kali diturunkan?', A: 'Madinah', B: 'Mekkah', C: 'Yerussalem', D: 'Kairo', kunci: 'B' },
          { soal: 'Apa arti "Islam"?', A: 'Keselamatan', B: 'Kedamaian', C: 'Penyerahan diri', D: 'Kebahagiaan', kunci: 'C' },
        ],
      },
      {
        id: 'dakwah',
        title: 'Dakwah & Penyiaran Islam',
        icon: 'megaphone-outline',
        color: 'from-blue-500 to-blue-600',
        description: 'Pengetahuan tentang dakwah dan komunikasi Islam',
        questions: [
          { soal: 'Apa arti "Dakwah"?', A: 'Pendidikan', B: 'Menyebarkan ajaran Islam', C: 'Politik', D: 'Perdagangan', kunci: 'B' },
          { soal: 'Dakwah dilakukan dengan cara yang...', A: 'Kasar', B: 'Bijaksana', C: 'Dipaksa', D: 'Marah', kunci: 'B' },
          { soal: 'Media dakwah yang efektif di era digital adalah...', A: 'Media sosial', B: 'Koran', C: 'Radio saja', D: 'TV saja', kunci: 'A' },
          { soal: 'Siapan nabi yang mendapat gelar "Khatamul Anbiya"?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Muhammad', D: 'Nabi Isa', kunci: 'C' },
          { soal: 'Apa yang harus dimiliki seorang dai?', A: 'Kekayaan', B: 'Ilmu', C: 'Kekuasaan', D: 'Keturunan', kunci: 'B' },
          { soal: 'Berdakwah dengan hikmah artinya...', A: 'Dengan kekerasan', B: 'Dengan kebijaksanaan', C: 'Dengan paksaan', D: 'Dengan harta', kunci: 'B' },
          { soal: 'Ayat Al-Quran yang pertama turun adalah...', A: 'Al-Fatihah', B: 'Al-Alaq 1-5', C: 'An-Nas', D: 'Al-Ikhlas', kunci: 'B' },
          { soal: 'Salah satu tujuan dakwah adalah...', A: 'Mencari kekayaan', B: 'Mengajak kepada kebaikan', C: 'Mencari popularitas', D: 'Berpolitik', kunci: 'B' },
          { soal: 'Dalam QS. An-Nahl ayat 125, Allah memerintahkan dakwah dengan cara...', A: 'Kekerasan', B: 'Hikmah', C: 'Paksaan', D: 'Tipu daya', kunci: 'B' },
          { soal: 'Yang bukan termasuk media dakwah adalah...', A: 'Ceramah', B: 'Tulisan', C: 'Kekerasan', D: 'Film', kunci: 'C' },
        ],
      },
      {
        id: 'sejarah',
        title: 'Sejarah Islam',
        icon: 'time-outline',
        color: 'from-purple-500 to-purple-600',
        description: 'Peristiwa penting dalam sejarah Islam',
        questions: [
          { soal: 'Tahun berapa Nabi Muhammad SAW lahir?', A: '570 M', B: '580 M', C: '590 M', D: '600 M', kunci: 'A' },
          { soal: 'Peristiwa hijrah terjadi pada tahun...', A: '610 M', B: '622 M', C: '632 M', D: '650 M', kunci: 'B' },
          { soal: 'Siapa khalifah pertama?', A: 'Umar', B: 'Utsman', C: 'Abu Bakar', D: 'Ali', kunci: 'C' },
          { soal: 'Perang Badar terjadi pada tahun...', A: '622 M', B: '624 M', C: '625 M', D: '627 M', kunci: 'B' },
          { soal: 'Sahabat yang dijuluki "As-Siddiq" adalah...', A: 'Umar', B: 'Abu Bakar', C: 'Utsman', D: 'Ali', kunci: 'B' },
          { soal: 'Fathu Makkah (Pembebasan Mekkah) terjadi tahun...', A: '628 M', B: '630 M', C: '632 M', D: '634 M', kunci: 'B' },
          { soal: 'Siapa panglima perang Islam yang terkenal?', A: 'Khalid bin Walid', B: 'Abu Sufyan', C: 'Abu Lahab', D: 'Abu Jahal', kunci: 'A' },
          { soal: 'Perang Uhud terjadi pada tahun...', A: '624 M', B: '625 M', C: '627 M', D: '630 M', kunci: 'B' },
          { soal: 'Masa kekhalifahan yang dikenal sebagai "Khulafaur Rasyidin" adalah...', A: '30 tahun', B: '40 tahun', C: '50 tahun', D: '60 tahun', kunci: 'A' },
          { soal: 'Sahabat yang dijuluki "Singa Allah" adalah...', A: 'Umar', B: 'Hamzah', C: 'Ali', D: 'Khalid', kunci: 'B' },
        ],
      },
      {
        id: 'fiqh',
        title: 'Fikih & Ibadah',
        icon: 'accessibility-outline',
        color: 'from-rose-500 to-rose-600',
        description: 'Pengetahuan tentang hukum Islam dan ibadah',
        questions: [
          { soal: 'Sholat wajib sehari semalam berapa rakaat?', A: '12', B: '15', C: '17', D: '20', kunci: 'C' },
          { soal: 'Apa rukun sholat yang pertama?', A: 'Ruku', B: 'Sujud', C: 'Niat', D: 'Salam', kunci: 'C' },
          { soal: 'Puasa Ramadhan hukumnya...', A: 'Sunnah', B: 'Wajib', C: 'Mubah', D: 'Haram', kunci: 'B' },
          { soal: 'Zakat fitrah dibayarkan pada bulan...', A: 'Syawal', B: 'Ramadhan', C: 'Dzulhijjah', D: 'Muharram', kunci: 'B' },
          { soal: 'Berapa persen zakat mal?', A: '1%', B: '2.5%', C: '5%', D: '10%', kunci: 'B' },
          { soal: 'Haji dilakukan di bulan...', A: 'Ramadhan', B: 'Syawal', C: 'Dzulhijjah', D: 'Muharram', kunci: 'C' },
          { soal: 'Apa yang membatalkan wudhu?', A: 'Makan', B: 'Tidur', C: 'Minum', D: 'Berjalan', kunci: 'B' },
          { soal: 'Sholat sunnah yang dilakukan sebelum subuh disebut...', A: 'Tahajud', B: 'Dhuha', C: 'Qabliyah Subuh', D: 'Tarawih', kunci: 'C' },
          { soal: 'Mandi wajib dilakukan setelah...', A: 'Makan', B: 'Tidur', C: 'Junub', D: 'Olahraga', kunci: 'C' },
          { soal: 'Sholat Jumat hukumnya...', A: 'Sunnah', B: 'Wajib bagi pria', C: 'Wajib bagi semua', D: 'Mubah', kunci: 'B' },
        ],
      },
      {
        id: 'akhlak',
        title: 'Akhlak & Adab',
        icon: 'heart-outline',
        color: 'from-cyan-500 to-cyan-600',
        description: 'Akhlak mulia dan adab dalam kehidupan sehari-hari',
        questions: [
          { soal: 'Rasulullah SAW diutus untuk menyempurnakan...', A: 'Ibadah', B: 'Akhlak', C: 'Ilmu', D: 'Harta', kunci: 'B' },
          { soal: 'Sebaik-baik manusia adalah yang paling...', A: 'Kaya', B: 'Tampan', C: 'Baik akhlaknya', D: 'Pintar', kunci: 'C' },
          { soal: 'Tersenyum dihadapan saudara adalah...', A: 'Sia-sia', B: 'Sedekah', C: 'Haram', D: 'Makruh', kunci: 'B' },
          { soal: 'Kepada siapakah kita harus berbakti pertama kali?', A: 'Ayah', B: 'Ibu', C: 'Kakek', D: 'Guru', kunci: 'B' },
          { soal: 'Ucapan salam yang sempurna adalah...', A: 'Assalamualaikum', B: 'Assalamualaikum wr wb', C: 'Salam', D: 'Hai', kunci: 'B' },
          { soal: 'Berkata jujur termasuk akhlak...', A: 'Tercela', B: 'Terpuji', C: 'Biasa', D: 'Netral', kunci: 'B' },
          { soal: 'Larangan gibah berarti dilarang...', A: 'Bergaul', B: 'Menggunjing', C: 'Bekerja', D: 'Bicara', kunci: 'B' },
          { soal: 'Siapa yang harus didahulukan dalam memberi salam?', A: 'Muda ke tua', B: 'Tua ke muda', C: 'Kaya ke miskin', D: 'Pintar ke bodoh', kunci: 'A' },
          { soal: 'Adab makan dalam Islam adalah...', A: 'Berdiri', B: 'Tangan kiri', C: 'Tangan kanan', D: 'Berjalan', kunci: 'C' },
          { soal: 'Salah satu akhlak tercela adalah...', A: 'Jujur', B: 'Dermawan', C: 'Sombong', D: 'Pemaaf', kunci: 'C' },
        ],
      },
    ];

    this.totalQuestions = this.categories.reduce((sum, c) => sum + c.questions.length, 0);
  }

  selectCategory(cat: QuizCategory) {
    this.currentCategory = cat;
    this.currentQuestionIndex = 0;
    this.touchedAnswers = {};
    this.answered = false;
    this.showResult = false;
    this.view = 'quiz';
  }

  backToCategories() {
    this.view = 'categories';
    this.currentCategory = null;
    this.currentQuestionIndex = 0;
    this.touchedAnswers = {};
    this.answered = false;
    this.showResult = false;
  }

  get currentQuestion(): any {
    if (!this.currentCategory) return null;
    return this.currentCategory.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    if (!this.currentCategory) return 0;
    return ((this.currentQuestionIndex) / this.currentCategory.questions.length) * 100;
  }

  getIcon(jawaban: string): string {
    if (this.touchedAnswers[jawaban] === 'correct') return 'checkmark-circle';
    if (this.touchedAnswers[jawaban] === 'wrong') return 'close-circle';
    return 'radio-button-off-outline';
  }

  async pilihJawaban(jawaban: string) {
    if (!this.currentCategory || this.answered) return;
    const q = this.currentQuestion;
    if (!q || this.touchedAnswers[jawaban]) return;

    const benar = jawaban === q.kunci;
    this.touchedAnswers[jawaban] = benar ? 'correct' : 'wrong';
    this.answered = true;

    if (benar) {
      this.totalScore++;
    }

    setTimeout(async () => {
      if (this.currentQuestionIndex < this.currentCategory!.questions.length - 1) {
        this.currentQuestionIndex++;
        this.touchedAnswers = {};
        this.answered = false;
      } else {
        this.showResult = true;
        const alert = await this.alertCtrl.create({
          header: '🎉 Selesai!',
          message: `Kamu menjawab benar ${this.totalScore} dari ${this.currentCategory!.questions.length} soal di kategori "${this.currentCategory!.title}"`,
          buttons: [{
            text: 'Kembali',
            handler: () => {
              this.backToCategories();
            }
          }]
        });
        await alert.present();
      }
    }, 800);
  }

  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1000);
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

  ngOnDestroy() {}
}
