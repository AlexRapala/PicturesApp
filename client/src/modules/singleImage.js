import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';

@inject(Router, AuthService)
export class SingleImage {
  constructor(router, auth) {
    this.router = router;
    this.auth = auth;
    this.picture = JSON.parse(sessionStorage.getItem('picture'));
    this.message = this.picture.file.originalName;
  }

  back() {
    this.router.navigate('pictures');
  }

  logout() {
    this.router.navigate('home');
  }
}
