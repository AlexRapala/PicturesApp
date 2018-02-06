import {inject} from 'aurelia-framework';
import {Galleries} from '../resources/data/galleries';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';

@inject(Router, AuthService, Galleries)
export class List {
  constructor(router, auth, galleries) {
    this.galleries = galleries;
    this.router = router;
    this.auth = auth;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    this.message = "Galleries";
    this.showList = true;
    this.showCompleted = false;
  }

  async activate() {
    await this.galleries.getUserGalleries(this.user._id);
  }

  createGallery() {
    this.galleryObj = {
      gallery: "",
      description: "",
      userId: this.user._id,
    }
    this.showList = false;
  }

  editGallery(gallery) {
    this.galleryObj = gallery;
    this.showList = false;
  }

  deleteGallery(gallery) {
    this.galleries.deleteGallery(gallery._id);
  }

  //save gallery to session, to view single gallery
  viewGallery(gallery) {
    sessionStorage.setItem('gallery', JSON.stringify(gallery));
    this.router.navigate('pictures');
  }

  back() {
    this.showList = true;
  }

  changeFiles(){
    this.filesToUpload = new Array();
    this.filesToUpload.push(this.files[0]);
  }

  removeFile(index){
    this.filesToUpload.splice(index,1);
  }

  async saveGallery() {
    if(this.galleryObj) {
      let response = await this.galleries.save(this.galleryObj);
      if(response.error) {
        alert("There was an error creating the Gallery");
      }
      else {
        var galleryId = response._id;
               if(this.filesToUpload && this.filesToUpload.length){
                   await this.galleries.uploadFile(this.filesToUpload, this.user._id, galleryId);
                   this.filesToUpload = [];
      }
    }
      this.showList = true;
    }
  }

  logout() {
    this.router.navigate('home');
  }
}
