const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { updateInventory } = require("../controllers/rawMaterialInventoryController");
const rawMaterialInventoryRouter = express.Router();

rawMaterialInventoryRouter.put("/update_inventory", validateTokenBearer, authorizeRoles("super_admin", "admin"), updateInventory);


module.exports = { rawMaterialInventoryRouter };