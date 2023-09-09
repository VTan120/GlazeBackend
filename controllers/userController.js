const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        user = await User.findOne({employeeId:email});
    }

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
const refreshAccessToken = asyncHandler(async (req,res)=>{
    const token = req.cookies.refresh_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if(err){
          console.log(err);
          res.status(400);
          throw new Error("Authentication Failed");
        }

      sendNewAccessToken(req, res, next, decoded)
    });
  } catch {
    return res.sendStatus(403);
  }
    res.status(201).json({message:"Logged Out"});
});

//@desc LogOutUser
//@route GET /api/users/logout
//@access Public
const logOutUser = asyncHandler(async (req,res)=>{
    res.cookie("refresh_token", null, {
        expire:new Date(Date.now()),
        httpOnly:true
    });
    res.status(201).json({message:"Logged Out"});
});

//@desc Get User Details
//@route GET /api/users/userinf0
//@access Private
const getUserDetails = asyncHandler(async (req,res) => {
    const user = await User.findOne({email:req.user["email"]});

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

module.exports = { loginUser ,logOutUser, getUserDetails, changePassword, changeUserName, changeAvatar, refreshAccessToken}




//Function to send token as cookie
const sendJwtCookie = async (user, status, res) => {

    const access_token = await jwt.sign({
        user:{
            uid:user.id,
            email:user.email,
            role:user.role}
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});

    const refresh_token = await jwt.sign({
        user:{
            uid:user.id,
            email:user.email,
            role:user.role}
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1d"});

    const options = {
        expire:new Date(Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000),
        samesite: 'lax',
        httpOnly:true
    }

    res.status(status).cookie("refresh_token", refresh_token, options).json({
        access_token:access_token, userCred:{
        uid:user._id,
        email:user.email,
        role:user.role,}
    }); 
}

const sendNewAccessToken = async (req, res, next, user) => {

    const access_token = await jwt.sign({
        user:{
            uid:user.id,
            email:user.email,
            role:user.role}
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});

    res.status(200).json({
        access_token:access_token, userCred:{
        uid:user._id,
        email:user.email,
        role:user.role,}
    }); 
}
