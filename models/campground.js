const mongoose = require("mongoose");
const Review = require("./reviews")
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
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