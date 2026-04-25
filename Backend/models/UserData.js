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
        type: String, // Optional for Google users
    },
    University_Name: {
        type: String,
        default: ''
    },
    Year_of_Study: {
        type: Number,
    },
    Preferred_Subjects: {
        type: [String],
        default: [],
    },
    Preferred_Study_Time: {
        type: String,
        default: ''
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    profilePicture: {
        type: String
    },
    totalStudyHours: {
        type: Number,
        default: 0
    },
    todayStudyHours: {
        type: Number,
        default: 0
    },
    dailyGoal: {
        type: Number,
        default: 3 // Default 3 hours
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastStudyDate: {
        type: Date
    },
    studyHistory: [{
        date: String,
        hours: Number,
        goalMet: Boolean
    }],
    department: {
        type: String,
        default: ''
    },
    facultyOfStudy: {
        type: String,
        default: ''
    },
    onlineStatus: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    }
})

export default mongoose.model('User', UserSchema);