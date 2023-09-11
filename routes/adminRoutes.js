const express = require("express");
const { validateTokenBearer, adminAuthorize, authorization } = require("../config/validateTokenBearer");
const { createNewUser, adminChangePassword, adminChangeEmail, adminGetAllUsers, adminGetUserDetails, editUserInfo } = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/register", validateTokenBearer, adminAuthorize, createNewUser);
adminRouter.put("/edit/email",validateTokenBearer, adminAuthorize, adminChangeEmail);
adminRouter.put("/edit/password",validateTokenBearer, adminAuthorize, adminChangePassword );
adminRouter.put("/edit/user",validateTokenBearer, adminAuthorize, editUserInfo );

adminRouter.put("/delete_user",validateTokenBearer, adminAuthorize, adminChangePassword );


adminRouter.get("/get_all_users",validateTokenBearer, adminAuthorize,adminGetAllUsers)
adminRouter.get("/user/:id",validateTokenBearer, adminAuthorize,adminGetUserDetails)

// userRouter.put("/admin/userinfo",validateTokenBearer, getUserDetails );

module.exports = adminRouter