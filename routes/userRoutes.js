const express = require("express");
const { createNewUser, loginUser, logOutUser, getUserDetails, changeUserName, changeAvatar, changeEmail } = require("../controllers/userController");
const { validateTokenBearer, adminAuthorize } = require("../config/validateTokenBearer");

const userRouter = express.Router();

userRouter.post("/admin/register", validateTokenBearer, adminAuthorize, createNewUser);
userRouter.put("/admin/edit/email",validateTokenBearer, adminAuthorize, changeEmail );



userRouter.post("/login", loginUser);
userRouter.get("/logout", validateTokenBearer, logOutUser);
userRouter.put("/edit/username",validateTokenBearer, changeUserName);
userRouter.put("/edit/avatar",validateTokenBearer, changeAvatar);
// userRouter.put("/edit/password",validateTokenBearer, changePassword);
userRouter.put("/admin/userinfo",validateTokenBearer, getUserDetails );

module.exports = {userRouter}