import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThemeService } from '../theme.service';

interface Message {
  text: string;
  from: 'user' | 'bot';
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements AfterViewInit {
  @ViewChild('scrollMe') scrollContainer: ElementRef;
  input = '';
  messages: Message[] = [];
  isTyping = false;
  avatarEmotion: 'idle' | 'talk' | 'think' = 'idle';

  private keywords: { keys: string[], answer: string }[] = [
    {
      keys: ['penyiaran islam', 'dakwah', 'broadcasting'],
      answer: 'Penyiaran Islam adalah proses menyampaikan pesan-pesan dakwah melalui media elektronik seperti radio, televisi, dan platform digital. Tujuannya menyebarkan ajaran Islam secara luas dan efektif. Di era digital, penyiaran Islam berkembang melalui podcast, YouTube, media sosial, dan aplikasi mobile.'
    },
    {
      keys: ['radio', 'siaran', 'frekuensi'],
      answer: 'Radio dakwah adalah media penyiaran audio yang efektif menjangkau masyarakat luas, terutama di daerah terpencil. Program radio Islam biasanya berisi ceramah, tilawah Al-Quran, tanya jawab agama, musik islami (nasyid), dan dialog interaktif dengan pendengar.'
    },
    {
      keys: ['televisi', 'tv', 'visual'],
      answer: 'Televisi Islam menyajikan program dakwah visual seperti kajian ustaz, film islami, dokumenter sejarah Islam, talkshow keagamaan, dan buka puasa bersama. Beberapa stasiun TV Islam terkenal di Indonesia antara lain TVRI (program agama), MNC TV (ceramah subuh), dan channel-channel Islam di YouTube.'
    },
    {
      keys: ['etika', 'adab', 'komunikasi'],
      answer: 'Etika komunikasi dalam Islam berdasarkan Al-Quran dan Sunnah meliputi: Qawlan Sadida (berkata benar), Qawlan Baligha (efektif dan tepat sasaran), Qawlan Maysura (lemah lembut), Qawlan Layyina (tidak keras), Qawlan Karima (mulia). Dakwah harus disampaikan dengan hikmah, mauidzah hasanah, dan dialog yang baik (QS. An-Nahl: 125).'
    },
    {
      keys: ['media sosial', 'digital', 'online', 'internet'],
      answer: 'Dakwah digital memanfaatkan platform seperti Instagram, TikTok, YouTube, Facebook, Twitter, dan WhatsApp untuk menyebarkan konten Islami. Kelebihannya: jangkauan global, interaktif, biaya rendah, dan analitik data. Strategi konten meliputi: video pendek, infografis, quotes, live streaming kajian, dan podcast.'
    },
    {
      keys: ['retorika', 'public speaking', 'ceramah', 'pidato'],
      answer: 'Retorika dakwah (ilmu al-khatabah) mencakup teknik membuka ceramah, menyusun materi, intonasi suara, gestur tubuh, kontak mata, dan penutup yang berkesan. Seorang dai harus menguasai: Fashahah (kefasihan), Bayan (kejelasan), dan Ta\'tsir (daya pengaruh). Contoh terbaik adalah retorika Rasulullah SAW yang singkat namun padat dan menyentuh hati.'
    },
    {
      keys: ['jurnalisme', 'jurnalistik', 'wartawan', 'berita'],
      answer: 'Jurnalisme Islam adalah kegiatan peliputan, penulisan, dan penyebaran berita yang berlandaskan nilai-nilai Islam. Prinsipnya: tabayyun (verifikasi), amanah (tidak hoax), adil (cover both sides), dan maslahat (bermanfaat). Kode etik jurnalistik Islam berbeda dari jurnalistik konvensional dalam hal larangan menyebarkan fitnah, ghibah, dan konten yang bertentangan syariat.'
    },
    {
      keys: ['manajemen', 'produksi', 'program'],
      answer: 'Manajemen produksi program dakwah meliputi: perencanaan (riset audiens, konsep), produksi (pra-produksi, produksi, pasca-produksi), dan evaluasi (rating, feedback). Format program bisa berupa talkshow, dokumenter, magazine show, reality show islami, atau dakwah interaktif.'
    },
    {
      keys: ['al-quran', 'quran', 'tilawah', 'tajwid'],
      answer: 'Al-Quran adalah pedoman utama dakwah. Program tilawah dan tafsir Al-Quran sangat diminati masyarakat. Dalam penyiaran, penting untuk: memilih qari\' dengan bacaan merdu, menyediakan terjemahan, tafsir singkat, dan sesi tanya jawab. Program seperti "Khatam Al-Quran" selama Ramadhan sangat efektif meningkatkan engagement.'
    },
    {
      keys: ['hadits', 'sunnah'],
      answer: 'Hadits dan Sunnah adalah sumber kedua setelah Al-Quran. Program penyiaran tentang hadits bisa berupa: "Syarah Hadits" (penjelasan hadits), "Hadits Harian" (satu hadits setiap hari), "Amalan Sunnah" (praktik sunnah sehari-hari), dan "Takhrij Hadits" (melacak sumber hadits).'
    },
    {
      keys: ['fiqih', 'hukum islam', 'syariat'],
      answer: 'Fiqih penyiaran Islam membahas hukum-hukum terkait konten dakwah: bolehkah menerima iklan? bagaimana hukum musik dalam program? batasan aurat presenter? hukum talkshow campuran pria-wanita? Semua harus dirujuk kepada Al-Quran, Sunnah, Ijma, dan Qiyas dengan bimbingan ulama.'
    },
    {
      keys: ['kpi', 'komisi penyiaran', 'regulasi'],
      answer: 'Regulasi penyiaran di Indonesia diatur oleh UU No. 32 Tahun 2002 tentang Penyiaran dan UU No. 11 Tahun 2020 tentang Cipta Kerja. KPI (Komisi Penyiaran Indonesia) mengawasi isi siaran agar sesuai dengan P3SPS (Pedoman Perilaku Penyiaran dan Standar Program Siaran), termasuk siaran dakwah yang harus menjaga kerukunan umat beragama.'
    },
  ];

  private fallback = 'Maaf, saya belum memiliki jawaban untuk pertanyaan itu. Silakan coba tanyakan hal lain seputar penyiaran Islam, dakwah, atau topik keislaman lainnya.';

  constructor(public theme: ThemeService) {
    this.messages.push({
      text: 'Assalamualaikum! Saya AI Assistant Lughaty Digital. Tanyakan apa saja seputar penyiaran Islam, dakwah, atau topik keislaman lainnya.',
      from: 'bot'
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.scrollToBottom(), 300);
  }

  send() {
    const q = this.input.trim();
    if (!q) return;
    this.messages.push({ text: q, from: 'user' });
    this.input = '';
    this.isTyping = true;
    this.avatarEmotion = 'think';
    this.scrollToBottom();
    setTimeout(() => this.answer(q), 600 + Math.random() * 800);
  }

  private answer(q: string) {
    this.avatarEmotion = 'talk';
    const lower = q.toLowerCase();
    let found = false;
    for (const item of this.keywords) {
      if (item.keys.some(k => lower.includes(k))) {
        this.messages.push({ text: item.answer, from: 'bot' });
        found = true;
        break;
      }
    }
    if (!found) {
      this.messages.push({ text: this.fallback, from: 'bot' });
    }
    this.isTyping = false;
    setTimeout(() => { this.avatarEmotion = 'idle'; this.scrollToBottom(); }, 200);
  }

  suggest(q: string) {
    this.input = q;
    this.send();
  }

  suggestions = [
    'Apa itu penyiaran Islam?',
    'Etika komunikasi Islam',
    'Dakwah digital',
    'Retorika dakwah',
    'Manajemen produksi dakwah',
    'Regulasi penyiaran',
  ];

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }

  get darkModeIcon() { return this.theme.isDark ? 'sunny-outline' : 'moon-outline'; }
  toggleDarkMode() { this.theme.toggle(); }
}
