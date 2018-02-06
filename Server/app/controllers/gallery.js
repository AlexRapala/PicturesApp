var express = require('express'),
router = express.Router(),
logger = require('../../config/logger');
var mongoose = require('mongoose');
var Gallery = require('../models/gallery');

module.exports = function (app, config) {
  app.use('/api', router);

  router.get('/gallery/user/:userId', function(req, res, next){
    logger.log('Get Galleries ' + req.params.userId, 'verbose');
    Gallery.find({userId: req.params.userId})
    .then(gallery => {
      if(gallery){
        res.status(200).json(gallery);
      } else {
        res.status(404).json({message: "No Gallery"});
      }
    })
    .catch(error => {
      return next(error);
    });
  });

  router.post('/gallery', function (req, res, next) {
    logger.log('Create a Gallery', 'verbose');
    var gallery = new Gallery(req.body);
    gallery.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      return next(err);
    })
  });

  router.route('/gallery/:galleryId').put(function(req, res, next){
    logger.log('Update gallery', 'verbose');

    Gallery.findOneAndUpdate({_id: req.params.galleryId},
    req.body, {new:true, multi:false})
    .then(Gallery => {
      res.status(200).json(Gallery);
    })
    .catch(error => {
      return next(error);
    });
  });

  router.delete('/gallery/:galleryId', function(req, res, next){
    logger.log('Delete this Gallery', + req.params.galleryId,  'verbose');
    Gallery.remove({ _id: req.params.galleryId })
    .then(gallery => {
      res.status(200).json({message: "Gallery Deleted"});
    })
    .catch(error => {
      return next(error);
    });
  });
}
