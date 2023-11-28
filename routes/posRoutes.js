const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { updateInventory, createPOSStore, getPOSStoreIds, getPOSStore } = require("../controllers/posController");
const posRouter = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

posRouter.put("/update_inventory", validateTokenBearer, authorizeRoles("super_admin", "admin"), upload.single('file'), updateInventory);
posRouter.post("/create_store", validateTokenBearer, authorizeRoles("super_admin", "admin"),  createPOSStore);
posRouter.get("/get_store_ids",  getPOSStoreIds);
posRouter.get("/get_pos_store/:storeId", getPOSStore);


module.exports = { posRouter };