const express = require("express");
const { validateTokenBearer, authorizeRoles } = require("../config/validateTokenBearer");
const { createNewAdmin, superAdminGetAllUsers } = require("../controllers/superAdminController");

const superAdminRouter = express.Router();

superAdminRouter.post("/register_admin", validateTokenBearer, authorizeRoles("super_admin"), createNewAdmin);

superAdminRouter.get("/get_all_users", validateTokenBearer, authorizeRoles("super_admin"), superAdminGetAllUsers);


module.exports = superAdminRouter;