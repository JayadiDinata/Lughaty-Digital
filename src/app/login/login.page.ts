import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupabaseService, UserData } from '../supabase.service';
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

  ngOnInit() {
    const { savedEmail } = this.supabase.loadSession();
    if (savedEmail) {
      this.email = savedEmail;
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
