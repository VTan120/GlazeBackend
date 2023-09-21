const express = require("express");
const { validateTokenBearer, adminAuthorize } = require("../config/validateTokenBearer");
const { createRawMaterial, editRawMaterial, getRawMaterial, getAllRawMaterials, deleteRawMaterial } = require("../controllers/rawMaterialController");

const rawMaterialRouter = express.Router();

rawMaterialRouter.post("/add_raw_material", validateTokenBearer, adminAuthorize, createRawMaterial);
rawMaterialRouter.put("/edit_raw_material", validateTokenBearer, adminAuthorize, editRawMaterial);
rawMaterialRouter.get("/get_raw_material/:name", validateTokenBearer, adminAuthorize, getRawMaterial);
rawMaterialRouter.get("/get_all_raw_materials", validateTokenBearer, adminAuthorize, getAllRawMaterials);
rawMaterialRouter.put("/delete_raw_material", validateTokenBearer, adminAuthorize, deleteRawMaterial);


module.exports = { rawMaterialRouter };