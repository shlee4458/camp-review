const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, catchAsync(campgrounds.renderEditForm))

module.exports = router;