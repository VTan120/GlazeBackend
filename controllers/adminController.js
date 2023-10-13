const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
var crypto = require("crypto");
const sendEmail = require("../config/mailing");

//@desc Insert New Employee
//@route POST /api/admin/register
//@access Private
const createNewUser = asyncHandler(async (req,res) => {
    const { employeeName, email, password, phoneNumber, birthDate, joiningDate, role, storeId} = req.body;


    if(!employeeName || !email || !password || !phoneNumber || !birthDate || !joiningDate || !role || !storeId){
        return res.status(400).json({ message: 'All Fields Are Required' });
    }
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ phoneNumber }, { email }] });

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
      role,
      storeId,
      phoneNumber,
      birthDate: new Date(birthDate), // Convert birthDate to a Date object
      joiningDate: new Date(joiningDate), 
    });

    // Save the new user to the database
    try {
        console.log("Saving new user");
        await newUser.save();
        setTimeout(async () => {
            try {
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
                // to:"vedanttandel120@gmail.com",
                subject: "Welcome TO Gaze",
                html: `${employeeName} was added to the Glaze team as a ${role},his employee id is ${userDetails.employeeId} and login password is ${password}.`
        };
        console.log("Prepared Email");
    
            sendEmail(mailOptions);
            sendEmail(mailOptions2);
            } catch (error) {
                console.log("Email Not Sent");
            }
          }, 10000);
       
        res.status(200).json({newUser: newUser.employeeName})
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
})


//@desc Edit User
//@route PUT /api/admin/edit/user
//@access Private
const editUserInfo = asyncHandler(async (req,res) => {
    const { employeeId, employeeName, email, phoneNumber, birthDate, joiningDate, role} = req.body;


    if(!employeeId || !employeeName || !email || !phoneNumber || !birthDate || !joiningDate || !role || !storeId){
        res.status(402);
        throw new Error("All Fields Are Required");
    }

    if(!["store_manager","chef","employee"].includes(role)){
        res.status(402);
        throw new Error("Invalid Role");
    }


    try {
        const user = await User.findOne({ employeeId });

        if(user.email !== email) {
            const user2 = await User.findOne({email});
            if(user2){
                res.status(402);
                throw new Error("Email Already Used");
            }
        }

        if(user.phoneNumber !== phoneNumber) {
            const user2 = await User.findOne({phoneNumber});
            if(user2){
                res.status(402);
                throw new Error("Phone Number Already Used");
            }
        }

        const updatedDocument = await User.findByIdAndUpdate(
          user.id,
          req.body,
          { new: true } // Set to true to return the updated document
        );
    
        if (!updatedDocument) {
            res.status(404);
            throw new Error("User not found");
        }
    
        res.json(updatedDocument);
      } catch (err) {
        console.error(err);
        res.status(500);
        throw new Error("Server Error");
      }
})

//@desc Admin Delete User
//@route PUT /api/admin/edit/password
//@access Private
const deleteUser = asyncHandler(async (req,res) => {
    const {employeeId} = req.body;
    if(!employeeId) {
        res.status(402);
        throw new Error("All fields not provided");
    }
    const user = await User.findOne({employeeId});

    var password = crypto.randomBytes(10).toString('hex');

    user.password = password;

    const currentTime = new Date();

    user.terminationDate = currentTime;

    try {
        await user.save();
        res.status(200).json({message:"Password Changed"});
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
    
})

//@desc Admin Update Password
//@route PUT /api/admin/edit/password
//@access Private
const adminChangePassword = asyncHandler(async (req, res) => {
    const {employeeId, newPassword, confirmPassword} = req.body;

    if (!employeeId || !newPassword || !confirmPassword){
        res.status(402);
        throw new Error("All fields not provided");
    }

    if(newPassword !== confirmPassword){
        res.status(402);
        throw new Error("Password And Confirmed Password must be same");
    }

    const user = await User.findOne({employeeId});


    if(!user){
        res.status(404);
        throw new Error("User Not Registered");
    }

    if(user.role === "admin" && req.user.role !== "super_admin"){
        res.status(403);
        throw new Error("User Is Unaurhorised");
    }

    if(user.role === "super_admin"){
        res.status(403);
        throw new Error("User Is Unaurhorised");
    }

    try {
        const hashPassword = await bcrypt.hash(newPassword, 10);

        if(!hashPassword){
            res.status(500);
        throw new Error("Hashing Failed");
        }

        user.password = hashPassword;

        await user.save();
        res.status(200).json({message:"Password Changed"});
    }
    catch(error){
        res.status(500);
        throw new Error("Internal Server Error");
    }

});

//@desc Update Email
//@route PUT /api/admin/edit/email
//@access Private
const adminChangeEmail = asyncHandler(async (req, res) => {
    const {employeeId, newEmail} = req.body;

    const user = await User.findOne({employeeId});

    if(!user){
        res.status(402);
        throw new Error("Nor Valid User");
    }

    const otherUser = await User.findOne({newEmail});

    if(otherUser){
        res.status(402)
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
    const employeeId = req.params["id"]
    const user = await User.findOne({employeeId });

    if(!user){
        res.status(404);
        throw new Error("User Not Found");
    }

    res.status(200).json(user)
});

//@desc Get All Users
//@route GET /api/admin/get_all_users
//@access Private
const adminGetAllUsers = asyncHandler(async (req,res) => {
    const role = req.user.role
    var users;
    if(role === "super_admin"){
        users = await User.find({role: { $nin: ["super_admin"] }});
    }
    else{
        users = await User.find({role: { $nin: ['admin', 'super_admin'] }});
    }
    

    if(!users){
        res.status(404);
        throw new Error("User Not Found");
    }

    res.status(200).json(users)
});
module.exports = { createNewUser, adminChangePassword, adminChangeEmail, adminGetAllUsers, adminGetUserDetails, deleteUser,editUserInfo }