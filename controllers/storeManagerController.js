const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Insert New Employee
//@route POST /api/admin/register
//@access Private
const requestOrder = asyncHandler(async (req,res) => {
    const {userId, password, newPassword, confirmPassword} = req.body;

    if (!userId || !password || !newPassword || !confirmPassword){
        res.status(400);
        throw new Error("All fields not provided");
    }

})

module.exports = {requestOrder}