import { ConnectMongoDb } from "./Config/db";
import { configDotenv } from "dotenv";
import express from express
import passport from "passport";
import session from "express-session";
import GoogleStrategy from 'passport-google-oauth2'
configDotenv()
ConnectMongoDb()

const app=express()

app.use(session({
  secret:'StudySync_Secret',
  resave:false,
  saveUninitialized:false
}))
app.get('/studysync',(req,res)=>{
    res.send('hello from the server')
})

app.get('/auth/google',(req,res)=>{
    passport.authenticate('google',{scope:['email','profile']})
})

app.get('/auth/google/callback',(req,res)=>{
    
})


app.listen((process.env.PORT),()=>{
      console.log(`server is running at https://localhost/${process.env.PORT}`)
})



