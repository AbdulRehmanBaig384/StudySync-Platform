import { ConnectMongoDb } from "./Config/db";
import { configDotenv } from "dotenv";
import express from express
configDotenv()
ConnectMongoDb()

const app=express()

app.get('/',(req,res)=>{
    res.send('hello from the server')
})


app.listen((process.env.PORT),()=>{
      console.log(`server is running at https://localhost/${process.env.PORT}`)
})



