import { ConnectMongoDb } from "./Config/db.js";
import { configDotenv } from "dotenv";
import express from 'express'
import passport from "passport";
import session from "express-session";
import GoogleStrategy from 'passport-google-oauth2'
configDotenv()
ConnectMongoDb()

const app = express()

app.use(session({
  secret: 'StudySync_Secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://localhost:3000/auth/google/callback'

},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    })
  }
))
app.get('/studysync', (req, res) => {
  res.send('hello from the server')
})

app.get('/auth/google', (req, res) => {
  passport.authenticate('google', { scope: ['email', 'profile'] })
})

app.get('/auth/google/callback', (req, res) => {

})


app.listen((process.env.PORT), () => {
  console.log(`server is running at https://localhost/${process.env.PORT}`)
})






