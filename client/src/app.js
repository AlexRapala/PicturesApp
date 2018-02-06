import {AuthorizeStep} from 'aurelia-auth';

export class App {
  configureRouter(config, router) {
    this.router = router;
    config.map([
    {
      route:['','home'],
      moduleId: './modules/home',
      name: 'Home'
    },
    {
      route: 'list',
      moduleId: './modules/list',
      name: 'List',
      auth: true
    },
    {
      route: 'pictures',
      moduleId: './modules/pictures',
      name: 'pictures',
      auth: true
    },
    {
      route: 'singleImage',
      moduleId: './modules/singleImage',
      name: 'singleImage',
      auth: true
    }
  ]);
  }
}
