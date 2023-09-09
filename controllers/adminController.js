const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Insert New Employee
//@route POST /api/admin/register
//@access Private
const createNewUser = asyncHandler(async (req,res) => {
    const { employeeName, email, password, phoneNumber, aadharCard, birthDate, joiningDate, role, store } = req.body;


    if(!employeeName || !email || !password || !phoneNumber || !aadharCard || !birthDate || !joiningDate || !role || !store){
        return res.status(400).json({ message: 'All Fields Are Required' });
    }
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }, {aadharCard}] });

    if (existingUser) {
      res.status(400);
      throw new Error("User Already Exists");
    }

    if(!["store_manager","chef","employee"].includes(role)){
        res.status(400);
        throw new Error("Invalid Role");
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    if(!hashedPassword) {
        res.status(400);
        throw new Error("Failed Hashing");
    }

    // Create a new user instance
    const newUser = new User({
      employeeName,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      aadharCard,
      birthDate: new Date(birthDate), // Convert birthDate to a Date object
      joiningDate: new Date(joiningDate), 
      store,
    });

    // Save the new user to the database
    try {
        await newUser.save();
        res.status(200).json({newUser: newUser.employeeName})
    } catch (error) {
        
    }
})

//@desc Admin Update Password
//@route PUT /api/admin/edit/password
//@access Private
const adminChangePassword = asyncHandler(async (req, res) => {
    const {userId, password, newPassword, confirmPassword} = req.body;

    if (!userId || !password || !newPassword || !confirmPassword){
        res.status(400);
        throw new Error("All fields not provided");
    }

    if(newPassword !== confirmPassword){
        res.status(400);
        throw new Error("Password And Confirmed Password must be same");
    }

    const user = await User.findOne({userId:userId});

    if(!user){
        res.status(400);
        throw new Error("User Not Registered");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
        const hashPassword = await bcrypt.hash(newPassword, 10);

        if(!hashPassword){
            res.status(400).json({message:"Password Hashing Failed"});
        }

        user.password = hashPassword;

        await user.save();
        res.status(200).json({message:"Password Changed"});
    }
    else{
        res.status(400);
        throw new Error("Wrong Password");
    }

});

//@desc Update Email
//@route PUT /api/admin/edit/email
//@access Private
const adminChangeEmail = asyncHandler(async (req, res) => {
    const {oldEmail, newEmail} = req.body;

    const user = await User.findOne({email:oldEmail});

    if(!user){
        res.status(400);
        throw new Error("User Not Registered");
    }

    const otherUser = await User.findOne({newEmail});

    if(otherUser){
        res.status(400)
        throw new Error("Email Already Used")
    }

    user.email = newEmail;

    await user.save();

    res.status(200).json({email:newEmail});
});

//@desc Get User Details
//@route GET /api/users/userinf0
//@access Private
const adminGetUserDetails = asyncHandler(async (req,res) => {
    const eid = req.params["id"]
    const user = await User.findOne({employeeId:eid });

    if(!user){
        res.status(404);
        throw new Error("User Not Found");
    }

    res.status(200).json(user)
});

//@desc Get User Details
//@route GET /api/users/userinf0
//@access Private
const adminGetAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find({});

    if(!users){
        res.status(404);
        throw new Error("User Not Found");
    }

    res.status(200).json(users)
});
module.exports = { createNewUser, adminChangePassword, adminChangeEmail, adminGetAllUsers, adminGetUserDetails}