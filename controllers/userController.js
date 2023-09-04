const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Creating New User
//@route POST /api/users/register
//@access Public
const createNewUser = asyncHandler(async (req,res)=>{
    const {userName, email, password} = req.body;
    if (!userName || !email || !password){
        res.status(400);
        throw new Error("All fields not provided");
    }

    const existing = await User.findOne({email});
    if (existing) {
        res.status(400);
        throw new Error("Email Already Used");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if(!hashPassword){
        res.status(400).json({message:"Password Hashing Failed"});
        throw new Error("Password Hashing Failed");
    }

    const newUser = await User.create({
        userName,
        email,
        password:hashPassword,
    });



    if(!newUser) {
        res.status(401).json({message:"Registration Failed"});
        throw new Error("Registration failed");
    }

    res.status(201).json({
        uid:newUser.userName,
        email:newUser.email,
        role:newUser.role,
        avatar:newUser.avatar})
    // sendJwtCookie(newUser, 201, res)
    
});

//@desc Login User
//@route GET /api/users/
//@access Public
const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;

    if ( !email || !password){
        console.log("No email");
        res.status(400);
        throw new Error("All fields not provided");
    }

    const user = await User.findOne({email});

    if(!user){
        console.log("No User");
        res.status(400);
        throw new Error("User Not Registered");
    }

    const valid = await bcrypt.compare(password, user.password);


    if ( valid) {
        sendJwtCookie(user, 200, res)
    }
    else{
        console.log("Wrong Password");
        res.status(400);
        throw new Error("Wrong Username Or Password");
    }

});

//@desc LogOutUser
//@route GET /api/users/logout
//@access Public
const logOutUser = asyncHandler(async (req,res)=>{
    res.cookie("token", null, {
        expire:new Date(Date.now()),
        httpOnly:true
    });
    res.status(201).json({message:"Logged Out"});
});

//@desc Get User Details
//@route GET /api/users/inf0
//@access Private
const getUserDetails = asyncHandler(async (req,res) => {
    const user = await User.findOne({email:req.user["email"]});

    user.password = "";

    if(!user){
        res.status(404);
        throw new Error("User Not Found");
    }

    res.status(200).json(user)
});


//@desc Update Password
//@route PUT /api/users/edit/password
//@access Private
const changePassword = asyncHandler(async (req, res) => {
    const {password, newPassword, confirmPassword} = req.body;

    if (!password || !newPassword || !confirmPassword){
        res.status(400);
        throw new Error("All fields not provided");
    }

    if(newPassword !== confirmPassword){
        res.status(400);
        throw new Error("Password And Confirmed Password must be same");
    }

    const user = await User.findOne({email:req.user.email});

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


//@desc Update Avatar
//@route PUT /api/users/edit/
//@access Private
const changeAvatar = asyncHandler(async (req, res) => {
    console.log("Changing Avatar");
    const avatar = {
        public_id:"Demo Id Updated",
        url:"Test Url"
    };

    const user = await User.findOne({email:req.user.email});

    if(!user){
        res.status(400);
        throw new Error("User Not Registered");
    }

    user.avatar = avatar;

    await user.save();

    res.status(200).json({avatar:user.avatar});
});


//@desc Update UserId
//@route PUT /api/users/edit/userid
//@access Private
const changeUserName = asyncHandler(async (req, res) => {
    const {userName} = req.body;

    const user = await User.findOne({email:req.user.email});

    if(!user){
        res.status(400);
        throw new Error("User Not Registered");
    }

    user.userName = userName;

    await user.save();

    res.status(200).json({userName:user.userName});
});


//@desc Update Email
//@route PUT /api/users/edit/email
//@access Private
const changeEmail = asyncHandler(async (req, res) => {
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

module.exports = {createNewUser, loginUser ,logOutUser, getUserDetails, changeEmail, changePassword, changeUserName, changeAvatar}




//Function to send token as cookie
const sendJwtCookie = async (user, status, res) => {

    const token = await jwt.sign({
        user:{
            uid:user.id,
            email:user.email,
            role:user.role}
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});

    const options = {
        expire:new Date(Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000),
        httpOnly:true
    }

    res.status(status).cookie("token", token, options).json({
        token:token, userCred:{
        uid:user._id,
        email:user.email,
        role:user.role,}
    }); 
}
