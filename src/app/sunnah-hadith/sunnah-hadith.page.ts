import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-sunnah-hadith',
  templateUrl: './sunnah-hadith.page.html',
  styleUrls: ['./sunnah-hadith.page.scss'],
})
export class SunnahHadithPage {
  sections = [
    {
      title: 'Hadits Arba\'in Nawawi',
      subtitle: 'Kumpulan 40 Hadits Dasar',
      icon: 'book-outline',
      color: 'from-emerald-500 to-emerald-600',
      items: [
        { hadith: 'Hadits 1', arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', translation: 'Sesungguhnya amal itu tergantung niatnya', by: 'HR. Bukhari & Muslim' },
        { hadith: 'Hadits 2', arabic: 'فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ', translation: 'Barangsiapa yang hijrahnya kepada Allah dan Rasul-Nya, maka hijrahnya kepada Allah dan Rasul-Nya', by: 'HR. Bukhari & Muslim' },
        { hadith: 'Hadits 3', arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ', translation: 'Islam dibangun di atas lima perkara', by: 'HR. Bukhari & Muslim' },
        { hadith: 'Hadits 4', arabic: 'الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ', translation: 'Yang halal itu jelas dan yang haram itu jelas', by: 'HR. Bukhari & Muslim' },
        { hadith: 'Hadits 5', arabic: 'مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ', translation: 'Barangsiapa mengada-adakan sesuatu dalam urusan kami ini yang bukan darinya, maka ia tertolak', by: 'HR. Bukhari & Muslim' },
        { hadith: 'Hadits 6', arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', translation: 'Bertakwalah kepada Allah di mana pun kamu berada', by: 'HR. Tirmidzi' },
        { hadith: 'Hadits 7', arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', translation: 'Tidak beriman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri', by: 'HR. Bukhari & Muslim' },
      ],
    },
    {
      title: 'Hadits tentang Akhlak',
      subtitle: 'Pedoman perilaku sehari-hari',
      icon: 'heart-outline',
      color: 'from-rose-500 to-rose-600',
      items: [
        { hadith: '', arabic: 'إِنَّمَا بُعِثْتُ لِأُتَمِّمَ صَالِحَ الْأَخْلَاقِ', translation: 'Sesungguhnya aku diutus untuk menyempurnakan akhlak yang baik', by: 'HR. Ahmad' },
        { hadith: '', arabic: 'خَيْرُكُمْ أَحْسَنُكُمْ خُلُقًا', translation: 'Sebaik-baik kalian adalah yang paling baik akhlaknya', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', translation: 'Muslim sejati adalah yang kaum muslimin selamat dari lisan dan tangannya', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'لَا تَغْضَبْ وَلَكَ الْجَنَّةُ', translation: 'Jangan marah, maka bagimu surga', by: 'HR. Thabrani' },
        { hadith: '', arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ', translation: 'Senyummu di hadapan saudaramu adalah sedekah', by: 'HR. Tirmidzi' },
      ],
    },
    {
      title: 'Hadits tentang Ibadah',
      subtitle: 'Panduan ibadah harian',
      icon: 'accessibility-outline',
      color: 'from-blue-500 to-blue-600',
      items: [
        { hadith: '', arabic: 'الصَّلَاةُ عِمَادُ الدِّينِ فَمَنْ أَقَامَهَا فَقَدْ أَقَامَ الدِّينَ', translation: 'Sholat adalah tiang agama, barangsiapa mendirikannya maka ia menegakkan agama', by: 'HR. Baihaqi' },
        { hadith: '', arabic: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ كَفَّارَةٌ لِمَا بَيْنَهُنَّ', translation: 'Sholat lima waktu dan Jumat ke Jumat berikutnya adalah penghapus dosa di antara keduanya', by: 'HR. Muslim' },
        { hadith: '', arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', translation: 'Barangsiapa berpuasa Ramadhan karena iman dan mengharap pahala, diampuni dosa-dosanya yang telah lalu', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ', translation: 'Sebaik-baik dzikir adalah Laa ilaaha illallah', by: 'HR. Tirmidzi' },
        { hadith: '', arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ', translation: 'Doa adalah ibadah', by: 'HR. Tirmidzi' },
      ],
    },
    {
      title: 'Hadits tentang Muamalah',
      subtitle: 'Pedoman interaksi sosial',
      icon: 'people-outline',
      color: 'from-violet-500 to-violet-600',
      items: [
        { hadith: '', arabic: 'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا', translation: 'Seorang mukmin dengan mukmin lainnya bagaikan satu bangunan yang saling menguatkan', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ', translation: 'Barangsiapa melapangkan satu kesusahan dunia dari seorang mukmin, Allah akan melapangkan satu kesusahan di hari kiamat', by: 'HR. Muslim' },
        { hadith: '', arabic: 'لَا تَحَاسَدُوا وَلَا تَبَاغَضُوا وَلَا تَجَسَّسُوا', translation: 'Jangan saling hasud, jangan saling benci, dan jangan saling memata-matai', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا', translation: 'Dua orang yang berjual-beli boleh memilih selama belum berpisah', by: 'HR. Bukhari & Muslim' },
        { hadith: '', arabic: 'أَفْشُوا السَّلَامَ بَيْنَكُمْ', translation: 'Sebarkanlah salam di antara kalian', by: 'HR. Muslim' },
      ],
    },
  ];

  selectedSection: any = null;
  selectedHadith: any = null;

  constructor(public theme: ThemeService) {}

  selectSection(section: any) {
    this.selectedSection = section;
    this.selectedHadith = null;
  }

  selectHadith(item: any) {
    this.selectedHadith = item;
  }

  backToSections() {
    this.selectedSection = null;
    this.selectedHadith = null;
  }

  backToList() {
    this.selectedHadith = null;
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

  getRandomHadith() {
    const allItems = this.sections.flatMap(s => s.items);
    const random = allItems[Math.floor(Math.random() * allItems.length)];
    this.selectedHadith = random;
    this.selectedSection = null;
  }
}
