import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  query = '';
  results: any[] = [];
  searched = false;

  private data = [
    { title: 'Al-Istima\' - Mendengar', desc: 'Belajar mendengar bahasa Arab dan materi dakwah', icon: 'headset-outline', route: '/tabs/tab1' },
    { title: 'Al-Kalam - Berbicara', desc: 'Latihan berbicara untuk dakwah dan komunikasi Islam', icon: 'chatbubbles-outline', route: '/tabs/tab2' },
    { title: 'Kuis Penyiaran Islam', desc: 'Uji pengetahuan tentang penyiaran dan dakwah Islam', icon: 'help-circle-outline', route: '/tabs/tab3' },
    { title: 'Al-Kitabah - Menulis', desc: 'Belajar menulis Arab dan konten dakwah', icon: 'create-outline', route: '/tabs/tab4' },
    { title: 'Islamic Education', desc: 'Video edukasi Islam dari Media Islam Jakarta', icon: 'school-outline', route: '/islamic-education' },
    { title: 'Sejarah Islam', desc: 'Jelajahi sejarah Islam dari masa ke masa', icon: 'time-outline', route: '/islamic-history' },
    { title: 'Sunnah & Hadits', desc: 'Kumpulan hadits dan sunnah Rasulullah', icon: 'bookmarks-outline', route: '/sunnah-hadith' },
    { title: 'Dakwah Digital', desc: 'Strategi dan media dakwah di era digital', icon: 'megaphone-outline' },
    { title: 'Penyiaran Islam', desc: 'Dasar-dasar penyiaran dan komunikasi Islam', icon: 'radio-outline' },
    { title: 'Fiqih Dakwah', desc: 'Hukum dan aturan dalam berdakwah', icon: 'scale-outline' },
    { title: 'Media Komunikasi Islam', desc: 'Media massa dan new media dalam perspektif Islam', icon: 'newspaper-outline' },
    { title: 'Etika Komunikasi Islami', desc: 'Adab dan etika berkomunikasi menurut Al-Quran dan Sunnah', icon: 'chatbubbles-outline' },
    { title: 'Retorika Dakwah', desc: 'Seni berbicara dan menyampaikan pesan dakwah', icon: 'mic-outline' },
    { title: 'Manajemen Penyiaran', desc: 'Pengelolaan stasiun radio dan televisi Islam', icon: 'settings-outline' },
    { title: 'Jurnalisme Islam', desc: 'Dasar-dasar jurnalistik dalam perspektif Islam', icon: 'pencil-outline' },
  ];

  constructor(
    public theme: ThemeService,
    private router: Router,
  ) {}

  search() {
    this.searched = true;
    const q = this.query.toLowerCase().trim();
    if (!q) { this.results = []; return; }
    this.results = this.data.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
  }

  goTo(item: any) {
    if (item.route) this.router.navigateByUrl(item.route);
  }

  get darkModeIcon() { return this.theme.isDark ? 'sunny-outline' : 'moon-outline'; }
  toggleDarkMode() { this.theme.toggle(); }
}
