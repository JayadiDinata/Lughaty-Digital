import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Router } from '@angular/router';

interface SearchItem {
  title: string;
  desc: string;
  icon: string;
  type: 'app' | 'youtube' | 'post' | 'mosque';
  route?: string;
  url?: string;
  address?: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  query = '';
  results: SearchItem[] = [];
  searched = false;
  activeFilter: 'all' | 'app' | 'youtube' | 'post' | 'mosque' = 'all';

  private appData: SearchItem[] = [
    { title: 'Al-Istima\' - Mendengar', desc: 'Belajar mendengar bahasa Arab dan materi dakwah', icon: 'headset-outline', route: '/tabs/tab1', type: 'app' },
    { title: 'Al-Kalam - Berbicara', desc: 'Latihan berbicara untuk dakwah dan komunikasi Islam', icon: 'chatbubbles-outline', route: '/tabs/tab2', type: 'app' },
    { title: 'Kuis Penyiaran Islam', desc: 'Uji pengetahuan tentang penyiaran dan dakwah Islam', icon: 'help-circle-outline', route: '/tabs/tab3', type: 'app' },
    { title: 'Al-Kitabah - Menulis', desc: 'Belajar menulis Arab dan konten dakwah', icon: 'create-outline', route: '/tabs/tab4', type: 'app' },
    { title: 'Islamic Education', desc: 'Video edukasi Islam dari Media Islam Jakarta', icon: 'school-outline', route: '/islamic-education', type: 'app' },
    { title: 'Sejarah Islam', desc: 'Jelajahi sejarah Islam dari masa ke masa', icon: 'time-outline', route: '/islamic-history', type: 'app' },
    { title: 'Sunnah & Hadits', desc: 'Kumpulan hadits dan sunnah Rasulullah', icon: 'bookmarks-outline', route: '/sunnah-hadith', type: 'app' },
    { title: 'Dakwah Digital', desc: 'Strategi dan media dakwah di era digital', icon: 'megaphone-outline', type: 'app' },
    { title: 'Penyiaran Islam', desc: 'Dasar-dasar penyiaran dan komunikasi Islam', icon: 'radio-outline', type: 'app' },
    { title: 'Fiqih Dakwah', desc: 'Hukum dan aturan dalam berdakwah', icon: 'scale-outline', type: 'app' },
    { title: 'Media Komunikasi Islam', desc: 'Media massa dan new media dalam perspektif Islam', icon: 'newspaper-outline', type: 'app' },
    { title: 'Etika Komunikasi Islami', desc: 'Adab dan etika berkomunikasi menurut Al-Quran dan Sunnah', icon: 'chatbubbles-outline', type: 'app' },
    { title: 'Retorika Dakwah', desc: 'Seni berbicara dan menyampaikan pesan dakwah', icon: 'mic-outline', type: 'app' },
    { title: 'Manajemen Penyiaran', desc: 'Pengelolaan stasiun radio dan televisi Islam', icon: 'settings-outline', type: 'app' },
    { title: 'Jurnalisme Islam', desc: 'Dasar-dasar jurnalistik dalam perspektif Islam', icon: 'pencil-outline', type: 'app' },
  ];

  private youtubeData: SearchItem[] = [
    { title: 'Kajian Tauhid - Ustadz Abdul Somad', desc: 'Serial kajian akidah dan tauhid oleh UAS', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Tafsir Al-Quran Kontemporer', desc: 'Penjelasan ayat-ayat Al-Quran dengan pendekatan kontemporer', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Sirah Nabawiyah - Kisah Nabi Muhammad', desc: 'Sejarah lengkap kehidupan Rasulullah SAW', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Fiqih Ibadah Lengkap', desc: 'Pembahasan fiqih ibadah sehari-hari', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Dakwah di Era Digital', desc: 'Strategi dakwah menggunakan media sosial dan teknologi', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Kisah Para Nabi', desc: 'Cerita dan pelajaran dari kehidupan para nabi', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Adab dan Akhlak Muslim', desc: 'Pendidikan karakter dan akhlak mulia dalam Islam', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Kajian Ramadhan', desc: 'Ceramah spesial bulan suci Ramadhan', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Pernikahan dalam Islam', desc: 'Panduan pernikahan sesuai syariat Islam', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Muamalah dan Ekonomi Islam', desc: 'Transaksi dan ekonomi berdasarkan prinsip syariah', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Doa dan Dzikir Harian', desc: 'Kumpulan doa dan dzikir untuk aktivitas sehari-hari', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Kisah Sahabat Nabi', desc: 'Perjalanan hidup para sahabat Rasulullah SAW', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Tanya Jawab Agama', desc: 'Sesi tanya jawab seputar masalah keagamaan', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Tadabbur Alam', desc: 'Merenungkan kebesaran Allah melalui ciptaan-Nya', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Keluarga Sakinah', desc: 'Membangun rumah tangga islami yang harmonis', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Akhlak Kepada Orang Tua', desc: 'Cara berbakti dan menghormati kedua orang tua', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Keutamaan Sholat Tepat Waktu', desc: 'Pentingnya menjaga sholat di awal waktu', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Hikmah Puasa Sunnah', desc: 'Manfaat dan keutamaan menjalankan puasa sunnah', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Mukjizat Al-Quran', desc: 'Kemukjizatan Al-Quran dari segi ilmu pengetahuan', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
    { title: 'Ceramah Ustadz Hanan Attaki', desc: 'Kajian pemuda oleh Ustadz Hanan Attaki', icon: 'logo-youtube', url: 'https://youtube.com/@MediaIslamJakarta', type: 'youtube' },
  ];

  private postData: SearchItem[] = [
    { title: 'Keutamaan Sholat Subuh', desc: 'Sholat Subuh adalah salah satu sholat wajib yang memiliki keutamaan besar. Rasulullah SAW bersabda: Barangsiapa sholat Subuh, maka ia berada dalam jaminan Allah.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Pentingnya Ilmu dalam Islam', desc: 'Menuntut ilmu adalah kewajiban bagi setiap muslim. Allah akan mengangkat derajat orang-orang yang berilmu beberapa derajat.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Adab Berdoa Menurut Sunnah', desc: 'Berdoa dengan adab yang benar: menghadap kiblat, mengangkat tangan, suara lirih, dan yakin akan dikabulkan Allah.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Peringatan Isra Mi\'raj', desc: 'Peristiwa Isra Mi\'raj adalah perjalanan suci Nabi Muhammad dari Masjidil Haram ke Masjidil Aqsa dan naik ke Sidratul Muntaha.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Zakat: Membersihkan Harta', desc: 'Zakat adalah rukun Islam ketiga. Zakat membersihkan harta dan jiwa dari sifat kikir dan cinta dunia.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Puasa dan Kesehatan', desc: 'Puasa tidak hanya ibadah tetapi juga memiliki banyak manfaat kesehatan: detoksifikasi, meningkatkan metabolisme, dan memperbaiki sel tubuh.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Haji: Panggilan Suci', desc: 'Ibadah haji adalah rukun Islam kelima. Setiap muslim yang mampu wajib melaksanakan haji sekali seumur hidup.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Sabar dalam Menghadapi Ujian', desc: 'Allah tidak akan menguji hamba-Nya di luar batas kemampuannya. Sabar adalah kunci menghadapi setiap ujian.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Silaturahmi dalam Islam', desc: 'Silaturahmi adalah amalan yang dapat memperpanjang umur dan memperluas rezeki. Rasulullah sangat menganjurkan silaturahmi.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Hakikat Tawakal', desc: 'Tawakal adalah berserah diri kepada Allah setelah berusaha maksimal. Tawakal bukan berarti pasrah tanpa usaha.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Keistimewaan Bulan Ramadhan', desc: 'Bulan Ramadhan adalah bulan penuh berkah. Di dalamnya ada Lailatul Qadar yang lebih baik dari 1000 bulan.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Pendidikan Anak dalam Islam', desc: 'Mendidik anak dengan nilai-nilai Islam adalah tanggung jawab orang tua. Anak adalah amanah yang akan dimintai pertanggungjawaban.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Menjaga Lisan', desc: 'Lisan bisa menjadi sumber pahala dan bisa menjadi sumber dosa. Rasulullah bersabda: Barangsiapa beriman kepada Allah, berkatalah yang baik atau diam.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Dakwah Bil Hal', desc: 'Dakwah tidak hanya dengan lisan tetapi juga dengan perbuatan nyata. Contoh nyata lebih efektif daripada seribu kata.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Kisah Teladan Wali Songo', desc: 'Wali Songo menyebarkan Islam di Jawa dengan pendekatan budaya dan kesenian yang bijaksana sehingga Islam diterima dengan damai.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Tafsir Surah Al-Fatihah', desc: 'Al-Fatihah adalah ummul Quran. Setiap ayatnya mengandung makna yang dalam tentang hubungan hamba dengan Tuhannya.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Keutamaan Membaca Al-Quran', desc: 'Membaca Al-Quran mendapat pahala setiap hurufnya. Al-Quran akan menjadi syafaat bagi pembacanya di hari kiamat.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Hukum Musik dalam Islam', desc: 'Para ulama berbeda pendapat tentang hukum musik. Yang jelas, musik yang membawa kepada kemaksiatan adalah haram.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Pakaian Muslim dan Muslimah', desc: 'Menutup aurat adalah kewajiban bagi muslim dan muslimah. Pakaian harus longgar, tidak transparan, dan tidak menyerupai lawan jenis.', icon: 'newspaper-outline', type: 'post' },
    { title: 'Toleransi dalam Islam', desc: 'Islam mengajarkan toleransi dengan pemeluk agama lain. Tidak ada paksaan dalam beragama.', icon: 'newspaper-outline', type: 'post' },
  ];

  private mosqueData: SearchItem[] = [
    { title: 'Masjid Istiqlal', desc: 'Masjid nasional Indonesia, terbesar di Asia Tenggara', icon: 'location-outline', address: 'Jl. Taman Wijaya Kusuma, Ps. Baru, Jakarta Pusat', type: 'mosque' },
    { title: 'Masjid Raya Baiturrahman', desc: 'Masjid kebanggaan masyarakat Aceh', icon: 'location-outline', address: 'Jl. Moh. Jam, Kp. Baru, Baiturrahman, Banda Aceh', type: 'mosque' },
    { title: 'Masjid Raya Sumatera Barat', desc: 'Masjid megah dengan arsitektur Minangkabau modern', icon: 'location-outline', address: 'Jl. Chatib Sulaiman, Ulak Karang, Padang', type: 'mosque' },
    { title: 'Masjid Dian Al-Mahri', desc: 'Masjid berkubah emas di Depok', icon: 'location-outline', address: 'Jl. Raya Meruyung, Limo, Depok', type: 'mosque' },
    { title: 'Masjid Al-Aqsha (Pancoran)', desc: 'Masjid bersejarah di kawasan Pancoran, Jakarta', icon: 'location-outline', address: 'Jl. Pancoran Barat, Pancoran, Jakarta Selatan', type: 'mosque' },
    { title: 'Masjid Al-Markaz Al-Islami', desc: 'Pusat kegiatan Islam di Makassar', icon: 'location-outline', address: 'Jl. Masjid Raya No. 1, Maricaya, Makassar', type: 'mosque' },
    { title: 'Masjid Agung Demak', desc: 'Masjid bersejarah peninggalan Wali Songo', icon: 'location-outline', address: 'Jl. Masjid Agung, Bintoro, Demak', type: 'mosque' },
    { title: 'Masjid Sunan Ampel', desc: 'Masjid bersejarah di Surabaya peninggalan Sunan Ampel', icon: 'location-outline', address: 'Jl. Ampel Masjid, Ampel, Surabaya', type: 'mosque' },
    { title: 'Masjid Raya Bandung', desc: 'Masjid kebanggaan masyarakat Jawa Barat', icon: 'location-outline', address: 'Jl. Dalem Kaum No. 14, Balonggede, Bandung', type: 'mosque' },
    { title: 'Masjid Gede Kauman', desc: 'Masjid bersejarah di Yogyakarta dekat Keraton', icon: 'location-outline', address: 'Jl. Kauman, Ngupasan, Yogyakarta', type: 'mosque' },
    { title: 'Masjid Al-Azhar', desc: 'Masjid megah di kawasan Kemang, Jakarta', icon: 'location-outline', address: 'Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan', type: 'mosque' },
    { title: 'Masjid At-Tin', desc: 'Masjid indah di kawasan TMII, Jakarta Timur', icon: 'location-outline', address: 'Jl. Taman Mini Indonesia Indah, Jakarta Timur', type: 'mosque' },
    { title: 'Masjid Baitussalam', desc: 'Masjid di kompleks perumahan modern Bandung', icon: 'location-outline', address: 'Jl. Baitussalam, Bandung', type: 'mosque' },
    { title: 'Masjid Raya Al-Mashun', desc: 'Masjid bersejarah di Medan', icon: 'location-outline', address: 'Jl. Sisingamangaraja, Medan', type: 'mosque' },
    { title: 'Masjid Islamic Center Samarinda', desc: 'Masjid terbesar di Kalimantan', icon: 'location-outline', address: 'Jl. H.A.M. Ardans, Samarinda', type: 'mosque' },
  ];

  constructor(
    public theme: ThemeService,
    private router: Router,
  ) {}

  get allData(): SearchItem[] {
    return [...this.appData, ...this.youtubeData, ...this.postData, ...this.mosqueData];
  }

  iconBg(type: string): string {
    const map: Record<string, string> = {
      youtube: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      post: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      mosque: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      app: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    };
    return map[type] || map['app'];
  }

  badgeStyle(type: string): string {
    const map: Record<string, string> = {
      youtube: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      post: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      mosque: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      app: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    };
    return map[type] || map['app'];
  }

  badgeLabel(type: string): string {
    return type === 'youtube' ? 'YouTube' : type === 'post' ? 'Postingan' : type === 'mosque' ? 'Masjid' : 'Aplikasi';
  }

  setFilter(f: 'all' | 'app' | 'youtube' | 'post' | 'mosque') {
    this.activeFilter = f;
    if (this.searched) this.search();
  }

  search() {
    this.searched = true;
    const q = this.query.toLowerCase().trim();
    if (!q) { this.results = []; return; }

    let source: SearchItem[];
    if (this.activeFilter === 'all') source = this.allData;
    else if (this.activeFilter === 'app') source = this.appData;
    else if (this.activeFilter === 'youtube') source = this.youtubeData;
    else if (this.activeFilter === 'post') source = this.postData;
    else source = this.mosqueData;

    this.results = source.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      (item.address && item.address.toLowerCase().includes(q))
    );
  }

  goTo(item: SearchItem) {
    if (item.type === 'youtube' && item.url) {
      window.open(item.url, '_system');
    } else if (item.type === 'mosque' && item.address) {
      const encoded = encodeURIComponent(item.title + ', ' + item.address);
      window.open(`https://www.google.com/maps/search/${encoded}`, '_system');
    } else if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }

  cariMasjidTerdekat() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        window.open(`https://www.google.com/maps/search/masjid+terdekat/@${latitude},${longitude},15z`, '_system');
      }, () => {
        window.open('https://www.google.com/maps/search/masjid+terdekat/', '_system');
      });
    } else {
      window.open('https://www.google.com/maps/search/masjid+terdekat/', '_system');
    }
  }

  get darkModeIcon() { return this.theme.isDark ? 'sunny-outline' : 'moon-outline'; }
  toggleDarkMode() { this.theme.toggle(); }
}
