import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

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

  constructor(private http: HttpClient) {}

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

  async register(username: string, email: string, password: string) {
    try {
      return await firstValueFrom(
        this.http.post<{ data: UserData | null; error: { message: string } | null }>(
          `${environment.apiUrl}/register`, { username, email, password }
        )
      );
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Gagal registrasi' } };
    }
  }

  async login(email: string, password: string) {
    try {
      return await firstValueFrom(
        this.http.post<{ data: UserData | null; error: { message: string } | null }>(
          `${environment.apiUrl}/login`, { email, password }
        )
      );
    } catch (err: any) {
      return { data: null, error: { message: err.message || 'Gagal login' } };
    }
  }

  async countUsers(): Promise<number> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ count: number }>(`${environment.apiUrl}/users/count`)
      );
      return res.count;
    } catch {
      return 0;
    }
  }
}
