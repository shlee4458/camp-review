if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expresserror')
const {campgroundSchema, reviewSchema} = require('./schemas')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// establish database connection
const mongoose = require("mongoose")
const Campground = require('./models/campground');
const Review = require('./models/reviews')
const User = require('./models/users')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// set view
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('tiny'))

// session
const sessionConfig = {
    secret: "updatethis",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // the static method is included in the local mongoose plugin
passport.serializeUser(User.serializeUser()) // how to store the user in the session
passport.deserializeUser(User.deserializeUser()) // how to unstore the user in the session

app.use((req, res, next) => { // set up a middleware that stores the value from the flash
    res.locals.currentUser = req.user; // restores user data saved in the session
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// router
app.get('/fakeUser', async (req, res) => {
    const user = new User({email: "hello@naver.com", username: "hello"})
    const newUser = await User.register(user, "rlsEhRk") // included in the plugin
    res.send(newUser)
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})