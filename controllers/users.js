const User = require('../models/users')

module.exports.renderRegister = async (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { // automatically login when the user registers
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to the Yish Camp!')
            return res.redirect('/campgrounds')
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = async (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

module.exports.logout = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', "Successfully logged out!")
        res.redirect('/campgrounds')
    })
}