const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Petplace = require('../models/petplace');
const petplaces = require('../controllers/petplaces')

router.route('/')
      .get(catchAsync(petplaces.index))
      .post(catchAsync(petplaces.createPetplace))

router.get('/new',petplaces.renderNewForm);

      
router.route('/:id')
      .get(catchAsync(petplaces.showPetplace))
      .put(catchAsync(petplaces.updatePetplace))
      .delete(catchAsync(petplaces.deletePetplace))

router.get('/:id/edit',catchAsync(petplaces.renderEditForm));



module.exports = router