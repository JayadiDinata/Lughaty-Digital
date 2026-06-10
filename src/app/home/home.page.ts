import { Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  @ViewChild(IonMenu) menu: IonMenu;
  userCount: number = 0;

  constructor(
    public supabase: SupabaseService,
    public theme: ThemeService,
    private router: Router,
  ) {
    this.loadUserCount();
  }

  private async loadUserCount() {
    try {
      this.userCount = await this.supabase.countUsers();
    } catch {
      this.userCount = 0;
    }
  }

  menus = [
    { title: 'Al-Istima\'', icon: 'headset-outline', route: '/tabs/tab1' },
    { title: 'Al-Kalam', icon: 'chatbubbles-outline', route: '/tabs/tab2' },
    { title: 'Kuis Islam', icon: 'help-circle-outline', route: '/tabs/tab3' },
    { title: 'Al-Kitabah', icon: 'create-outline', route: '/tabs/tab4' },
    { title: 'Islamic Education', icon: 'school-outline', route: '/islamic-education' },
    { title: 'Sejarah Islam', icon: 'time-outline', route: '/islamic-history' },
    { title: 'Sunnah & Hadits', icon: 'bookmarks-outline', route: '/sunnah-hadith' },
  ];

  get username(): string {
    return this.supabase.currentUser?.username || 'Pengunjung';
  }

  get isLoggedIn(): boolean {
    return this.supabase.currentUser !== null;
  }

  get avatarSrc(): string {
    if (this.supabase.currentUser) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.username)}&background=C4942C&color=fff&size=128&bold=true&font-size=0.4`;
    }
    return 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat Pagi';
    if (h < 15) return 'Selamat Siang';
    if (h < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  get arabicGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'صَبَاحَ الْخَيْرِ';
    if (h < 17) return 'نَهَارُكَ سَعِيدٌ';
    return 'مَسَاءَ الْخَيْرِ';
  }

  openMenu() { this.menu.open(); }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  get darkModeLabel(): string {
    return this.theme.isDark ? 'Mode Terang' : 'Mode Gelap';
  }

  toggleDarkMode() { this.theme.toggle(); }

  logout() {
    this.supabase.clearSession();
    this.supabase.setCurrentUser(null);
    this.router.navigateByUrl('/login');
  }
}
