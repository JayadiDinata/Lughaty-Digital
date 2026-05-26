import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const LEVEL_XP = 100;
const SKILL_NAMES = ['Al-Istima', 'Al-Kalam', 'Al-Qiroah', 'Al-Kitabah'];

export interface SkillState {
  name: string;
  progress: number;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  xp$ = new BehaviorSubject<number>(0);
  dailyXp$ = new BehaviorSubject<number>(0);
  streak$ = new BehaviorSubject<number>(0);
  daysUsed$ = new BehaviorSubject<number>(0);
  dailyGoal = 50;
  skills$ = new BehaviorSubject<SkillState[]>(this.defaultSkills());

  constructor() { this.load(); }

  get level(): number { return Math.floor(this.xp$.value / LEVEL_XP) + 1; }

  get xpPercent(): number {
    return Math.min(100, Math.round((this.dailyXp$.value / this.dailyGoal) * 100));
  }

  addXp(amount: number) {
    this.checkDaily();
    this.xp$.next(this.xp$.value + amount);
    this.dailyXp$.next(this.dailyXp$.value + amount);
    this.save();
  }

  updateSkillProgress(index: number, pct: number) {
    const skills = this.skills$.value;
    if (!skills[index]) return;
    skills[index].progress = Math.min(100, Math.max(0, pct));
    skills[index].completed = skills[index].progress >= 100;
    this.skills$.next([...skills]);
    this.save();
  }

  private defaultSkills(): SkillState[] {
    return SKILL_NAMES.map(n => ({ name: n, progress: 0, completed: false }));
  }

  private checkDaily() {
    const today = new Date().toDateString();
    const last = localStorage.getItem('lughaty_lastActive') || '';
    if (last !== today) {
      this.daysUsed$.next(this.daysUsed$.value + 1);
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (last === yesterday) {
        this.streak$.next(this.streak$.value + 1);
      } else if (last) {
        this.streak$.next(0);
      }
      this.dailyXp$.next(0);
      localStorage.setItem('lughaty_lastActive', today);
    }
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
      if (data.skills) {
        this.skills$.next(data.skills);
      }
      this.checkDaily();
    } catch {}
  }

  save() {
    localStorage.setItem('lughaty_progress', JSON.stringify({
      xp: this.xp$.value,
      dailyXp: this.dailyXp$.value,
      streak: this.streak$.value,
      daysUsed: this.daysUsed$.value,
      skills: this.skills$.value,
    }));
  }
}
