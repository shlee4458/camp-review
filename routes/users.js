const express = require('express')
const router = express.Router();
const User = require('../models/users')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', async (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { // automatically login when the user registers
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to the Yish Camp!')
            res.redirect('/campgrounds')
        })
        req.flash('success', "Welcome to Yish Camp")
        res.redirect('/campgrounds')
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}))

router.get('/login', async (req, res) => {
    res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
})

router.get('/logout', async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', "Successfully logged out!")
        res.redirect('/campgrounds')
    })
})

module.exports = router