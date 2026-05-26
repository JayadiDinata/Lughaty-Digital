import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  fadeOut: boolean = false;

  constructor(
    public router: Router,
    private supabase: SupabaseService,
  ) {}

  ngOnInit() {
    setTimeout(() => { this.fadeOut = true; }, 2500);

    const { user } = this.supabase.loadSession();
    if (user) {
      this.supabase.setCurrentUser(user);
      setTimeout(() => {
        this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
      }, 3200);
    } else {
      setTimeout(() => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }, 3200);
    }
  }
}
