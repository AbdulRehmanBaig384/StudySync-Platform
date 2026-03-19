import { ConnectMongoDb } from "./Config/db";
import { configDotenv } from "dotenv";
import express from express
configDotenv()
ConnectMongoDb()

const app=express()




