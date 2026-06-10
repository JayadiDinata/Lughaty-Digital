import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  xp$ = new BehaviorSubject<number>(0);
  dailyXp$ = new BehaviorSubject<number>(0);
  streak$ = new BehaviorSubject<number>(0);
  daysUsed$ = new BehaviorSubject<number>(0);
  dailyGoal = 50;

  constructor() { this.load(); }

  addXp(amount: number) {
    this.xp$.next(this.xp$.value + amount);
    this.dailyXp$.next(this.dailyXp$.value + amount);
    this.save();
  }

  private load() {
    try {
      const raw = localStorage.getItem('lughaty_progress');
      if (!raw) return;
      const data = JSON.parse(raw);
      this.xp$.next(data.xp || 0);
      this.dailyXp$.next(data.dailyXp || 0);
      this.streak$.next(data.streak || 0);
      this.daysUsed$.next(data.daysUsed || 0);
    } catch {}
  }

  save() {
    localStorage.setItem('lughaty_progress', JSON.stringify({
      xp: this.xp$.value,
      dailyXp: this.dailyXp$.value,
      streak: this.streak$.value,
      daysUsed: this.daysUsed$.value,
    }));
  }
}
