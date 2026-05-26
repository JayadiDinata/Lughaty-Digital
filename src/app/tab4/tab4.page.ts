import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TtsService } from '../tts.service';
import { ThemeService } from '../theme.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page implements AfterViewInit, OnDestroy {

  @ViewChild('drawCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  words: string[] = [
    'السَّلَامُ عَلَيْكُمْ',
    'كَيْفَ حَالُكَ',
    'شُكْرًا',
    'إِلَى اللِّقَاءِ',
    'بِسْمِ اللَّهِ',
    'الْحَمْدُ لِلَّهِ',
    'مَدْرَسَة',
    'كِتَاب',
    'مَاء',
    'مَسْجِد',
    'بَيْت',
    'قَلَم',
    'رَسُول',
    'مُدَرِّس',
    'طَالِب',
  ];

  currentIndex: number = 0;
  mode: 'draw' | 'erase' = 'draw';
  score: number | null = null;

  private ctx: CanvasRenderingContext2D | null = null;
  private drawing: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;

  constructor(private tts: TtsService, public theme: ThemeService, private progress: StorageService) {}

  ionViewWillEnter() { this.progress.addXp(2); }

  ngAfterViewInit() {
    this.initCanvas();
    const obs = new ResizeObserver(() => this.initCanvas());
    const el = this.canvasRef?.nativeElement?.parentElement;
    if (el) obs.observe(el);
  }

  ngOnDestroy() {
    this.tts.stop();
  }

  get currentWord(): string {
    return this.words[this.currentIndex] || '';
  }

  get hasPrev(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.words.length - 1;
  }

  private initCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const w = canvas.clientWidth || 500;
    if (w < 10) return;
    canvas.width = w;
    canvas.height = 380;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, w, 380);
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.drawGuidelines();
  }

  private drawGuidelines() {
    const ctx = this.ctx;
    const canvas = this.canvasRef?.nativeElement;
    if (!ctx || !canvas) return;
    ctx.save();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const mid = canvas.height / 2;
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, mid);
    ctx.lineTo(canvas.width, mid);
    ctx.stroke();
    ctx.restore();
  }

  onResize() {
    this.initCanvas();
  }

  private getPos(e: MouseEvent | Touch): { x: number; y: number } {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return { x: 0, y: 0 };
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  startDrawing(e: MouseEvent) {
    this.drawing = true;
    const p = this.getPos(e);
    this.lastX = p.x;
    this.lastY = p.y;
  }

  draw(e: MouseEvent) {
    if (!this.drawing) return;
    const ctx = this.ctx;
    if (!ctx) return;
    const p = this.getPos(e);

    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(p.x, p.y);

    if (this.mode === 'erase') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
    }

    ctx.stroke();
    this.lastX = p.x;
    this.lastY = p.y;
  }

  stopDrawing() {
    if (this.drawing) {
      this.drawing = false;
      this.evaluateScore();
    }
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    this.drawing = true;
    const p = this.getPos(touch);
    this.lastX = p.x;
    this.lastY = p.y;
  }

  onTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (!this.drawing) return;
    const touch = e.touches[0];
    const ctx = this.ctx;
    if (!ctx) return;
    const p = this.getPos(touch);

    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(p.x, p.y);

    if (this.mode === 'erase') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    } else {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
    }

    ctx.stroke();
    this.lastX = p.x;
    this.lastY = p.y;
  }

  onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.stopDrawing();
  }

  setMode(m: 'draw' | 'erase') {
    this.mode = m;
    this.score = null;
  }

  resetCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = this.ctx;
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawGuidelines();
    this.score = null;
  }

  prevWord() {
    if (!this.hasPrev) return;
    this.resetCanvas();
    this.currentIndex--;
    this.mode = 'draw';
  }

  nextWord() {
    if (!this.hasNext) return;
    this.resetCanvas();
    this.currentIndex++;
    this.mode = 'draw';
  }

  private evaluateScore() {
    const canvas = this.canvasRef?.nativeElement;
    const ctx = this.ctx;
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const refCanvas = document.createElement('canvas');
    refCanvas.width = w;
    refCanvas.height = h;
    const refCtx = refCanvas.getContext('2d');
    if (!refCtx) return;

    refCtx.fillStyle = '#ffffff';
    refCtx.fillRect(0, 0, w, h);

    const fontSize = Math.min(w / this.currentWord.length * 2.2, 72);
    refCtx.fillStyle = '#000000';
    refCtx.font = `bold ${fontSize}px 'Noto Naskh Arabic', 'Traditional Arabic', 'Amiri', serif`;
    refCtx.textAlign = 'center';
    refCtx.textBaseline = 'middle';
    refCtx.direction = 'rtl';
    refCtx.fillText(this.currentWord, w / 2, h / 2);

    const userData = ctx.getImageData(0, 0, w, h).data;
    const refData = refCtx.getImageData(0, 0, w, h).data;

    const cols = 16;
    const rows = 12;
    const cellW = w / cols;
    const cellH = h / rows;

    let refInk = 0;
    let match = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let refDark = 0;
        let userDark = 0;
        let total = 0;
        for (let y = r * cellH; y < (r + 1) * cellH; y++) {
          for (let x = c * cellW; x < (c + 1) * cellW; x++) {
            const idx = (Math.floor(y) * w + Math.floor(x)) * 4;
            const refPx = refData[idx];
            const refA = refData[idx + 3];
            const userPx = userData[idx];
            const userA = userData[idx + 3];
            if (refA > 100 && refPx < 128) refDark++;
            if (userA > 100 && userPx < 128) userDark++;
            total++;
          }
        }
        const refDensity = refDark / total;
        const userDensity = userDark / total;
        if (refDensity > 0.05) {
          refInk++;
          if (userDensity > 0.03) match++;
        }
      }
    }

    this.score = refInk > 0 ? Math.round((match / refInk) * 100) : 0;
  }

  playWord() {
    this.progress.addXp(1);
    this.updateProgress();
    this.tts.stop();
    if (!this.currentWord) return;

    this.tts.speak(this.currentWord, 'ar-SA');
  }

  private readonly SKILL_INDEX = 3;

  get skillProgress(): number {
    return this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
  }

  private updateProgress() {
    const cur = this.progress.skills$.value[this.SKILL_INDEX]?.progress ?? 0;
    this.progress.updateSkillProgress(this.SKILL_INDEX, Math.min(100, cur + 7));
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

}
