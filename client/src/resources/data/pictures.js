import {inject} from 'aurelia-framework';
import {DataServices} from './data-services';


@inject(DataServices)
export class Pictures {

  constructor(data) {
    this.data = data;
    this.PICTURE_SERVICE = 'picture';
    this.picturesArray = [];
  }

  async getGalleryPictures(id) {
    let response = await this.data.get(this.PICTURE_SERVICE + "/gallery/" + id);
    if(!response.error && !response.message) {
      this.picturesArray = response;
    }
  }

  async deletePicture(id) {
    let response = await this.data.delete(this.PICTURE_SERVICE + "/" + id);
    if(!response.error) {
      for(let i = 0; i < this.picturesArray.length; i++) {
        if(this.picturesArray[i]._id === id){
          this.picturesArray.splice(i,1);
        }
      }
    }
  }

  async save(picture){
      if(picture){
          if(!picture._id){
              let response = await this.data.post(picture, this.PICTURE_SERVICE);
              if(!response.error){
                  this.picturesArray.push(response);
              }
              return response;
          } else {
              let response = await this.data.put(picture, this.PICTURE_SERVICE + "/" + picture._id);
              if(!response.error){
                   //this.updateArra(response);
              }
              return response;
          }

      }
  }
    async uploadFile(files, galleryId, pictureId){
      let formData = new FormData();

      files.forEach((item, index) => {
        formData.append("file" + index, item);
      });

      let response = await this.data.uploadFiles(formData, this.PICTURE_SERVICE + "/upload/" + galleryId + "/" + pictureId);
        return response;
      }
}
