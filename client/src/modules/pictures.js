import {inject} from 'aurelia-framework';
import {Pictures} from '../resources/data/pictures';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';

@inject(Router, AuthService, Pictures)
export class PicturesGallery {
  constructor(router, auth, picture) {
    this.picture = picture;
    this.router = router;
    this.auth = auth;
    this.gallery = JSON.parse(sessionStorage.getItem('gallery'));
    this.message = "Pictures in Gallery: " + this.gallery.gallery;
    this.showList = true;
  }

  async activate() {
    await this.picture.getGalleryPictures(this.gallery._id);
  }

  //set a session to view the single image clicked on
  viewPicture(picture) {
    sessionStorage.setItem('picture', JSON.stringify(picture));
    this.router.navigate('singleImage');
  }

  addPicture() {
    this.pictureObj = {
      galleryId: this.gallery._id,
      picture: '',
      description: ''
    };
    this.showList = false;
  }

  editPicture(picture) {
    this.pictureObj = picture;
    this.showList = false;
  }

  deletePicture(picture) {
    this.picture.deletePicture(picture._id);
  }

  back() {
    this.showList = true;
  }

  backToGalleries() {
    this.router.navigate('list');
  }

  changeFiles(){
    this.filesToUpload = new Array();
    this.filesToUpload.push(this.files[0]);
  }

  removeFile(index){
    this.filesToUpload.splice(index,1);
  }

  async savePicture() {
    if(this.pictureObj) {
      let response = await this.picture.save(this.pictureObj);
      if(response.error) {
        alert("There was an error saving the picture");
      }
      else {
        var pictureId = response._id;
        if(this.filesToUpload && this.filesToUpload.length){
          await this.picture.uploadFile(this.filesToUpload, this.gallery._id, pictureId);
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
