var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

//user can have many galleries
var GallerySchema = new Schema({
  userId: { type: Object, required: true },
  gallery: { type: String, required: true },
  description: { type: String },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Gallery', GallerySchema);
