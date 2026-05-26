import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TtsService } from '../tts.service';
import { ThemeService } from '../theme.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy {

  constructor(private tts: TtsService, public theme: ThemeService, private progress: StorageService) {}

  @ViewChild('swiperEX', { static: false }) swiperRef: ElementRef;

  playingLine: HTMLElement | null = null;

  ionViewWillEnter() { this.progress.addXp(2); }

  ngOnDestroy() {
    this.tts.stop();
  }

  nextSlide() {
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.slideNext(400, true);
    }
  }

  prevSlide() {
    if (this.swiperRef?.nativeElement?.swiper) {
      this.swiperRef.nativeElement.swiper.slidePrev(400, true);
    }
  }

  handleRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  playLine(event: Event) {
    const target = event.target as HTMLElement;
    const line = target.closest('.arabic-line') as HTMLElement | null;
    if (!line) return;

    const textEl = line.querySelector('.ar-text');
    const text = textEl?.textContent?.replace(/^[^:]+:\s*/, '').trim() || '';
    if (!text) return;

    this.progress.addXp(1);
    this.updateProgress();
    this.tts.stop();
    if (this.playingLine) {
      this.playingLine.classList.remove('playing');
    }

    line.classList.add('playing');
    this.playingLine = line;

    let completed = false;
    const done = () => {
      if (completed) return;
      completed = true;
      line.classList.remove('playing');
      this.playingLine = null;
    };

    this.tts.speak(text, 'ar-SA').then(() => done()).catch(() => done());

    // Safety timeout
    setTimeout(() => done(), 5000);
  }

  private readonly SKILL_INDEX = 1;

  get skillProgress(): number {
    return this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
  }

  private updateProgress() {
    const cur = this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
    this.progress.updateSkillProgress(this.SKILL_INDEX, Math.min(100, cur + 2));
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

}
