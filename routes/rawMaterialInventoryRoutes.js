const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { updateInventory, getRawInventory } = require("../controllers/rawMaterialInventoryController");
const rawMaterialInventoryRouter = express.Router();

rawMaterialInventoryRouter.put("/update_inventory", validateTokenBearer, authorizeRoles("super_admin", "admin"), updateInventory);
rawMaterialInventoryRouter.get("/get_inventory/:storeId", validateTokenBearer, authorizeRoles("super_admin", "admin", "store_manager"), getRawInventory);


module.exports = { rawMaterialInventoryRouter };