import User from '../models/UserData.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      university, 
      yearOfStudy, 
      subject, 
      studyTime,
      facultyOfStudy,
      department
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      Firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      University_Name: university,
      Year_of_Study: parseInt(yearOfStudy),
      Preferred_Subjects: subject, // assuming it's an array from frontend
      Preferred_Study_Time: studyTime,
      facultyOfStudy: facultyOfStudy || '',
      department: department || ''
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: `${user.Firstname} ${user.lastname}`,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: `${user.Firstname} ${user.lastname}`,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'StudySync_Secret_JWT', {
    expiresIn: '30d',
  });
};

// @desc    Auth user with Google
// @route   POST /api/users/google-login
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name, family_name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new Google User
      user = await User.create({
        Firstname: given_name,
        lastname: family_name || '',
        email,
        googleId,
        profilePicture: picture,
        profileCompleted: false
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account
      user.googleId = googleId;
      user.profilePicture = user.profilePicture || picture;
      await user.save();
    }

    res.json({
      _id: user.id,
      name: `${user.Firstname} ${user.lastname}`,
      email: user.email,
      profileCompleted: user.profileCompleted,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

// @desc    Complete User Profile
// @route   PUT /api/users/complete-profile
// @access  Public (in real app should be private)
export const completeProfile = async (req, res) => {
  try {
    const { email, university, yearOfStudy, subject, studyTime, facultyOfStudy, department } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.University_Name = university;
    user.Year_of_Study = parseInt(yearOfStudy);
    user.Preferred_Subjects = subject;
    user.Preferred_Study_Time = studyTime;
    user.facultyOfStudy = facultyOfStudy;
    user.department = department;
    user.profileCompleted = true;

    await user.save();

    res.json({
      _id: user.id,
      name: `${user.Firstname} ${user.lastname}`,
      email: user.email,
      profileCompleted: user.profileCompleted,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Complete Profile Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update Study Time and Streaks
// @route   PUT /api/users/update-study-time
// @access  Public (in real app should be private)
export const updateStudyTime = async (req, res) => {
  try {
    const { email, sessionSeconds } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sessionHours = sessionSeconds / 3600;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (lastStudyDate) {
      lastStudyDate = new Date(lastStudyDate.getFullYear(), lastStudyDate.getMonth(), lastStudyDate.getDate());
    }

    if (!lastStudyDate || lastStudyDate < today) {
      // It's a new day! Check streak
      if (lastStudyDate) {
        const diffTime = Math.abs(today - lastStudyDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays === 1) {
          // If they met their goal yesterday, increase streak
          if (user.todayStudyHours >= user.dailyGoal) {
            user.currentStreak += 1;
            if (user.currentStreak > user.longestStreak) {
              user.longestStreak = user.currentStreak;
            }
          } else {
            // Didn't meet goal, reset streak
            user.currentStreak = 0;
          }
        } else if (diffDays > 1) {
          // Missed more than 1 day, reset streak
          user.currentStreak = 0;
        }
      }
      // Reset today's hours for the new day
      user.todayStudyHours = 0;
    }

    // Add hours
    user.todayStudyHours += sessionHours;
    user.totalStudyHours += sessionHours;
    user.lastStudyDate = now;

    // Fast check for goal completion exactly in this session
    if (user.todayStudyHours >= user.dailyGoal && user.currentStreak === 0 && !lastStudyDate) {
      // If they just started and met goal today
      user.currentStreak = 1;
      if (user.currentStreak > user.longestStreak) {
         user.longestStreak = user.currentStreak;
      }
    } else if (user.todayStudyHours >= user.dailyGoal && user.currentStreak === 0 && lastStudyDate && lastStudyDate.getTime() === today.getTime()) {
      // Recovering streak if goal met today
      // This is a simplified logic. If they hit goal today, they effectively have a 1-day streak
      // However, a true streak calculation only increases when the day rolls over. 
      // For immediate UI feedback, we can bump currentStreak here if it was 0.
      user.currentStreak = 1;
      if (user.currentStreak > user.longestStreak) {
         user.longestStreak = user.currentStreak;
      }
    }

    // Update or push today's history
    const dateString = today.toISOString().split('T')[0];
    const historyIndex = user.studyHistory.findIndex(h => h.date === dateString);
    if (historyIndex >= 0) {
      user.studyHistory[historyIndex].hours = user.todayStudyHours;
      user.studyHistory[historyIndex].goalMet = user.todayStudyHours >= user.dailyGoal;
    } else {
      user.studyHistory.push({
        date: dateString,
        hours: user.todayStudyHours,
        goalMet: user.todayStudyHours >= user.dailyGoal
      });
    }

    await user.save();

    res.json({
      todayStudyHours: user.todayStudyHours,
      totalStudyHours: user.totalStudyHours,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dailyGoal: user.dailyGoal,
      studyHistory: user.studyHistory
    });

  } catch (error) {
    console.error("Update Study Time Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Study Stats
// @route   GET /api/users/study-stats
// @access  Public (in real app should be private)
export const getStudyStats = async (req, res) => {
  try {
    const { email } = req.query; // Send email as query param

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      todayStudyHours: user.todayStudyHours,
      totalStudyHours: user.totalStudyHours,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      dailyGoal: user.dailyGoal,
      studyHistory: user.studyHistory
    });
  } catch (error) {
    console.error("Get Study Stats Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Public (in real app should be private)
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get potential study partners
// @route   GET /api/users/partners
// @access  Public (in real app should be private)
export const getStudyPartners = async (req, res) => {
  try {
    const { userId, department, facultyOfStudy, preferredSubjects, semester } = req.query;

    console.log("Fetching partners for userId:", userId);
    console.log("Filters - Dept:", department, "Faculty:", facultyOfStudy);

    if (!department) {
      return res.status(400).json({ message: 'Department is required for filtering' });
    }

    const subjectsArray = Array.isArray(preferredSubjects) ? preferredSubjects : (preferredSubjects ? [preferredSubjects] : []);

    // Escape regex special characters in department name
    const escapedDept = department.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const matchQuery = {
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      // profileCompleted: true, // Commented out by user
      department: { $regex: new RegExp(`^${escapedDept}$`, 'i') } 
    };

    if (semester) {
      matchQuery.Year_of_Study = parseInt(semester);
    }

    const partners = await User.aggregate([
      {
        $match: matchQuery
      },
      // Join with invitations where current user is sender
      {
        $lookup: {
          from: 'invitations',
          let: { partnerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$receiver', '$$partnerId'] }
                  ]
                }
              }
            }
          ],
          as: 'outgoingInvitation'
        }
      },
      // Join with invitations where current user is receiver
      {
        $lookup: {
          from: 'invitations',
          let: { partnerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$sender', '$$partnerId'] }
                  ]
                }
              }
            }
          ],
          as: 'incomingInvitation'
        }
      },
      {
        $addFields: {
          invitation: {
            $cond: {
              if: { $gt: [{ $size: '$outgoingInvitation' }, 0] },
              then: { $arrayElemAt: ['$outgoingInvitation', 0] },
              else: {
                $cond: {
                  if: { $gt: [{ $size: '$incomingInvitation' }, 0] },
                  then: { $arrayElemAt: ['$incomingInvitation', 0] },
                  else: null
                }
              }
            }
          }
        }
      },
      // Filtering Rules:
      // Show users ONLY if: No invitation exists OR invitationStatus === "rejected"
      // Hide users if: invitationStatus === "accepted" or "pending"
      {
        $match: {
          $or: [
            { invitation: null },
            { 'invitation.status': 'rejected' }
          ]
        }
      },
      {
        $addFields: {
          matchLevel: {
            $switch: {
              branches: [
                {
                  // HIGH MATCH: Same department + same preferred subject
                  case: {
                    $gt: [
                      { $size: { $setIntersection: ["$Preferred_Subjects", subjectsArray] } },
                      0
                    ]
                  },
                  then: "HIGH"
                },
                {
                  // MEDIUM MATCH: Same department + same facultyOfStudy
                  case: { $eq: ["$facultyOfStudy", facultyOfStudy] },
                  then: "MEDIUM"
                }
              ],
              default: "LOW"
            }
          },
          matchScore: {
            $switch: {
              branches: [
                {
                  case: {
                    $gt: [
                      { $size: { $setIntersection: ["$Preferred_Subjects", subjectsArray] } },
                      0
                    ]
                  },
                  then: 3
                },
                {
                  case: { $eq: ["$facultyOfStudy", facultyOfStudy] },
                  then: 2
                }
              ],
              default: 1
            }
          }
        }
      },
      { $sort: { matchScore: -1, Firstname: 1 } }
    ]);
    
    console.log(`Found ${partners.length} partners`);
    res.json(partners);

  } catch (error) {
    console.error("Get Partners Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
