const express = require("express");
const { loginUser, logOutUser, changeAvatar, getUserDetails} = require("../controllers/userController");
const { validateTokenBearer } = require("../config/validateTokenBearer");

const userRouter = express.Router();



userRouter.post("/login", loginUser);
userRouter.get("/logout", validateTokenBearer, logOutUser);
// userRouter.put("/edit/username",validateTokenBearer, changeUserName);
userRouter.put("/edit/avatar",validateTokenBearer, changeAvatar);
// userRouter.put("/edit/password",validateTokenBearer, changePassword);
userRouter.get("/userinfo",validateTokenBearer, getUserDetails );

module.exports = {userRouter}