import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService, UserData, SavedAccount } from '../supabase.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private supabase: SupabaseService,
    public theme: ThemeService
  ) {}

  showPassword: boolean = false;
  isLogin: boolean = true;
  rememberMe: boolean = true;
  savedAccounts: SavedAccount[] = [];
  selectedAccount: SavedAccount | null = null;
  showForm: boolean = false;
  showPasswordOnly: boolean = false;

  ngOnInit() {
    this.savedAccounts = this.supabase.getSavedAccounts();
    if (this.savedAccounts.length > 0) {
      this.showForm = false;
      this.showPasswordOnly = false;
    } else {
      this.showForm = true;
    }
  }

  public email: any = '';
  public password: any = '';
  public username: any = '';
  public regEmail: any = '';
  public pass1: any = '';
  public pass2: any = '';
  showPass1: boolean = false;
  showPass2: boolean = false;
  loading: boolean = false;

  accountCardClasses(acc: SavedAccount): string {
    const base = 'MuiCard-root w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer border';
    if (this.selectedAccount?.email === acc.email) {
      return base + ' border-gold-500 dark:border-green-500 bg-gold-50 dark:bg-green-900/30 shadow-md';
    }
    return base + ' border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-gold-300 dark:hover:border-green-700';
  }

  selectAccount(account: SavedAccount) {
    this.selectedAccount = account;
    this.email = account.email;
    this.password = '';
    this.showForm = true;
    this.showPasswordOnly = true;
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('#passwordInput')?.focus();
    }, 150);
  }

  selectOtherAccount() {
    this.selectedAccount = null;
    this.email = '';
    this.password = '';
    this.showForm = true;
    this.showPasswordOnly = false;
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('#emailInput')?.focus();
    }, 150);
  }

  async removeSaved(email: string, event: Event) {
    event.stopPropagation();
    this.supabase.removeAccount(email);
    this.savedAccounts = this.supabase.getSavedAccounts();
    if (this.selectedAccount?.email === email) {
      this.selectedAccount = null;
      this.showForm = this.savedAccounts.length === 0;
      this.showPasswordOnly = false;
      this.email = '';
      this.password = '';
    }
  }

  togglePasswordVisibility(passwordNumber: number) {
    if (passwordNumber === 1) {
      this.showPass1 = !this.showPass1;
    } else if (passwordNumber === 2) {
      this.showPass2 = !this.showPass2;
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.snackBar.open('Harap isi email dan password', 'Tutup', { duration: 3000 });
      return;
    }

    this.loading = true;
    try {
      const { data, error } = await this.supabase.login(this.email, this.password);
      if (error || !data) {
        this.snackBar.open('Email atau password salah', 'Tutup', { duration: 4000 });
      } else {
        const user: UserData = { id: data.id, username: data.username, email: data.email };
        this.supabase.setCurrentUser(user);
        this.supabase.saveEmail(this.email);

        this.snackBar.open('Login Berhasil, Selamat datang ' + data.username, 'Tutup', { duration: 3000 });

        const isNew = !this.supabase.getSavedAccounts().some(a => a.email === user.email);
        if (isNew) {
          const saveRef = this.snackBar.open('Simpan login pada perangkat ini?', 'Ya', { duration: 10000 });
          saveRef.onAction().subscribe(() => {
            this.supabase.saveAccount(user.email, user.username);
            if (this.rememberMe) {
              this.supabase.saveUserSession(user);
            }
            this.savedAccounts = this.supabase.getSavedAccounts();
          });
        } else {
          if (this.rememberMe) {
            this.supabase.saveUserSession(user);
          }
        }

        this.email = '';
        this.password = '';
        this.router.navigateByUrl('/tabs/home');
      }
    } catch (err: any) {
      this.snackBar.open('Login Gagal: ' + (err.message || err), 'Tutup', { duration: 5000 });
    } finally {
      this.loading = false;
    }
  }

  get darkModeIcon(): string {
    return this.theme.isDark ? 'sunny-outline' : 'moon-outline';
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

  async clr() {
    this.email = '';
    this.password = '';
    this.pass1 = '';
    this.pass2 = '';
    this.username = '';
    this.regEmail = '';
  }

  async addData() {
    if (this.username == '') {
      this.snackBar.open('Harap isi username', 'Tutup', { duration: 3000 });
    } else if (this.regEmail == '') {
      this.snackBar.open('Harap isi email', 'Tutup', { duration: 3000 });
    } else if (this.pass1 == '') {
      this.snackBar.open('Harap isi password', 'Tutup', { duration: 3000 });
    } else if (this.pass1 != this.pass2) {
      this.snackBar.open('Password Tidak Sama', 'Tutup', { duration: 3000 });
    } else {
      this.loading = true;
      try {
        const { data, error } = await this.supabase.register(
          this.username,
          this.regEmail,
          this.pass2
        );
        if (error) {
          let msg = error.message;
          if (msg.includes('duplicate') || msg.includes('already exists')) {
            msg = 'Email sudah terdaftar, silakan login';
            this.email = this.regEmail;
            this.isLogin = true;
          }
          this.snackBar.open('Registrasi Gagal: ' + msg, 'Tutup', { duration: 5000 });
        } else {
          this.snackBar.open('Registrasi Berhasil, silakan login', 'Tutup', { duration: 4000 });
          this.email = this.regEmail;
          this.username = '';
          this.regEmail = '';
          this.pass1 = '';
          this.pass2 = '';
          this.isLogin = true;
        }
      } catch (err: any) {
        this.snackBar.open('Registrasi Gagal: ' + (err.message || err), 'Tutup', { duration: 5000 });
      } finally {
        this.loading = false;
      }
    }
  }
}
