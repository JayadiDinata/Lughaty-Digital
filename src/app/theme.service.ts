import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _isDark = false;
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.init();
  }

  get isDark(): boolean {
    return this._isDark;
  }

  toggle() {
    this._isDark = !this._isDark;
    this.apply();
    localStorage.setItem('lughaty_theme', this._isDark ? 'dark' : 'light');
  }

  private init() {
    const stored = localStorage.getItem('lughaty_theme');
    if (stored) {
      this._isDark = stored === 'dark';
    } else {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this._isDark = this.mediaQuery.matches;
      this.mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('lughaty_theme')) {
          this._isDark = e.matches;
          this.apply();
        }
      });
    }
    this.apply();
  }

  private apply() {
    document.body.classList.toggle('dark', this._isDark);
  }
}
