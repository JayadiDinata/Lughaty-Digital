import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-islamic-education',
  templateUrl: './islamic-education.page.html',
  styleUrls: ['./islamic-education.page.scss'],
})
export class IslamicEducationPage {
  playlistUrl = 'https://www.youtube.com/embed/videoseries?list=UU3T5C8wkGXwXzVyvKEC_6hQ';

  constructor(public theme: ThemeService) {}

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }
}