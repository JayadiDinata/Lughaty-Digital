import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-islamic-education',
  templateUrl: './islamic-education.page.html',
  styleUrls: ['./islamic-education.page.scss'],
})
export class IslamicEducationPage {
  activeChannel = 'mediaislamjakarta';

  channels = [
    {
      id: 'mediaislamjakarta',
      name: 'Media Islam Jakarta',
      handle: '@mediaislamjakarta',
      desc: 'Channel dakwah Islam yang menyajikan konten-konten edukatif seputar ajaran Islam, kisah inspiratif, dan kajian ilmu syar\'i.',
      playlistId: 'UU3T5C8wkGXwXzVyvKEC_6hQ',
      url: 'https://www.youtube.com/@mediaislamjakarta',
    },
    {
      id: 'jedanulis',
      name: 'Jeda Nulis',
      handle: '@jedanulis',
      desc: 'Channel edukasi Islam yang membahas Al-Quran, hadits, kisah nabi, akhlak, dan berbagai ilmu syar\'i dengan sajian ringan dan mudah dipahami.',
      playlistId: 'UUp7hJfiiocdY085XnWVrp2Q',
      url: 'https://www.youtube.com/@jedanulis',
    },
  ];

  constructor(public theme: ThemeService) {}

  get active(): any {
    return this.channels.find(c => c.id === this.activeChannel) || this.channels[0];
  }

  get playlistUrl(): string {
    return `https://www.youtube.com/embed/videoseries?list=${this.active.playlistId}`;
  }

  selectChannel(id: string) {
    this.activeChannel = id;
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }
}
