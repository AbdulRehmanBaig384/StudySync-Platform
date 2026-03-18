import mongoose from "mongoose";

const UserSchema=mongoose.Schema({

    Firstname:{
     typeof:String,
     require:true
    },
    lastname:{
        typeof:String,
        require:true
    },

    email:{
        typeof:'string',
        unique:true,
        require:true,
    },
    password:{
        typeof:String,
        unique:true,
        require:true,
    }

})

 export default {UserSchema}