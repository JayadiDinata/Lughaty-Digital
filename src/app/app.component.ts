import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { addIcons } from 'ionicons';
import {
  headsetOutline, chatbubblesOutline, home, helpCircleOutline, createOutline,
  logOutOutline, menuOutline, informationCircleOutline, chevronUpOutline,
  chevronDownOutline, codeSlashOutline, serverOutline, phonePortraitOutline,
  flameOutline, checkmarkCircle, closeCircle, radioButtonOffOutline, homeOutline,
  play, pause, stop, arrowUpOutline, swapHorizontalOutline, searchOutline,
  hourglassOutline, refreshOutline, alertCircleOutline, arrowForwardOutline,
  moonOutline, sunnyOutline, eyeOutline, eyeOffOutline, schoolOutline, timeOutline,
  bookmarksOutline, languageOutline, bulbOutline, megaphoneOutline, accessibilityOutline,
  heartOutline, trophyOutline, shuffleOutline, videocamOffOutline, personOutline,
  bookOutline, globeOutline, trendingUpOutline, earthOutline, flagOutline, starOutline,
  locationOutline, peopleOutline, businessOutline, libraryOutline, cloudOutline,
  chevronForwardOutline, chevronBackOutline, pencilOutline, backspaceOutline, playForwardOutline,
  volumeHighOutline, playSkipBackOutline, playSkipForwardOutline, stopOutline
} from 'ionicons/icons';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public router: Router,
    private animatonCtrl: AnimationController
  ) {
    addIcons({
      headsetOutline, chatbubblesOutline, home, helpCircleOutline, createOutline,
      logOutOutline, menuOutline, informationCircleOutline, chevronUpOutline,
      chevronDownOutline, codeSlashOutline, serverOutline, phonePortraitOutline,
      flameOutline, checkmarkCircle, closeCircle, radioButtonOffOutline, homeOutline,
      play, pause, stop, arrowUpOutline, swapHorizontalOutline, searchOutline,
      hourglassOutline, refreshOutline, alertCircleOutline, arrowForwardOutline,
      moonOutline, sunnyOutline, eyeOutline, eyeOffOutline, schoolOutline, timeOutline,
      bookmarksOutline, languageOutline, bulbOutline, megaphoneOutline, accessibilityOutline,
      heartOutline, trophyOutline, shuffleOutline, videocamOffOutline, personOutline,
      bookOutline, globeOutline, trendingUpOutline, earthOutline, flagOutline, starOutline,
      locationOutline, peopleOutline, businessOutline, libraryOutline, cloudOutline,
      chevronForwardOutline, chevronBackOutline, pencilOutline, backspaceOutline, playForwardOutline,
      volumeHighOutline, playSkipBackOutline, playSkipForwardOutline, stopOutline
    });
    this.initializeApp();
  }
  myCustomPageTransition = (baseEl: any, opts?: any) => {
    console.log('opts.enteringEl:' + opts.enteringEl);
    console.log('opts.leavingEl:' + opts.leavingEl);
    var anim1 = this.animatonCtrl
      .create()
      .addElement(opts.leavingEl)
      .duration(2000)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '1', '0.0');
    var anim2 = this.animatonCtrl
      .create()
      .addElement(opts.enteringEl)
      .duration(2000)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '0.0', '1');
    var parentAnim = this.animatonCtrl
      .create()
      .duration(2000)
      .iterations(1)
      .addAnimation([anim1, anim2]);
    return parentAnim;
  };
  initializeApp() {
    this.router.navigateByUrl('/splash');
  }
}
