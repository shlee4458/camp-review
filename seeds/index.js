const mongoose = require("mongoose")
const cities = require('./cities');
const { places, descriptors } = require('./seedhelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://seunghanlee44:Ctpkw4m7vuhjYXZH@atlascluster.ydxgqjg.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae omnis hic perspiciatis sequi. Ad saepe ipsam reiciendis necessitatibus earum? Voluptatem itaque alias dignissimos veniam nemo incidunt corrupti ipsam minima quis!',
            price: price,
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})