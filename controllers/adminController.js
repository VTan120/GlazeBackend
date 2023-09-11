const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
var crypto = require("crypto");
const sendEmail = require("../config/mailing");

//@desc Insert New Employee
//@route POST /api/admin/register
//@access Private
const createNewUser = asyncHandler(async (req,res) => {
    const { employeeName, email, password, phoneNumber, aadharCard, birthDate, joiningDate, role} = req.body;


    if(!employeeName || !email || !password || !phoneNumber || !aadharCard || !birthDate || !joiningDate || !role){
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
    });

    // Save the new user to the database
    try {
        await newUser.save();

        const userDetails = await User.findOne({ email });

        // setTimeout(() => {
        // }, 3000);

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
        
    }
})

//@desc Admin Delete User
//@route PUT /api/admin/edit/password
//@access Private
const deleteUser = asyncHandler(async (req,res) => {
    const {email} = req.body;
    if(!email) {
        res.status(400);
        throw new Error("All fields not provided");
    }
    const user = await User.findOne({email});

    var password = crypto.randomBytes(10).toString('hex');

    user.password = password;

    try {
        await user.save();
        res.status(200).json({message:"Password Changed"});
    } catch (error) {
        res.status(400);
        throw new Error("Internal Server Error");
    }
    
})

//@desc Admin Update Password
//@route PUT /api/admin/edit/password
//@access Private
const adminChangePassword = asyncHandler(async (req, res) => {
    const {employeeId, newPassword, confirmPassword} = req.body;

    if (!employeeId || !newPassword || !confirmPassword){
        res.status(400);
        throw new Error("All fields not provided");
    }

    if(newPassword !== confirmPassword){
        res.status(400);
        throw new Error("Password And Confirmed Password must be same");
    }

    const user = await User.findOne({employeeId});

    if(!user){
        res.status(400);
        throw new Error("User Not Registered");
    }

    try {
        const hashPassword = await bcrypt.hash(newPassword, 10);

        if(!hashPassword){
            res.status(400).json({message:"Password Hashing Failed"});
        }

        user.password = hashPassword;

        await user.save();
        res.status(200).json({message:"Password Changed"});
    }
    catch(error){
        res.status(400);
        throw new Error(error);
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
module.exports = { createNewUser, adminChangePassword, adminChangeEmail, adminGetAllUsers, adminGetUserDetails, deleteUser, }