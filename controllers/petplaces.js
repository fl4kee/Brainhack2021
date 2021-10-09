const axios = require('axios')
const Petplace = require('../models/petplace')
const {cloudinary} = require("../cloudinary")

module.exports.index = async (req, res) => {
    petplaces = await Petplace.find({})
    res.render('petplaces/index', {petplaces});
}

module.exports.getFilteredJsonPetplaces = async (req, res) => {
    let {location} = req.body
    console.log(req.body)
    let petplaces = ''
    if(!location){
        petplaces = await Petplace.find({})
    }else{
        petplaces = await Petplace.find({location: { $regex: '.*' + location + '.*'}})
    }
    res.json(petplaces)
}

module.exports.renderNewForm = (req, res) => {
    res.render('petplaces/new');
}

module.exports.createPetplace = async (req, res, next) => {
    const petplace = new Petplace(req.body.petplace);
    petplace.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    petplace.author = req.user._id
    await petplace.save();
    req.flash('success', 'Поздравляю, вы зооняня!')
    res.redirect(`/petplaces/${petplace._id}`);

}

module.exports.showPetplace = async (req, res) => {
    const { id } = req.params;
    const petplace = await Petplace.findById(id).populate({ 
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate("author");
    if (!petplace) {
        req.flash('error', 'Нет зоонянь по вашему запросу')
        return res.redirect('/petplaces')
    }
    res.render('petplaces/show', { petplace });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const petplace = await Petplace.findById(id);
    if (!petplace) {
        req.flash('error', 'Нет зоонянь по вашему запросу')
        return res.redirect('/petplaces')
    }
    res.render('petplaces/edit', { petplace });
}

module.exports.updatePetplace = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const images = req.files.map(f => ({filename: f.filename, url: f.path}))
    const petplace = await Petplace.findByIdAndUpdate(id, { ...req.body.petplace });
    petplace.images.push(...images)
    await petplace.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await petplace.updateOne({$pull:{images: {filename: {$in: req.body.deleteImages}}}})

    }
    req.flash('success', 'Успешно обновлено!')
    res.redirect(`/petplaces/${petplace._id}`);
}

module.exports.deletePetplace = async (req, res, next) => {
    const { id } = req.params
    await Petplace.findByIdAndDelete(id);
    req.flash('success', 'Успешно удалено!')
    res.redirect(`/petplaces`);
}