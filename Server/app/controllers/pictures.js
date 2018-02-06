var express = require('express'),
router = express.Router(),
logger = require('../../config/logger');
var mongoose = require('mongoose');
var Picture = require('../models/pictures');
var multer = require('multer');
var mkdirp = require('mkdirp');

module.exports = function (app, config) {
  app.use('/api', router);

  //makes folder if the path does not exist
  //then adds file uploaded to the correct gallery
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var path = config.uploads + req.params.galleryId + "/";
      mkdirp(path, function(err) {
        if(err){
          res.status(500).json(err);
        } else {
          cb(null, path);
        }
      });
    },
    fileName: function (req, file, cb) {
      var fileName = file.originalname.split('.');
      console.log(fileName);
      cb(null, fileName[0] + new Date().getTime() + "." + fileName[fileName.length - 1]);
    }
  });

  var upload = multer({ storage: storage });

  router.post('/picture/upload/:galleryId/:pictureId', upload.any(), function(req, res, next){
      logger.log('Upload a picture ' + req.params.pictureId + ' and ' + req.params.galleryId, 'verbose');

      Picture.findById(req.params.pictureId, function(err, picture){
          if(err){
              return next(err);
          } else {
              if(req.files){
                  picture.file = {
                      fileName : req.files[0].filename,
                      originalName : req.files[0].originalname,
                      dateUploaded : new Date()
                  };
              }
              picture.save()
                  .then(picture => {
                      res.status(200).json(picture);
                  })
                  .catch(error => {
                      return next(error);
                  });
          }
      });

  });

  router.get('/picture/gallery/:galleryId', function(req, res, next){
    logger.log('Get Pictures in a Gallery ' + req.params.galleryId, 'verbose');
    Picture.find({galleryId: req.params.galleryId})
    .then(pictures => {
      if(pictures){
        res.status(200).json(pictures);
      } else {
        res.status(404).json({message: "No Pictures"});
      }
    })
    .catch(error => {
      return next(error);
    });
  });

  router.post('/picture', function (req, res, next) {
    logger.log('Add a picture to a gallery', 'verbose');
    var picture = new Picture(req.body);
    picture.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      return next(err);
    })
  });

  router.route('/picture/:pictureId').put(function(req, res, next){
    logger.log('Update picture', 'verbose');

    Picture.findOneAndUpdate({_id: req.params.pictureId},
    req.body, {new:true, multi:false})
    .then(Picture => {
      res.status(200).json(Picture);
    })
    .catch(error => {
      return next(error);
    });
  });

  router.delete('/picture/:pictureId', function(req, res, next){
    logger.log('Delete this Picture', + req.params.pictureId,  'verbose');
    Picture.remove({ _id: req.params.pictureId })
    .then(picture => {
      res.status(200).json({message: "Picture Deleted"});
    })
    .catch(error => {
      return next(error);
    });
  });
}
