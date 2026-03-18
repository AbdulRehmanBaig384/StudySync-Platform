import mongoose from "mongoose";
import {UserSchema} from './models/UserData'
import { ConnectMongoDb } from "./Config/db";
import { configDotenv } from "dotenv";

configDotenv()

ConnectMongoDb()





