const Petplace = require('../models/petplace')

module.exports.index = async (req, res) => {
    petplaces = await Petplace.find({})
    res.render('petplaces/index', {petplaces});
}


module.exports.renderNewForm = (req, res) => {
    res.render('petplaces/new');
}

module.exports.createPetplace = async (req, res, next) => {
    const petplace = new Petplace(req.body.petplace);
    petplace.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    petplace.author = req.user._id
    await petplace.save();
    res.redirect(`/petplaces/${petplace._id}`);

}


module.exports.showPetplace = async (req, res) => {
    const { id } = req.params;
    const petplace = await Petplace.findById(id)
    res.render('petplaces/show', { petplace });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const petplace = await Petplace.findById(id);
    if (!petplace) {
        return res.redirect('/petplaces')
    }
    res.render('petplaces/edit', { petplace });
}

module.exports.updatePetplace = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const petplace = await Petplace.findByIdAndUpdate(id, { ...req.body.petplace });
    await petplace.save()
    
    
    res.redirect(`/petplaces/${petplace._id}`);
}

module.exports.deletePetplace = async (req, res, next) => {
    const { id } = req.params
    await Petplace.findByIdAndDelete(id);
    
    res.redirect(`/petplaces`);
}