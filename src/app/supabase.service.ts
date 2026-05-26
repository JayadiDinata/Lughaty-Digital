import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  private supabase: SupabaseClient;
  private _currentUser: UserData | null = null;
  private readonly SESSION_KEY = 'lughaty_session';
  private readonly EMAIL_KEY = 'lughaty_saved_email';
  private readonly ACCOUNTS_KEY = 'lughaty_accounts';

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  get currentUser(): UserData | null {
    return this._currentUser;
  }

  setCurrentUser(user: UserData | null) {
    this._currentUser = user;
  }

  /** Always saves email for pre-fill; call saveUserSession() separately for full auto-login */
  saveEmail(email: string): void {
    localStorage.setItem(this.EMAIL_KEY, email);
  }

  /** Persists full user session for auto-login on next app open */
  saveUserSession(user: UserData): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
  }

  /** Returns saved user (if any) and saved email */
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

  /** Clears full user session (on logout) */
  clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  /** Returns list of saved accounts (email + username) for the account picker */
  getSavedAccounts(): SavedAccount[] {
    try {
      const raw = localStorage.getItem(this.ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw) as SavedAccount[];
    } catch {}
    return [];
  }

  /** Save or move account to top of list (max 5) */
  saveAccount(email: string, username: string): void {
    const accounts = this.getSavedAccounts().filter(a => a.email !== email);
    accounts.unshift({ email, username });
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts.slice(0, 5)));
  }

  /** Remove a specific saved account */
  removeAccount(email: string): void {
    const accounts = this.getSavedAccounts().filter(a => a.email !== email);
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  async register(username: string, email: string, password: string) {
    const { data, error } = await this.supabase
      .from('users')
      .insert({ username, email, password })
      .select()
      .single();
    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();
    return { data, error };
  }
}
