const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const sendEmail = require("../config/mailing");

//@desc Insert New Admin
//@route POST /api/super_admin/register_admin
//@access Private
const createNewAdmin = asyncHandler(async (req,res) => {
    const { employeeName, email, password, phoneNumber, aadharCard, birthDate, joiningDate, store, superPassword } = req.body;


    if(!employeeName || !email || !password || !phoneNumber || !aadharCard || !birthDate || !joiningDate || !store || !superPassword){
        return res.status(400).json({ message: 'All Fields Are Required' });
    }

    //Validate The SuperAdmin
    const super_admin = await User.findOne({email:req.user["email"]});

    if (!super_admin) {
        res.status(401);
        throw new Error("Unauthorised Request");
    }

    const valid = await bcrypt.compare(password, super_admin.password);

    if(!valid) {
        console.log("Wrong Password");
        res.status(401);
        throw new Error("Wrong Username Or Password");
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }, {aadharCard}] });

    if (existingUser) {
      res.status(402);
      throw new Error("User Already Exists");
    }

    if(!["store_manager","chef","employee"].includes(role)){
        res.status(402);
        throw new Error("Invalid Role");
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    if(!hashedPassword) {
        res.status(500);
        throw new Error("Failed Hashing");
    }

    // Create a new user instance
    const newUser = new User({
      employeeName,
      email,
      password: hashedPassword,
      role:"admin",
      phoneNumber,
      aadharCard,
      birthDate: new Date(birthDate), // Convert birthDate to a Date object
      joiningDate: new Date(joiningDate), 
      store,
    });

    // Save the new user to the database
    try {
        await newUser.save();

        const userDetails = await User.findOne({ email });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: "Welcome TO Gaze",
            html: `Hello ${employeeName}, \n\t Welcome to the Glaze team as a ${role},your employee id is ${userDetails.employeeId} and login password is ${password}.`
    };

    const mailOptions2 = {
        from: process.env.EMAIL_ID,
        to: process.env.EMAIL_ID,
        subject: "Welcome TO Gaze",
        html: `${employeeName} was added to the Glaze team as a ${role},his employee id is ${userDetails.employeeId} and login password is ${password}.`
    };

        sendEmail(mailOptions);
        sendEmail(mailOptions2);
        res.status(200).json({newUser: newUser.employeeName})
    } catch (error) {
        res.status(500);
        throw new Error("Unexpected Error");
    }
})

//@desc Get All Users
//@route GET /api/super_admin/get_all_users
//@access Private
const superAdminGetAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find({role: { $nin: ['super_admin'] }});

    if(!users){
        res.status(404);
        throw new Error("Users Not Found");
    }

    res.status(200).json(users)
});

module.exports = {createNewAdmin, superAdminGetAllUsers}