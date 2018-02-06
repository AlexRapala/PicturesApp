var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

//gallery can have many pictures
var PicturesSchema = new Schema({
  galleryId: { type: Object, required: true },
  picture: { type: String, required: true },
  description: { type: String, required: true },
  file: {
    fileName: String,
    originalName: String,
    dateUploaded: Date
  }
});

module.exports = Mongoose.model('Pics', PicturesSchema);
