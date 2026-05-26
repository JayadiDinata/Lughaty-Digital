import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface UserData {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser: UserData | null = null;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  get currentUser(): UserData | null {
    return this._currentUser;
  }

  setCurrentUser(user: UserData | null) {
    this._currentUser = user;
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
