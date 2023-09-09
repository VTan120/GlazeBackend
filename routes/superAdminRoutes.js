const express = require("express");
const { validateTokenBearer, authorizeRoles } = require("../config/validateTokenBearer");
const createNewAdmin = require("../controllers/superAdminController");

const superAdminRouter = express.Router();

superAdminRouter.post("/register_admin", validateTokenBearer, authorizeRoles(["super_admin"]), createNewAdmin);


module.exports = superAdminRouter;