const passport = require('passport')
const dotenv = require('dotenv').config
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('../mysql').pool;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    criarEmail(profile._json.email);
    return done(null, profile)
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

async function criarEmail(email, token) {
  var sql = `SELECT email FROM email WHERE email = ${mysql.escape(email)}`;
  mysql.query(sql, function (err, result) {
    if (result.length <= 0) {
      const query = `INSERT IGNORE INTO email (email) VALUES (${mysql.escape(email)})`
      mysql.query(query)
    };
  });
  return
}