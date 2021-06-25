// Protecting routes
// If logged in do not show login page, if not logged in do not allow dashboard access

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next();
        }
    }
};