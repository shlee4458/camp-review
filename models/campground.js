const mongoose = require("mongoose");
const Review = require("./reviews")
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

// middleware that is called everytime findoneanddelete is called
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews // for each item in review, iterate over the doc.reviews and check if the id is in the reviews
            }
        })
    }

})

module.exports = mongoose.model("Campground", CampgroundSchema)