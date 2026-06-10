import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  userCount = 0;

  constructor(
    public theme: ThemeService,
    public supabase: SupabaseService,
  ) {
    this.loadCount();
  }

  private async loadCount() {
    try { this.userCount = await this.supabase.countUsers(); } catch { this.userCount = 0; }
  }

  get username() { return this.supabase.currentUser?.username || 'Pengunjung'; }

  get darkModeIcon() { return this.theme.isDark ? 'sunny-outline' : 'moon-outline'; }
  toggleDarkMode() { this.theme.toggle(); }
}
