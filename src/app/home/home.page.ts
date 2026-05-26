import { Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { SupabaseService } from '../supabase.service';
import { ThemeService } from '../theme.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  @ViewChild(IonMenu) menu: IonMenu;
  showAbout: boolean = false;

  constructor(
    public supabase: SupabaseService,
    public theme: ThemeService,
    public progress: StorageService,
  ) {}

  get username(): string {
    return this.supabase.currentUser?.username || 'Nama Pengguna';
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

  get arabicGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'صَبَاحَ الْخَيْرِ';
    if (h < 17) return 'نَهَارُكَ سَعِيدٌ';
    return 'مَسَاءَ الْخَيْرِ';
  }

  get arabicEncouragement(): string {
    return 'أَكْمِلْ يَوْمَكَ بِالعِلْمِ';
  }

  openMenu() { this.menu.open(); }

  toggleAbout() { this.showAbout = !this.showAbout; }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  get darkModeLabel(): string {
    return this.theme.isDark ? 'Mode Terang' : 'Mode Gelap';
  }

  toggleDarkMode() { this.theme.toggle(); }
}
