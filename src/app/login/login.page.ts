import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    public toastCtrl: ToastController,
    private supabase: SupabaseService,
    public theme: ThemeService
  ) {}
  showPassword: boolean = false;
  isLogin: boolean = true;
  rememberMe: boolean = true;
  savedAccounts: SavedAccount[] = [];
  selectedAccount: SavedAccount | null = null;

  ngOnInit() {
    this.savedAccounts = this.supabase.getSavedAccounts();
    if (this.savedAccounts.length > 0 && !this.email) {
      this.selectAccount(this.savedAccounts[0]);
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

  accountClasses(acc: SavedAccount): string {
    const base = 'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700';
    if (this.selectedAccount?.email === acc.email) {
      return base + ' bg-gold-50 dark:bg-green-900/30 ring-2 ring-gold-500 dark:ring-green-500';
    }
    return base + ' bg-slate-50 dark:bg-gray-700/50';
  }

  selectAccount(account: SavedAccount) {
    this.selectedAccount = account;
    this.email = account.email;
    this.password = '';
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('#passwordInput');
      el?.focus();
    }, 100);
  }

  selectOtherAccount() {
    this.selectedAccount = null;
    this.email = '';
    this.password = '';
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('#emailInput');
      el?.focus();
    }, 100);
  }

  async removeSaved(email: string, event: Event) {
    event.stopPropagation();
    this.supabase.removeAccount(email);
    this.savedAccounts = this.supabase.getSavedAccounts();
    if (this.selectedAccount?.email === email) {
      this.selectedAccount = null;
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
      const toast = await this.toastCtrl.create({
        message: 'Harap isi email dan password',
        duration: 2000,
      });
      toast.present();
      return;
    }

    this.loading = true;
    try {
      const { data, error } = await this.supabase.login(this.email, this.password);
      if (error || !data) {
        const toast = await this.toastCtrl.create({
          message: 'Login Gagal: Email atau password salah',
          duration: 3000,
        });
        toast.present();
      } else {
        const user: UserData = { id: data.id, username: data.username, email: data.email };
        this.supabase.setCurrentUser(user);
        this.supabase.saveEmail(this.email);
        this.supabase.saveAccount(user.email, user.username);
        if (this.rememberMe) {
          this.supabase.saveUserSession(user);
        }
        const toast = await this.toastCtrl.create({
          message: 'Login Berhasil, Selamat datang ' + data.username,
          duration: 2000,
        });
        toast.present();
        this.email = '';
        this.password = '';
        this.router.navigateByUrl('/tabs/home');
      }
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: 'Login Gagal: ' + (err.message || err),
        duration: 3000,
      });
      toast.present();
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
      const toast = await this.toastCtrl.create({
        message: 'Harap isi username',
        duration: 2000,
      });
      toast.present();
    } else if (this.regEmail == '') {
      const toast = await this.toastCtrl.create({
        message: 'Harap isi email',
        duration: 2000,
      });
      toast.present();
    } else if (this.pass1 == '') {
      const toast = await this.toastCtrl.create({
        message: 'Harap isi password',
        duration: 2000,
      });
      toast.present();
    } else if (this.pass1 != this.pass2) {
      const toast = await this.toastCtrl.create({
        message: 'Password Tidak Sama',
        duration: 2000,
      });
      toast.present();
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
          const toast = await this.toastCtrl.create({
            message: 'Registrasi Gagal: ' + msg,
            duration: 4000,
          });
          toast.present();
        } else {
          const toast = await this.toastCtrl.create({
            message: 'Registrasi Berhasil, silakan login',
            duration: 3000,
          });
          toast.present();
          this.email = this.regEmail;
          this.username = '';
          this.regEmail = '';
          this.pass1 = '';
          this.pass2 = '';
          this.isLogin = true;
        }
      } catch (err: any) {
        const toast = await this.toastCtrl.create({
          message: 'Registrasi Gagal: ' + (err.message || err),
          duration: 4000,
        });
        toast.present();
      } finally {
        this.loading = false;
      }
    }
  }
}
