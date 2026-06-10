import { Injectable } from '@angular/core';

export interface UserData {
  id: number;
  username: string;
  email: string;
}

export interface SavedAccount {
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private _currentUser: UserData | null = null;
  private readonly SESSION_KEY = 'lughaty_session';
  private readonly EMAIL_KEY = 'lughaty_saved_email';
  private readonly ACCOUNTS_KEY = 'lughaty_accounts';
  private readonly USERS_KEY = 'lughaty_users';

  constructor() {}

  get currentUser(): UserData | null {
    return this._currentUser;
  }

  setCurrentUser(user: UserData | null) {
    this._currentUser = user;
  }

  saveEmail(email: string): void {
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  saveUserSession(user: UserData): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  loadSession(): { user: UserData | null; savedEmail: string } {
    const savedEmail = localStorage.getItem(this.EMAIL_KEY) || '';
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (raw) {
        const user = JSON.parse(raw) as UserData;
        return { user, savedEmail };
      }
    } catch {}
    return { user: null, savedEmail };
  }

  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  getSavedAccounts(): SavedAccount[] {
    try {
      const raw = localStorage.getItem(this.ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw) as SavedAccount[];
    } catch {}
    return [];
  }

  saveAccount(email: string, username: string): void {
    const accounts = this.getSavedAccounts().filter(a => a.email !== email);
    accounts.unshift({ email, username });
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, 5)));
  }

  removeAccount(email: string): void {
    const accounts = this.getSavedAccounts().filter(a => a.email !== email);
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  private getUsers(): UserData[] {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      if (raw) return JSON.parse(raw) as UserData[];
    } catch {}
    return [];
  }

  private saveUsers(users: UserData[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private nextId(users: UserData[]): number {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  async register(username: string, email: string, password: string) {
    const users = this.getUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      return { data: null, error: { message: 'duplicate: Email sudah terdaftar' } };
    }
    const entry: UserData & { password: string } = {
      id: this.nextId(users),
      username,
      email,
      password,
    };
    users.push(entry);
    this.saveUsers(users);
    const data: UserData = { id: entry.id, username: entry.username, email: entry.email };
    return { data, error: null };
  }

  async login(email: string, password: string) {
    const users = this.getUsers() as (UserData & { password: string })[];
    const entry = users.find(u => u.email === email && u.password === password);
    if (!entry) {
      return { data: null, error: { message: 'Email atau password salah' } };
    }
    const data: UserData = { id: entry.id, username: entry.username, email: entry.email };
    return { data, error: null };
  }

  async countUsers(): Promise<number> {
    return this.getUsers().length;
  }
}
