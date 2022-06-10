const router = require('express').Router();
const passport = require('passport');


router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/perfil',
  failureRedirect: '/failed'
}), (req, res) => {
  res.redirect('/perfil')
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session = null;
    res.redirect('/');
  });
})


module.exports = router;