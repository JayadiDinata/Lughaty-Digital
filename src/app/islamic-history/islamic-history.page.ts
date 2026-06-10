import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-islamic-history',
  templateUrl: './islamic-history.page.html',
  styleUrls: ['./islamic-history.page.scss'],
})
export class IslamicHistoryPage {
  eras = [
    {
      title: 'Masa Jahiliyah',
      period: 'Sebelum 610 M',
      icon: 'cloud-outline',
      color: 'from-stone-500 to-stone-600',
      content: 'Masa sebelum kenabian Muhammad SAW, dimana masyarakat Arab menyembah berhala, praktik perjudian, dan minum-minuman keras merajalela. Kaum wanita tidak memiliki hak dan bayi perempuan dikubur hidup-hidup.',
    },
    {
      title: 'Kelahiran & Kenabian',
      period: '570 - 632 M',
      icon: 'star-outline',
      color: 'from-amber-500 to-amber-600',
      content: 'Nabi Muhammad SAW lahir di Mekkah tahun 570 M (Tahun Gajah). Menerima wahyu pertama di Gua Hira pada usia 40 tahun. Beliau berdakwah secara sembunyi-sembunyi selama 3 tahun, kemudian terang-terangan.',
    },
    {
      title: 'Periode Mekkah',
      period: '610 - 622 M',
      icon: 'location-outline',
      color: 'from-orange-500 to-orange-600',
      content: 'Dakwah Islam di Mekkah menghadapi tantangan berat dari kaum Quraisy. Umat Islam mengalami penyiksaan, boikot, dan tekanan. Beberapa sahabat hijrah ke Habasyah (Ethiopia). Tahun 619 M disebut "Amul Huzni" (Tahun Kesedihan).',
    },
    {
      title: 'Periode Madinah',
      period: '622 - 632 M',
      icon: 'flag-outline',
      color: 'from-emerald-500 to-emerald-600',
      content: 'Hijrah ke Madinah menandai awal kalender Islam. Nabi membangun Masjid Nabawi, mempersaudarakan Muhajirin dan Anshar, serta membuat Piagam Madinah. Terjadi perang Badar, Uhud, Khandaq, dan Fathu Makkah.',
    },
    {
      title: 'Khulafaur Rasyidin',
      period: '632 - 661 M',
      icon: 'people-outline',
      color: 'from-blue-500 to-blue-600',
      content: 'Kepemimpinan Abu Bakar Ash-Shiddiq, Umar bin Khattab, Utsman bin Affan, dan Ali bin Abi Thalib. Masa perluasan Islam hingga Persia, Romawi, dan Mesir. Kodifikasi Al-Quran, pembentukan lembaga pemerintahan dan peradilan.',
    },
    {
      title: 'Dinasti Umayyah',
      period: '661 - 750 M',
      icon: 'business-outline',
      color: 'from-purple-500 to-purple-600',
      content: 'Berpusat di Damaskus. Perluasan Islam hingga Spanyol (Andalusia), India, dan Afrika Utara. Pembangunan arsitektur Islam seperti Dome of the Rock dan Masjid Umayyah. Bahasa Arab menjadi bahasa administrasi negara.',
    },
    {
      title: 'Dinasti Abbasiyah',
      period: '750 - 1258 M',
      icon: 'library-outline',
      color: 'from-rose-500 to-rose-600',
      content: 'Zaman Keemasan Islam (Golden Age). Berpusat di Baghdad. Baitul Hikmah (Rumah Kebijaksanaan) sebagai pusat penerjemahan ilmu. Kemajuan pesat dalam ilmu kedokteran, astronomi, matematika, filsafat, dan sastra.',
    },
    {
      title: 'Andalusia & Utsmaniyah',
      period: '711 - 1924 M',
      icon: 'globe-outline',
      color: 'from-cyan-500 to-cyan-600',
      content: 'Kejayaan Islam di Spanyol (Cordoba, Granada) selama 800 tahun. Kesultanan Utsmaniyah berkuasa selama 600 tahun, menaklukkan Konstantinopel (1453 M). Masa keemasan arsitektur dan militer Islam.',
    },
    {
      title: 'Islam Nusantara',
      period: 'Abad 13 - sekarang',
      icon: 'earth-outline',
      color: 'from-teal-500 to-teal-600',
      content: 'Islam masuk ke Nusantara melalui jalur perdagangan. Peran Wali Songo dalam penyebaran Islam di Jawa. Berdirinya kerajaan-kerajaan Islam: Samudera Pasai, Demak, Aceh, Mataram, dan lain-lain. Islam berkembang dengan akulturasi budaya lokal.',
    },
    {
      title: 'Kebangkitan Islam Modern',
      period: 'Abad 19 - sekarang',
      icon: 'trending-up-outline',
      color: 'from-sky-500 to-sky-600',
      content: 'Gerakan pembaruan Islam: Muhammad Abduh, Jamaluddin Al-Afghani. Organisasi Islam modern: Muhammadiyah (1912), NU (1926). Perjuangan kemerdekaan negara-negara Muslim. Tantangan dan peluang dakwah di era digital.',
    },
  ];

  selectedEra: any = null;

  constructor(public theme: ThemeService) {}

  selectEra(era: any) {
    this.selectedEra = era;
  }

  back() {
    this.selectedEra = null;
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }
}
