const express = require("express");
const { validateTokenBearer, adminAuthorize } = require("../config/validateTokenBearer");
const { createRawMaterial } = require("../controllers/rawMaterialController");

const rawMaterialRouter = express.Router();

rawMaterialRouter.post("/add_raw_material", validateTokenBearer, adminAuthorize, createRawMaterial);

module.exports = { rawMaterialRouter };