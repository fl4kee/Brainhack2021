const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validatePetplace } = require('../middleware')
const Petplace = require('../models/petplace');
const petplaces = require('../controllers/petplaces')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer( {storage} )

router.route('/')
      .get(catchAsync(petplaces.index))
      .post(isLoggedIn, upload.array('image'), validatePetplace, catchAsync(petplaces.createPetplace))


router.route('/search')
      .post(catchAsync(petplaces.indexSearch), catchAsync(petplaces.getFilteredJsonPetplaces))

router.get('/new', isLoggedIn, petplaces.renderNewForm);

router.route('/api/filter')
      .get(catchAsync(petplaces.getFilteredJsonPetplaces))
      .post(catchAsync(petplaces.getFilteredJsonPetplaces))

      
router.route('/:id')
      .get(catchAsync(petplaces.showPetplace))
      .put(isLoggedIn, isAuthor, upload.array('image'), validatePetplace, catchAsync(petplaces.updatePetplace))
      .delete(isLoggedIn, isAuthor, catchAsync(petplaces.deletePetplace))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(petplaces.renderEditForm));



module.exports = router