const express = require('express')
const router = express.Router();
const Petplace = require('../models/petplace');
const petplaces = require('../controllers/petplaces')

router.route('/')
      .get(petplaces.index)


router.route('/:id')
      .get(petplaces.showPetplace)

module.exports = router