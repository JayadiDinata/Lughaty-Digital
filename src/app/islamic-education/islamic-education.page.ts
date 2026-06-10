import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-islamic-education',
  templateUrl: './islamic-education.page.html',
  styleUrls: ['./islamic-education.page.scss'],
})
export class IslamicEducationPage {
  categories: string[] = [
    'Kisah Nabi & Rasul',
    'Keajaiban Al-Quran',
    'Akhlak Islami',
    'Dakwah & Tabligh',
    'Fikih Sehari-hari',
    'Motivasi Islami',
  ];

  selectedCategory: string = '';
  videos: any[] = [];

  private allVideos: any[] = [
    {
      id: 'd1LCRxNnP8A',
      title: 'Kisah Nabi Muhammad SAW - Full Sejarah',
      channel: 'Islam Populer',
      category: 'Kisah Nabi & Rasul',
    },
    {
      id: 'T9ahTGoHcnU',
      title: 'Mukjizat Al-Quran yang Tak Terbantahkan',
      channel: 'Cahaya Islam',
      category: 'Keajaiban Al-Quran',
    },
    {
      id: 'QId-HwTnDOc',
      title: 'Akhlak Rasulullah dalam Kehidupan Sehari-hari',
      channel: 'Muslimah Daily',
      category: 'Akhlak Islami',
    },
    {
      id: 'tJf5C2vVYVg',
      title: 'Seni Berdakwah di Era Digital',
      channel: 'Dakwah Digital',
      category: 'Dakwah & Tabligh',
    },
    {
      id: 'SXh7gEBoCrk',
      title: 'Tata Cara Sholat Yang Benar',
      channel: 'Fiqih Islam',
      category: 'Fikih Sehari-hari',
    },
    {
      id: 'uXn1b9hZcSY',
      title: 'Motivasi Islam - Jangan Pernah Menyerah',
      channel: 'Inspirasi Hijrah',
      category: 'Motivasi Islami',
    },
    {
      id: '3JqfkYpx5aM',
      title: 'Kisah Nabi Musa AS dan Firaun',
      channel: 'Kisah Islami',
      category: 'Kisah Nabi & Rasul',
    },
    {
      id: '7yT7H0tQb8U',
      title: 'Keindahan Al-Quran dalam Sains Modern',
      channel: 'Islam dan Sains',
      category: 'Keajaiban Al-Quran',
    },
    {
      id: 'vE5LJmuNVrM',
      title: 'Adab Bergaul dalam Islam',
      channel: 'Akhlak Mulia',
      category: 'Akhlak Islami',
    },
    {
      id: 'gP7ZpndBEYg',
      title: 'Strategi Dakwah Nabi Muhammad SAW',
      channel: 'Sejarah Dakwah',
      category: 'Dakwah & Tabligh',
    },
    {
      id: '6vP6CCSBgsA',
      title: 'Puasa Sunnah dan Keutamaannya',
      channel: 'Fiqih Sunnah',
      category: 'Fikih Sehari-hari',
    },
    {
      id: 'kKhPbq7sO2M',
      title: 'Hijrah itu Indah - Kisah Inspiratif',
      channel: 'Kisah Hijrah',
      category: 'Motivasi Islami',
    },
    {
      id: 'nLqBHYgrc7k',
      title: 'Kisah Nabi Ibrahim AS - Bapak Para Nabi',
      channel: 'Kisah Islami',
      category: 'Kisah Nabi & Rasul',
    },
    {
      id: '80TjvYuYBjs',
      title: 'Al-Quran dan Fenomena Alam',
      channel: 'Sains Islam',
      category: 'Keajaiban Al-Quran',
    },
    {
      id: 'MH2VqFaC-nk',
      title: 'Cara Menjaga Lisan dalam Islam',
      channel: 'Akhlak Islami',
      category: 'Akhlak Islami',
    },
  ];

  constructor(public theme: ThemeService) {
    this.videos = [...this.allVideos];
  }

  filterByCategory(cat: string) {
    this.selectedCategory = cat;
    if (!cat) {
      this.videos = [...this.allVideos];
    } else {
      this.videos = this.allVideos.filter(v => v.category === cat);
    }
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }
}
