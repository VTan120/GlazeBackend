const express = require("express");
const { validateTokenBearer, authorizeRoles, adminAuthorize } = require("../config/validateTokenBearer");
const { createStore, addStoreManager, getStoreIds } = require("../controllers/storeController");

const storeRouter = express.Router();

storeRouter.post("/add_store", validateTokenBearer, authorizeRoles("super_admin"), createStore);
storeRouter.put("/add_store_manager", validateTokenBearer, authorizeRoles("super_admin"), addStoreManager);
storeRouter.get("/store_ids", validateTokenBearer, adminAuthorize, getStoreIds);



module.exports = { storeRouter };