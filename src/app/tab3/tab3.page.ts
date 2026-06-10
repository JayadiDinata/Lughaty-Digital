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
          { soal: 'أَهْلًا وَسَهْلًا', A: 'Selamat tinggal', B: 'Selamat datang', C: 'Selamat jalan', D: 'Sampai jumpa', kunci: 'B' },
          { soal: 'مَا اسْمُكَ', A: 'Apa kabar', B: 'Siapa namamu', C: 'Dari mana', D: 'Ke mana', kunci: 'B' },
          { soal: 'أَنَا مِنْ إِنْدُونِيسِيَا', A: 'Saya dari Malaysia', B: 'Saya dari Indonesia', C: 'Saya dari Mesir', D: 'Saya dari Arab', kunci: 'B' },
          { soal: 'قَلَم', A: 'Buku', B: 'Pulpen', C: 'Meja', D: 'Kursi', kunci: 'B' },
          { soal: 'بَاب', A: 'Jendela', B: 'Pintu', C: 'Dinding', D: 'Atap', kunci: 'B' },
          { soal: 'شَمْس', A: 'Bulan', B: 'Bintang', C: 'Matahari', D: 'Awan', kunci: 'C' },
          { soal: 'قَمَر', A: 'Matahari', B: 'Bulan', C: 'Bintang', D: 'Langit', kunci: 'B' },
          { soal: 'يَد', A: 'Kaki', B: 'Kepala', C: 'Tangan', D: 'Mata', kunci: 'C' },
          { soal: 'رَأْس', A: 'Tangan', B: 'Kaki', C: 'Kepala', D: 'Mata', kunci: 'C' },
          { soal: 'عَيْن', A: 'Telinga', B: 'Hidung', C: 'Mata', D: 'Mulut', kunci: 'C' },
          { soal: 'أُذُن', A: 'Mata', B: 'Telinga', C: 'Hidung', D: 'Mulut', kunci: 'B' },
          { soal: 'أَنْف', A: 'Telinga', B: 'Mata', C: 'Hidung', D: 'Mulut', kunci: 'C' },
          { soal: 'فَم', A: 'Hidung', B: 'Telinga', C: 'Mata', D: 'Mulut', kunci: 'D' },
          { soal: 'كَلْب', A: 'Kucing', B: 'Anjing', C: 'Kambing', D: 'Sapi', kunci: 'B' },
          { soal: 'قِطّ', A: 'Anjing', B: 'Kucing', C: 'Kelinci', D: 'Hamster', kunci: 'B' },
          { soal: 'حِصَان', A: 'Sapi', B: 'Kambing', C: 'Kuda', D: 'Unta', kunci: 'C' },
          { soal: 'زَهْرَة', A: 'Pohon', B: 'Bunga', C: 'Daun', D: 'Akar', kunci: 'B' },
          { soal: 'بَحْر', A: 'Sungai', B: 'Danau', C: 'Laut', D: 'Samudra', kunci: 'C' },
          { soal: 'جَبَل', A: 'Lembah', B: 'Gunung', C: 'Bukit', D: 'Sungai', kunci: 'B' },
          { soal: 'طَبِيب', A: 'Guru', B: 'Insinyur', C: 'Dokter', D: 'Polisi', kunci: 'C' },
          { soal: 'مُهَنْدِس', A: 'Dokter', B: 'Guru', C: 'Insinyur', D: 'Polisi', kunci: 'C' },
          { soal: 'مُدَرِّس', A: 'Dokter', B: 'Guru', C: 'Insinyur', D: 'Polisi', kunci: 'B' },
          { soal: 'طَالِب', A: 'Guru', B: 'Dokter', C: 'Siswa', D: 'Polisi', kunci: 'C' },
          { soal: 'مَلْعَب', A: 'Kantor', B: 'Sekolah', C: 'Lapangan', D: 'Rumah sakit', kunci: 'C' },
          { soal: 'مُسْتَشْفَى', A: 'Sekolah', B: 'Kantor', C: 'Masjid', D: 'Rumah sakit', kunci: 'D' },
          { soal: 'مَطْعَم', A: 'Kantor', B: 'Restoran', C: 'Sekolah', D: 'Masjid', kunci: 'B' },
          { soal: 'سُوق', A: 'Masjid', B: 'Kantor', C: 'Pasar', D: 'Sekolah', kunci: 'C' },
          { soal: 'سَيَّارَة', A: 'Motor', B: 'Mobil', C: 'Sepeda', D: 'Kereta', kunci: 'B' },
          { soal: 'طَائِرَة', A: 'Mobil', B: 'Kereta', C: 'Pesawat', D: 'Kapal', kunci: 'C' },
          { soal: 'لَوْن', A: 'Bentuk', B: 'Ukuran', C: 'Warna', D: 'Rasa', kunci: 'C' },
          { soal: 'أَحْمَر', A: 'Biru', B: 'Hijau', C: 'Merah', D: 'Kuning', kunci: 'C' },
          { soal: 'أَزْرَق', A: 'Merah', B: 'Biru', C: 'Hijau', D: 'Kuning', kunci: 'B' },
          { soal: 'أَخْضَر', A: 'Biru', B: 'Merah', C: 'Hijau', D: 'Kuning', kunci: 'C' },
          { soal: 'أَصْفَر', A: 'Merah', B: 'Hijau', C: 'Biru', D: 'Kuning', kunci: 'D' },
          { soal: 'أَبْيَض', A: 'Hitam', B: 'Putih', C: 'Abu-abu', D: 'Coklat', kunci: 'B' },
          { soal: 'أَسْوَد', A: 'Putih', B: 'Hitam', C: 'Abu-abu', D: 'Coklat', kunci: 'B' },
          { soal: 'وَقْت', A: 'Tempat', B: 'Waktu', C: 'Orang', D: 'Benda', kunci: 'B' },
          { soal: 'يَوْم', A: 'Malam', B: 'Minggu', C: 'Hari', D: 'Bulan', kunci: 'C' },
          { soal: 'لَيْلَة', A: 'Siang', B: 'Malam', C: 'Pagi', D: 'Sore', kunci: 'B' },
          { soal: 'لَبَن', A: 'Air', B: 'Jus', C: 'Susu', D: 'Teh', kunci: 'C' },
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
          { soal: 'Siapa nama malaikat peniup sangkakala?', A: 'Jibril', B: 'Mikail', C: 'Israfil', D: 'Izrail', kunci: 'C' },
          { soal: 'Apa nama malaikat pencabut nyawa?', A: 'Jibril', B: 'Mikail', C: 'Israfil', D: 'Izrail', kunci: 'D' },
          { soal: 'Siapa nabi yang menerima kitab Taurat?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Daud', D: 'Nabi Isa', kunci: 'B' },
          { soal: 'Siapa nabi yang menerima kitab Zabur?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Daud', D: 'Nabi Isa', kunci: 'C' },
          { soal: 'Siapa nabi yang menerima kitab Injil?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Daud', D: 'Nabi Isa', kunci: 'D' },
          { soal: 'Berapa jumlah nama Allah dalam Asmaul Husna?', A: '33', B: '66', C: '99', D: '100', kunci: 'C' },
          { soal: 'Apa arti "Ar-Rahman"?', A: 'Maha Penyayang', B: 'Maha Pengasih', C: 'Maha Adil', D: 'Maha Bijaksana', kunci: 'B' },
          { soal: 'Apa arti "Ar-Rahim"?', A: 'Maha Pengasih', B: 'Maha Penyayang', C: 'Maha Kuasa', D: 'Maha Mendengar', kunci: 'B' },
          { soal: 'Surah apa yang disebut "Ummul Quran"?', A: 'Al-Ikhlas', B: 'Al-Fatihah', C: 'An-Nas', D: 'Al-Falaq', kunci: 'B' },
          { soal: 'Berapa ayat dalam Surah Al-Fatihah?', A: '5', B: '6', C: '7', D: '8', kunci: 'C' },
          { soal: 'Apa nama ibadah haji ke tanah suci?', A: 'Umrah', B: 'Haji', C: 'Ziarah', D: 'Wisata religi', kunci: 'B' },
          { soal: 'Apa rukun Islam yang pertama?', A: 'Sholat', B: 'Puasa', C: 'Syahadat', D: 'Zakat', kunci: 'C' },
          { soal: 'Apa rukun Islam yang kedua?', A: 'Syahadat', B: 'Sholat', C: 'Puasa', D: 'Zakat', kunci: 'B' },
          { soal: 'Apa rukun Islam yang ketiga?', A: 'Sholat', B: 'Puasa', C: 'Zakat', D: 'Haji', kunci: 'C' },
          { soal: 'Apa rukun Islam yang kelima?', A: 'Syahadat', B: 'Sholat', C: 'Puasa', D: 'Haji', kunci: 'D' },
          { soal: 'Berapa jumlah malaikat yang wajib diketahui?', A: '5', B: '10', C: '15', D: '20', kunci: 'B' },
          { soal: 'Siapa nabi yang diberi mukjizat membelah laut?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Yusuf', D: 'Nabi Nuh', kunci: 'B' },
          { soal: 'Siapa nabi yang diberi mukjizat menghidupkan orang mati?', A: 'Nabi Musa', B: 'Nabi Ibrahim', C: 'Nabi Isa', D: 'Nabi Muhammad', kunci: 'C' },
          { soal: 'Peristiwa Isra Mi\'raj terjadi pada bulan?', A: 'Ramadhan', B: 'Rajab', C: 'Syaban', D: 'Syawal', kunci: 'B' },
          { soal: 'Apa nama kitab suci yang diturunkan kepada Nabi Muhammad?', A: 'Taurat', B: 'Zabur', C: 'Injil', D: 'Al-Quran', kunci: 'D' },
          { soal: 'Berapa juz dalam Al-Quran?', A: '20', B: '25', C: '30', D: '35', kunci: 'C' },
          { soal: 'Surah terpanjang dalam Al-Quran adalah?', A: 'Yasin', B: 'Al-Baqarah', C: 'Ali Imran', D: 'An-Nisa', kunci: 'B' },
          { soal: 'Sholat apa yang dilakukan saat matahari terbit?', A: 'Subuh', B: 'Dhuha', C: 'Dzuhur', D: 'Ashar', kunci: 'B' },
          { soal: 'Puasa sunnah apa yang dilakukan setiap hari Senin-Kamis?', A: 'Puasa Daud', B: 'Puasa Arafah', C: 'Puasa Senin-Kamis', D: 'Puasa Syawal', kunci: 'C' },
          { soal: 'Apa nama tempat ibadah umat Islam?', A: 'Gereja', B: 'Pura', C: 'Masjid', D: 'Vihara', kunci: 'C' },
          { soal: 'Siapa nama istri Nabi Muhammad yang pertama?', A: 'Aisyah', B: 'Khadijah', C: 'Hafsah', D: 'Saudah', kunci: 'B' },
          { soal: 'Siapa nama anak Nabi Muhammad yang lahir dari Khadijah?', A: 'Hasan', B: 'Husain', C: 'Fatimah', D: 'Abdullah', kunci: 'C' },
          { soal: 'Kota tempat Nabi Muhammad lahir?', A: 'Madinah', B: 'Mekkah', C: 'Thaif', D: 'Yatsrib', kunci: 'B' },
          { soal: 'Kota tempat Nabi Muhammad hijrah?', A: 'Mekkah', B: 'Thaif', C: 'Madinah', D: 'Kuds', kunci: 'C' },
          { soal: 'Apa nama tempat suci di Mekkah?', A: 'Masjid Nabawi', B: 'Masjidil Haram', C: 'Masjid Aqsa', D: 'Masjid Quba', kunci: 'B' },
          { soal: 'Thawaf adalah mengelilingi?', A: 'Bukit Shafa', B: 'Bukit Marwah', C: 'Ka\'bah', D: 'Sumur Zamzam', kunci: 'C' },
          { soal: 'Sa\'i adalah berlari antara?', A: 'Shafa dan Marwah', B: 'Arafah dan Muzdalifah', C: 'Mina dan Arafah', D: 'Ka\'bah dan Maqam Ibrahim', kunci: 'A' },
          { soal: 'Wukuf di Arafah dilakukan pada tanggal?', A: '8 Dzulhijjah', B: '9 Dzulhijjah', C: '10 Dzulhijjah', D: '11 Dzulhijjah', kunci: 'B' },
          { soal: 'Hari raya Idul Fitri jatuh pada tanggal?', A: '1 Syawal', B: '10 Dzulhijjah', C: '1 Muharram', D: '12 Rabiul Awal', kunci: 'A' },
          { soal: 'Hari raya Idul Adha jatuh pada tanggal?', A: '1 Syawal', B: '10 Dzulhijjah', C: '1 Muharram', D: '12 Rabiul Awal', kunci: 'B' },
          { soal: 'Bulan puasa Ramadhan adalah bulan ke berapa dalam Hijriyah?', A: '8', B: '9', C: '10', D: '11', kunci: 'B' },
          { soal: 'Lailatul Qadar lebih baik dari?', A: '100 bulan', B: '1000 bulan', C: '100 hari', D: '1000 hari', kunci: 'B' },
          { soal: 'Zakat fitrah dibayarkan berupa?', A: 'Uang', B: 'Emas', C: 'Makanan pokok', D: 'Pakaian', kunci: 'C' },
          { soal: 'Apa nama sholat sunnah di malam Ramadhan?', A: 'Tahajud', B: 'Tarawih', C: 'Dhuha', D: 'Hajat', kunci: 'B' },
          { soal: 'Asmaul Husna adalah nama-nama?', A: 'Nabi', B: 'Allah', C: 'Malaikat', D: 'Sahabat', kunci: 'B' },
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
          { soal: 'Siapa nabi yang mendapat gelar "Khatamul Anbiya"?', A: 'Nabi Ibrahim', B: 'Nabi Musa', C: 'Nabi Muhammad', D: 'Nabi Isa', kunci: 'C' },
          { soal: 'Apa yang harus dimiliki seorang dai?', A: 'Kekayaan', B: 'Ilmu', C: 'Kekuasaan', D: 'Keturunan', kunci: 'B' },
          { soal: 'Berdakwah dengan hikmah artinya...', A: 'Dengan kekerasan', B: 'Dengan kebijaksanaan', C: 'Dengan paksaan', D: 'Dengan harta', kunci: 'B' },
          { soal: 'Ayat Al-Quran yang pertama turun adalah...', A: 'Al-Fatihah', B: 'Al-Alaq 1-5', C: 'An-Nas', D: 'Al-Ikhlas', kunci: 'B' },
          { soal: 'Salah satu tujuan dakwah adalah...', A: 'Mencari kekayaan', B: 'Mengajak kepada kebaikan', C: 'Mencari popularitas', D: 'Berpolitik', kunci: 'B' },
          { soal: 'Dalam QS. An-Nahl ayat 125, Allah memerintahkan dakwah dengan cara...', A: 'Kekerasan', B: 'Hikmah', C: 'Paksaan', D: 'Tipu daya', kunci: 'B' },
          { soal: 'Yang bukan termasuk media dakwah adalah...', A: 'Ceramah', B: 'Tulisan', C: 'Kekerasan', D: 'Film', kunci: 'C' },
          { soal: 'Apa arti "Mubaligh"?', A: 'Pendengar', B: 'Orang yang berdakwah', C: 'Penulis', D: 'Pelajar', kunci: 'B' },
          { soal: 'Apa arti "Mad\'u"?', A: 'Orang yang berdakwah', B: 'Penerima dakwah', C: 'Tempat dakwah', D: 'Media dakwah', kunci: 'B' },
          { soal: 'Siapa yang disebut "Da\'i"?', A: 'Pendengar', B: 'Pelajar', C: 'Orang yang berdakwah', D: 'Penulis', kunci: 'C' },
          { soal: 'Dakwah bil hal artinya dakwah melalui...', A: 'Lisan', B: 'Tulisan', C: 'Perbuatan', D: 'Media', kunci: 'C' },
          { soal: 'Dakwah bil lisan artinya dakwah melalui...', A: 'Perbuatan', B: 'Lisan', C: 'Harta', D: 'Media', kunci: 'B' },
          { soal: 'Dakwah bil qalam artinya dakwah melalui...', A: 'Lisan', B: 'Perbuatan', C: 'Tulisan', D: 'Harta', kunci: 'C' },
          { soal: 'Siapakah dai pertama dalam Islam?', A: 'Abu Bakar', B: 'Nabi Muhammad', C: 'Ali', D: 'Bilal', kunci: 'B' },
          { soal: 'Media dakwah tertua adalah...', A: 'Radio', B: 'TV', C: 'Lisan', D: 'Internet', kunci: 'C' },
          { soal: 'Tablig artinya...', A: 'Pendidikan', B: 'Penyampaian', C: 'Pemahaman', D: 'Penerapan', kunci: 'B' },
          { soal: 'Siapa sahabat nabi yang ahli pidato?', A: 'Abu Bakar', B: 'Umar', C: 'Ali', D: 'Bilal', kunci: 'C' },
          { soal: 'Apa yang dimaksud dakwah "bi al-hikmah"?', A: 'Dengan kekerasan', B: 'Dengan cara bijaksana', C: 'Dengan paksaan', D: 'Dengan harta', kunci: 'B' },
          { soal: 'Ayat tentang toleransi beragama terdapat dalam QS...', A: 'Al-Kafirun', B: 'Al-Ikhlas', C: 'Al-Falaq', D: 'An-Nas', kunci: 'A' },
          { soal: 'Apa kewajiban seorang dai?', A: 'Menghakimi', B: 'Menyampaikan', C: 'Memaksa', D: 'Menghukum', kunci: 'B' },
          { soal: 'Penyiaran Islam di Indonesia dimulai oleh...', A: 'Wali Songo', B: 'Penjajah', C: 'Pedagang Cina', D: 'Bangsa Eropa', kunci: 'A' },
          { soal: 'Berapa jumlah Wali Songo?', A: '7', B: '8', C: '9', D: '10', kunci: 'C' },
          { soal: 'Wali Songo menyebarkan Islam melalui...', A: 'Perang', B: 'Budaya dan kesenian', C: 'Perdagangan', D: 'Pendudukan', kunci: 'B' },
          { soal: 'Sunan Kalijaga menggunakan media dakwah...', A: 'Wayang', B: 'Lagu', C: 'Tari', D: 'Lukis', kunci: 'A' },
          { soal: 'Tembang "Lir-ilir" diciptakan oleh...', A: 'Sunan Bonang', B: 'Sunan Kalijaga', C: 'Sunan Kudus', D: 'Sunan Muria', kunci: 'B' },
          { soal: 'Radio dakwah sering digunakan untuk...', A: 'Hiburan', B: 'Ceramah dan kajian', C: 'Berita', D: 'Musik', kunci: 'B' },
          { soal: 'TV dakwah menyiarkan program seperti...', A: 'Film', B: 'Komedi', C: 'Kajian Islam', D: 'Kuis', kunci: 'C' },
          { soal: 'Media sosial untuk dakwah contohnya...', A: 'Instagram', B: 'Semua benar', C: 'YouTube', D: 'Facebook', kunci: 'B' },
          { soal: 'Podcast dakwah semakin populer karena...', A: 'Mudah diakses', B: 'Membosankan', C: 'Mahal', D: 'Sulit', kunci: 'A' },
          { soal: 'Sifat seorang dai harus...', A: 'Sombong', B: 'Pemaaf dan sabar', C: 'Kasar', D: 'Cuek', kunci: 'B' },
          { soal: 'Hukum berdakwah bagi setiap muslim adalah...', A: 'Wajib sesuai kemampuan', B: 'Sunnah', C: 'Mubah', D: 'Haram', kunci: 'A' },
          { soal: 'Dakwah kepada non-muslim harus dengan...', A: 'Kekerasan', B: 'Kebijaksanaan', C: 'Paksaan', D: 'Ancaman', kunci: 'B' },
          { soal: 'Apa tujuan utama dakwah?', A: 'Mencari pengikut', B: 'Mengajak kepada kebaikan', C: 'Mencari harta', D: 'Mencari kekuasaan', kunci: 'B' },
          { soal: 'Materi dakwah harus berdasarkan...', A: 'Pendapat pribadi', B: 'Al-Quran dan Hadits', C: 'Tradisi', D: 'Budaya', kunci: 'B' },
          { soal: 'Pendengar dakwah disebut...', A: 'Da\'i', B: 'Mubaligh', C: 'Mad\'u', D: 'Khatib', kunci: 'C' },
          { soal: 'Orang yang menyampaikan khutbah disebut...', A: 'Da\'i', B: 'Mubaligh', C: 'Mad\'u', D: 'Khatib', kunci: 'D' },
          { soal: 'Apa yang dimaksud dakwah fardiyah?', A: 'Dakwah kelompok', B: 'Dakwah individu ke individu', C: 'Dakwah melalui TV', D: 'Dakwah melalui radio', kunci: 'B' },
          { soal: 'Salah satu tantangan dakwah di era digital adalah...', A: 'Banyaknya akses', B: 'Hoaks dan informasi palsu', C: 'Mudahnya komunikasi', D: 'Canggihnya teknologi', kunci: 'B' },
          { soal: 'Etika dakwah di media sosial adalah...', A: 'Bebas bicara', B: 'Santun dan bijaksana', C: 'Kasar', D: 'Memancing emosi', kunci: 'B' },
          { soal: 'Prinsip dakwah "mau\'izhah hasanah" artinya...', A: 'Nasihat yang baik', B: 'Paksaan', C: 'De bat', D: 'Kritik', kunci: 'A' },
          { soal: 'Dakwah kepada keluarga termasuk dakwah...', A: 'Fardiyah', B: 'Am mah', C: 'Khassah', D: 'Sirriyah', kunci: 'A' },
          { soal: 'Apa arti "uswah hasanah"?', A: 'Nasihat baik', B: 'Teladan yang baik', C: 'Perkataan baik', D: 'Tulisan baik', kunci: 'B' },
          { soal: 'Sikap yang harus dihindari dai adalah...', A: 'Sabat', B: 'Lemah lembut', C: 'Sombong', D: 'Pemaaf', kunci: 'C' },
          { soal: 'Rasulullah bersabda: Sampaikan dariku walau...', A: 'Banyak', B: 'Satu ayat', C: 'Panjang', D: 'Pendek', kunci: 'B' },
          { soal: 'Dakwah di kampus termasuk dakwah...', A: 'Fardiyah', B: 'Ammah (umum)', C: 'Sirriyah', D: 'Rahasia', kunci: 'B' },
          { soal: 'Apa media dakwah yang paling cepat saat ini?', A: 'Koran', B: 'Radio', C: 'Internet dan media sosial', D: 'TV', kunci: 'C' },
          { soal: 'Khatamul Anbiya artinya...', A: 'Nabi pertama', B: 'Penutup para nabi', C: 'Bapak para nabi', D: 'Saudara nabi', kunci: 'B' },
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
          { soal: 'Perang Khandaq (Ahzab) terjadi tahun...', A: '625 M', B: '627 M', C: '630 M', D: '632 M', kunci: 'B' },
          { soal: 'Siapa khalifah kedua?', A: 'Abu Bakar', B: 'Umar bin Khattab', C: 'Utsman', D: 'Ali', kunci: 'B' },
          { soal: 'Siapa khalifah ketiga?', A: 'Umar', B: 'Abu Bakar', C: 'Utsman bin Affan', D: 'Ali', kunci: 'C' },
          { soal: 'Siapa khalifah keempat?', A: 'Umar', B: 'Utsman', C: 'Abu Bakar', D: 'Ali bin Abi Thalib', kunci: 'D' },
          { soal: 'Perjanjian Hudaibiyah terjadi tahun...', A: '626 M', B: '628 M', C: '630 M', D: '632 M', kunci: 'B' },
          { soal: 'Tahun gajah (Amul Fil) terjadi pada tahun...', A: '570 M', B: '571 M', C: '572 M', D: '573 M', kunci: 'A' },
          { soal: 'Siapa raja yang menyerang Ka\'bah dengan pasukan gajah?', A: 'Namrud', B: 'Firaun', C: 'Abrahah', D: 'Qarun', kunci: 'C' },
          { soal: 'Nabi Muhammad SAW wafat pada tahun...', A: '630 M', B: '632 M', C: '634 M', D: '636 M', kunci: 'B' },
          { soal: 'Siapa istri Nabi Muhammad yang menikah setelah Khadijah wafat?', A: 'Aisyah', B: 'Saudah', C: 'Hafsah', D: 'Zainab', kunci: 'B' },
          { soal: 'Peristiwa Isra terjadi dari Masjidil Haram ke...', A: 'Masjid Nabawi', B: 'Masjidil Aqsa', C: 'Langit ke-7', D: 'Sidratul Muntaha', kunci: 'B' },
          { soal: 'Peristiwa Mi\'raj terjadi dari Masjidil Aqsa ke...', A: 'Mekkah', B: 'Madinah', C: 'Langit', D: 'Mesir', kunci: 'C' },
          { soal: 'Perang Tabuk terjadi pada tahun...', A: '628 M', B: '630 M', C: '632 M', D: '634 M', kunci: 'B' },
          { soal: 'Siapa sahabat yang mendapat julukan "Al-Faruq"?', A: 'Abu Bakar', B: 'Umar', C: 'Utsman', D: 'Ali', kunci: 'B' },
          { soal: 'Siapa sahabat yang mendapat julukan "Dzun Nurain"?', A: 'Abu Bakar', B: 'Umar', C: 'Utsman', D: 'Ali', kunci: 'C' },
          { soal: 'Siapa sahabat yang dijuluki "Abu Hurairah"?', A: 'Abdurrahman bin Auf', B: 'Abu Hurairah', C: 'Salman Al-Farisi', D: 'Bilal', kunci: 'B' },
          { soal: 'Siapa muadzin pertama dalam Islam?', A: 'Umar', B: 'Ali', C: 'Bilal', D: 'Zaid', kunci: 'C' },
          { soal: 'Ekspansi Islam ke Spanyol dipimpin oleh...', A: 'Khalid bin Walid', B: 'Thariq bin Ziyad', C: 'Salahuddin', D: 'Umar bin Abdul Aziz', kunci: 'B' },
          { soal: 'Perang Salib berlangsung selama...', A: '100 tahun', B: '200 tahun', C: '300 tahun', D: '400 tahun', kunci: 'B' },
          { soal: 'Salahuddin Al-Ayyubi terkenal karena...', A: 'Membebaskan Yerussalem', B: 'Menaklukkan Mesir', C: 'Menulis buku', D: 'Membangun masjid', kunci: 'A' },
          { soal: 'Dinasti Umayyah berpusat di...', A: 'Baghdad', B: 'Damaskus', C: 'Kairo', D: 'Madinah', kunci: 'B' },
          { soal: 'Dinasti Abbasiyah berpusat di...', A: 'Damaskus', B: 'Baghdad', C: 'Kairo', D: 'Madinah', kunci: 'B' },
          { soal: 'Dinasti Utsmaniyah (Turki) berpusat di...', A: 'Baghdad', B: 'Damaskus', C: 'Istanbul', D: 'Kairo', kunci: 'C' },
          { soal: 'Siapa pendiri Dinasti Umayyah?', A: 'Umar bin Abdul Aziz', B: 'Muawiyah bin Abi Sufyan', C: 'Yazid', D: 'Abdul Malik', kunci: 'B' },
          { soal: 'Siapa yang dijuluki "Umar bin Abdul Aziz"?', A: 'Khalifah pertama', B: 'Khalifah kelima Khulafaur Rasyidin', C: 'Pendiri Dinasti Umayyah', D: 'Penakluk Konstantinopel', kunci: 'B' },
          { soal: 'Konstantinopel ditaklukkan oleh...', A: 'Salahuddin', B: 'Muhammad Al-Fatih', C: 'Thariq bin Ziyad', D: 'Harun Ar-Rasyid', kunci: 'B' },
          { soal: 'Ilmuwan muslim terkenal di bidang kedokteran adalah...', A: 'Al-Khawarizmi', B: 'Ibnu Sina', C: 'Al-Farabi', D: 'Ibnu Rusyd', kunci: 'B' },
          { soal: 'Ilmuwan muslim penemu aljabar adalah...', A: 'Ibnu Sina', B: 'Al-Khawarizmi', C: 'Al-Farabi', D: 'Ibnu Rusyd', kunci: 'B' },
          { soal: 'Kerajaan Islam pertama di Indonesia adalah...', A: 'Demak', B: 'Samudra Pasai', C: 'Majapahit', D: 'Mataram', kunci: 'B' },
          { soal: 'Wali Songo berasal dari daerah...', A: 'Sumatera', B: 'Kalimantan', C: 'Sulawesi', D: 'Jawa', kunci: 'D' },
          { soal: 'Penyebaran Islam di Jawa dilakukan oleh...', A: 'Pedagang Arab', B: 'Wali Songo', C: 'Penjajah', D: 'Ulama India', kunci: 'B' },
          { soal: 'Kerajaan Demak didirikan oleh...', A: 'Sunan Kalijaga', B: 'Raden Patah', C: 'Sultan Agung', D: 'Patih Gajah Mada', kunci: 'B' },
          { soal: 'Sultan Agung adalah raja dari kerajaan...', A: 'Demak', B: 'Pajang', C: 'Mataram', D: 'Cirebon', kunci: 'C' },
          { soal: 'Peristiwa hijrah ke Habsyah terjadi pada tahun...', A: '610 M', B: '615 M', C: '622 M', D: '628 M', kunci: 'B' },
          { soal: 'Sahabat nabi yang pertama masuk Islam dari kalangan anak-anak adalah...', A: 'Abu Bakar', B: 'Ali', C: 'Zaid', D: 'Bilal', kunci: 'B' },
          { soal: 'Sahabat nabi yang pertama masuk Islam dari kalangan orang dewasa adalah...', A: 'Umar', B: 'Utsman', C: 'Abu Bakar', D: 'Ali', kunci: 'C' },
          { soal: 'Bai\'at Aqabah pertama melibatkan berapa orang?', A: '6', B: '12', C: '24', D: '73', kunci: 'B' },
          { soal: 'Sahabat yang mendapat gelar "Pedang Allah" adalah...', A: 'Khalid bin Walid', B: 'Hamzah', C: 'Ali', D: 'Zubair', kunci: 'A' },
          { soal: 'Kota Mekkah sebelumnya dikenal dengan nama...', A: 'Yatsrib', B: 'Bakkah', C: 'Madinah', D: 'Thaif', kunci: 'B' },
          { soal: 'Raja yang memeluk Islam dari Najasyi adalah raja...', A: 'Persia', B: 'Habsyah', C: 'Romawi', D: 'Mesir', kunci: 'B' },
          { soal: 'Muhammad Al-Fatih menaklukkan Konstantinopel pada tahun...', A: '1453 M', B: '1492 M', C: '1517 M', D: '1521 M', kunci: 'A' },
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
          { soal: 'Berapa rakaat sholat Subuh?', A: '2', B: '3', C: '4', D: '5', kunci: 'A' },
          { soal: 'Berapa rakaat sholat Dzuhur?', A: '2', B: '3', C: '4', D: '5', kunci: 'C' },
          { soal: 'Berapa rakaat sholat Ashar?', A: '2', B: '3', C: '4', D: '5', kunci: 'C' },
          { soal: 'Berapa rakaat sholat Maghrib?', A: '2', B: '3', C: '4', D: '5', kunci: 'B' },
          { soal: 'Berapa rakaat sholat Isya?', A: '2', B: '3', C: '4', D: '5', kunci: 'C' },
          { soal: 'Wudhu yang batal karena bersentuhan dengan...', A: 'Makanan', B: 'Minuman', C: 'Law jenis (bukan mahram)', D: 'Pakaian', kunci: 'C' },
          { soal: 'Tayammum adalah pengganti wudhu menggunakan...', A: 'Air', B: 'Debu', C: 'Pasir', D: 'Batu', kunci: 'B' },
          { soal: 'Sholat sunnah tahajud dilakukan pada...', A: 'Pagi hari', B: 'Sore hari', C: 'Sepertiga malam', D: 'Siang hari', kunci: 'C' },
          { soal: 'Puasa sunnah arafah dilakukan pada tanggal...', A: '8 Dzulhijjah', B: '9 Dzulhijjah', C: '10 Dzulhijjah', D: '11 Dzulhijjah', kunci: 'B' },
          { soal: 'Hukum sholat berjamaah adalah...', A: 'Wajib', B: 'Sunnah muakkad', C: 'Mubah', D: 'Haram', kunci: 'B' },
          { soal: 'Membaca Al-Quran dalam sholat hukumnya...', A: 'Sunnah', B: 'Wajib', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Sujud sahwi dilakukan karena...', A: 'Lupa rakaat', B: 'Baca salah', C: 'Lupa gerakan', D: 'Semua benar', kunci: 'D' },
          { soal: 'Hukum minum air zamzam adalah...', A: 'Haram', B: 'Makruh', C: 'Sunah', D: 'Mubah', kunci: 'C' },
          { soal: 'Kurban hukumnya...', A: 'Wajib', B: 'Sunah muakkad', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Aqiqah dilakukan untuk...', A: 'Orang sakit', B: 'Bayi baru lahir', C: 'Orang meninggal', D: 'Pengantin', kunci: 'B' },
          { soal: 'Sholat gerhana disebut...', A: 'Sholat Istisqa', B: 'Sholat Khusuf', C: 'Sholat Kusuf', D: 'Sholat Hajat', kunci: 'C' },
          { soal: 'Sholat minta hujan disebut...', A: 'Sholat Khusuf', B: 'Sholat Istisqa', C: 'Sholat Kusuf', D: 'Sholat Hajat', kunci: 'B' },
          { soal: 'Air yang suci dan mensucikan disebut air...', A: 'Mutlak', B: 'Mustakmal', C: 'Mutannajis', D: 'Musyammas', kunci: 'A' },
          { soal: 'Najis yang dimaafkan disebut...', A: 'Najis Mughallazhah', B: 'Najis Mukhaffafah', C: 'Najis Muta\'affin', D: 'Najis Ma\'fu', kunci: 'D' },
          { soal: 'Babi dan anjing termasuk najis...', A: 'Mukhaffafah', B: 'Mughallazhah', C: 'Mutawassitah', D: 'Ma\'fu', kunci: 'B' },
          { soal: 'Hukum menuntut ilmu bagi muslim adalah...', A: 'Sunnah', B: 'Wajib', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Sholat jenazah memiliki berapa takbir?', A: '2', B: '3', C: '4', D: '5', kunci: 'C' },
          { soal: 'Hukum menikah dalam Islam adalah...', A: 'Wajib', B: 'Sunah', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Apa syarat sah sholat?', A: 'Suci dari hadas', B: 'Menghadap kiblat', C: 'Menutup aurat', D: 'Semua benar', kunci: 'D' },
          { soal: 'Makmum masbuq adalah makmum yang...', A: 'Datang awal', B: 'Datang terlambat', C: 'Menjadi imam', D: 'Tidak sholat', kunci: 'B' },
          { soal: 'Batas aurat pria adalah...', A: 'Seluruh badan', B: 'Pusar sampai lutut', C: 'Dada sampai lutut', D: 'Bahu sampai lutut', kunci: 'B' },
          { soal: 'Batas aurat wanita dihadapan mahram adalah...', A: 'Seluruh badan', B: 'Muka dan telapak tangan', C: 'Pusar sampai lutut', D: 'Bebas', kunci: 'C' },
          { soal: 'Batas aurat wanita dihadapan non-mahram adalah...', A: 'Seluruh badan kecuali muka dan telapak tangan', B: 'Pusar sampai lutut', C: 'Bebas', D: 'Muka saja', kunci: 'A' },
          { soal: 'Sholat rawatib adalah sholat...', A: 'Wajib', B: 'Sunnah pengiring sholat fardhu', C: 'Sunnah mutlak', D: 'Fardhu kifayah', kunci: 'B' },
          { soal: 'Sholat sunnah 2 rakaat sebelum dzuhur disebut...', A: 'Qabliyah Dzuhur', B: 'Ba\'diyah Dzuhur', C: 'Tahiyatul Masjid', D: 'Dhuha', kunci: 'A' },
          { soal: 'Sholat sunnah 2 rakaat setelah maghrib disebut...', A: 'Qabliyah Maghrib', B: 'Ba\'diyah Maghrib', C: 'Awwabin', D: 'Tarawih', kunci: 'B' },
          { soal: 'Puasa yang diharamkan di hari raya adalah...', A: 'Puasa Senin', B: 'Puasa Syawal', C: 'Puasa Idul Fitri dan Idul Adha', D: 'Puasa Arafah', kunci: 'C' },
          { soal: 'Hukum riba dalam Islam adalah...', A: 'Halal', B: 'Makruh', C: 'Haram', D: 'Mubah', kunci: 'C' },
          { soal: 'Makanan halal adalah makanan yang...', A: 'Enak', B: 'Mahal', C: 'Diizinkan agama', D: 'Impor', kunci: 'C' },
          { soal: 'Binatang yang disembelih dengan menyebut nama...', A: 'Sendiri', B: 'Allah', C: 'Berhala', D: 'Leluhur', kunci: 'B' },
          { soal: 'Hadats kecil dibersihkan dengan...', A: 'Mandi', B: 'Tayammum', C: 'Wudhu', D: 'Istinja', kunci: 'C' },
          { soal: 'Hadats besar dibersihkan dengan...', A: 'Wudhu', B: 'Tayammum', C: 'Mandi wajib', D: 'Istinja', kunci: 'C' },
          { soal: 'Sholat witir dilakukan setelah...', A: 'Subuh', B: 'Dzuhur', C: 'Isya', D: 'Maghrib', kunci: 'C' },
          { soal: 'Jumlah maksimal rakaat sholat witir adalah...', A: '3', B: '5', C: '7', D: 'Semua benar', kunci: 'D' },
          { soal: 'Sujud tilawah dilakukan saat...', A: 'Sholat', B: 'Mendengar ayat sajdah', C: 'Setiap sholat', D: 'Berdoa', kunci: 'B' },
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
          { soal: 'Riya\' termasuk akhlak...', A: 'Terpuji', B: 'Tercela', C: 'Biasa', D: 'Wajar', kunci: 'B' },
          { soal: 'Riya\' artinya...', A: 'Ikhlas', B: 'Pamer', C: 'Jujur', D: 'Sabar', kunci: 'B' },
          { soal: 'Hasad artinya...', A: 'Percaya diri', B: 'Iri hati', C: 'Dermawan', D: 'Pemaaf', kunci: 'B' },
          { soal: 'Ta\'awun artinya...', A: 'Bermusuhan', B: 'Tolong-menolong', C: 'Berdebat', D: 'Berpisah', kunci: 'B' },
          { soal: 'Sifat pemaaf termasuk akhlak...', A: 'Tercela', B: 'Terpuji', C: 'Biasa', D: 'Netral', kunci: 'B' },
          { soal: 'Adab masuk rumah adalah...', A: 'Langsung masuk', B: 'Mengucapkan salam', C: 'Mengetuk pintu', D: 'Teriak', kunci: 'B' },
          { soal: 'Adab bersin adalah mengucapkan...', A: 'Alhamdulillah', B: 'Subhanallah', C: 'Allahu Akbar', D: 'Astaghfirullah', kunci: 'A' },
          { soal: 'Jawaban orang yang bersin adalah...', A: 'Alhamdulillah', B: 'Yarhamukallah', C: 'Subhanallah', D: 'MasyaAllah', kunci: 'B' },
          { soal: 'Adab berbicara adalah...', A: 'Keras dan kasar', B: 'Lemah lembut', C: 'Berteriak', D: 'Memotong pembicaraan', kunci: 'B' },
          { soal: 'Birrul walidain artinya...', A: 'Durhaka pada orang tua', B: 'Berbakti pada orang tua', C: 'Meninggalkan orang tua', D: 'Mengabaikan orang tua', kunci: 'B' },
          { soal: 'Uququl walidain artinya...', A: 'Berbakti', B: 'Durhaka', C: 'Menyayangi', D: 'Menghormati', kunci: 'B' },
          { soal: 'Hukuman bagi pezina yang belum menikah adalah...', A: 'Raja', B: 'Cambuk 100 kali', C: 'Denda', D: 'Peringatan', kunci: 'B' },
          { soal: 'Mencuri dalam Islam hukumnya...', A: 'Halal', B: 'Haram', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Minum khamr (minuman keras) hukumnya...', A: 'Halal', B: 'Makruh', C: 'Haram', D: 'Mubah', kunci: 'C' },
          { soal: 'Adab bertetangga dalam Islam adalah...', A: 'Mengganggu', B: 'Saling menghormati', C: 'Acuh tak acuh', D: 'Bermusuhan', kunci: 'B' },
          { soal: 'Hak tetangga dalam Islam adalah...', A: 'Tidak ada', B: 'Diberi gangguan', C: 'Dihormati dan diperhatikan', D: 'Diabaikan', kunci: 'C' },
          { soal: 'Sikap terhadap fakir miskin adalah...', A: 'Menghina', B: 'Membantu dan menyantuni', C: 'Mengabaikan', D: 'Menjauhi', kunci: 'B' },
          { soal: 'Anak yatim harus...', A: 'Diabaikan', B: 'Disantuni dan dimuliakan', C: 'Diejek', D: 'Dijauhi', kunci: 'B' },
          { soal: 'Bohong termasuk akhlak...', A: 'Terpuji', B: 'Tercela', C: 'Biasa', D: 'Netral', kunci: 'B' },
          { soal: 'Amanah artinya...', A: 'Khianat', B: 'Dapat dipercaya', C: 'Bohong', D: 'Curang', kunci: 'B' },
          { soal: 'Khianat artinya...', A: 'Jujur', B: 'Dapat dipercaya', C: 'Berkhianat/curang', D: 'Amanah', kunci: 'C' },
          { soal: 'Sabar berarti...', A: 'Mengeluh', B: 'Bertahan dalam kebaikan', C: 'Putus asa', D: 'Marah', kunci: 'B' },
          { soal: 'Syukur artinya...', A: 'Mengeluh', B: 'Berterima kasih pada Allah', C: 'Marah', D: 'Kecewa', kunci: 'B' },
          { soal: 'Tawadhu\' artinya...', A: 'Sombong', B: 'Rendah hati', C: 'Pamer', D: 'Angkuh', kunci: 'B' },
          { soal: 'Takabur artinya...', A: 'Rendah hati', B: 'Sombong', C: 'Sabar', D: 'Ikhlas', kunci: 'B' },
          { soal: 'Husnudzon artinya...', A: 'Buruk sangka', B: 'Baik sangka', C: 'Curiga', D: 'Benci', kunci: 'B' },
          { soal: 'Su\'udzon artinya...', A: 'Baik sangka', B: 'Buruk sangka', C: 'Percaya', D: 'Sabar', kunci: 'B' },
          { soal: 'Silaturahmi artinya...', A: 'Memutus hubungan', B: 'Menjalin persaudaraan', C: 'Bermusuhan', D: 'Acuh tak acuh', kunci: 'B' },
          { soal: 'Keutamaan silaturahmi adalah...', A: 'Menyengsakan', B: 'Memperpanjang umur', C: 'Memiskinkan', D: 'Menyusahkan', kunci: 'B' },
          { soal: 'Adab terhadap guru adalah...', A: 'Melawan', B: 'Menghormati', C: 'Membantah', D: 'Mengejek', kunci: 'B' },
          { soal: 'Tholabul ilmi artinya...', A: 'Mencari harta', B: 'Mencari ilmu', C: 'Mencari jabatan', D: 'Mencari popularitas', kunci: 'B' },
          { soal: 'Keutamaan orang berilmu adalah...', A: 'Dihina', B: 'Diangkat derajatnya', C: 'Direndahkan', D: 'Ditinggalkan', kunci: 'B' },
          { soal: 'Menutup aurat hukumnya...', A: 'Sunnah', B: 'Wajib', C: 'Mubah', D: 'Makruh', kunci: 'B' },
          { soal: 'Adab membaca Al-Quran adalah...', A: 'Sambil makan', B: 'Dalam keadaan suci', C: 'Sambil tiduran', D: 'Sambil bicara', kunci: 'B' },
          { soal: 'Istiqomah artinya...', A: 'Berubah-ubah', B: 'Konsisten dalam kebaikan', C: 'Malas', D: 'Putus asa', kunci: 'B' },
          { soal: 'Malu termasuk bagian dari...', A: 'Kelemahan', B: 'Iman', C: 'Kekufuran', D: 'Kemunafikan', kunci: 'B' },
          { soal: 'Rasulullah bersabda: "Sebaik-baik kalian adalah yang terbaik...', A: 'Hartanya', B: 'Akhlaknya', C: 'Keturunannya', D: 'Rupanya', kunci: 'B' },
          { soal: 'Dendam termasuk akhlak...', A: 'Terpuji', B: 'Tercela', C: 'Baik', D: 'Mulia', kunci: 'B' },
          { soal: 'Ikhlas artinya melakukan ibadah karena...', A: 'Manusia', B: 'Allah semata', C: 'Pujian', D: 'Gaji', kunci: 'B' },
          { soal: 'Panggilan sayang kepada orang tua adalah...', A: 'Hai', B: 'Wahai', C: 'Ya Abi/Ya Ummi', D: 'Hei', kunci: 'C' },
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
          header: 'Selesai!',
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
