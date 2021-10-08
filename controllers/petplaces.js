const Petplace = require('../models/petplace')

module.exports.index = async (req, res) => {
    const petplaces = await Petplace.find({})
    res.render('petplaces/index', {petplaces});
}

module.exports.showPetplace = async (req, res) => {
    const { id } = req.params;
    const petplace = await Petplace.findById(id)
    if (!petplace) {
        
        return req.send('Cannot find that petplace')
    }
    res.render('petplaces/show', { petplace });
}