import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    Firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    University_Name: {
        type: String,
        required: true,
        default: ''
    },
    Year_of_Study: {
        type: Number,
        required: true,
    },
    Preferred_Subjects: {
        type: [String],
        required: true,
        default: [],
    },
    Preferred_Study_Time: {
        type: String,
        required: true,
        default: ''
    }
})

export default mongoose.model('User', UserSchema);