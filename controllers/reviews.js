const Review = require('../models/review')
const Petplace = require('../models/petplace');


module.exports.createReview = async(req, res, next) => {
    const {id} = req.params;
    petplace = await Petplace.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    petplace.reviews.push(review)
    await review.save()
    await petplace.save()
    req.flash('success', 'Отзыв добавлен!')
    res.redirect(`/petplaces/${petplace._id}`)
}
module.exports.deleteReview = async(req,res,next) => {
    const{reviewId, id} = req.params
    await Petplace.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Отзыв удален!')
    res.redirect(`/petplaces/${id}`)
}