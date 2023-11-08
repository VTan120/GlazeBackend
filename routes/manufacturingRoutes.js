const express = require("express");

const { validateTokenBearer } = require("../config/validateTokenBearer");

const {startManufacturing,editManufacturing,deletmanufacturing,getManufacturingOrder} = require("../controllers/manufacturingController");

const manufactureRouter = express.Router();

manufactureRouter.post("/create_manufacturing_order",validateTokenBearer,startManufacturing);
manufactureRouter.put("/edit_manufacturing_order",validateTokenBearer,editManufacturing);
manufactureRouter.get("/get_all_manufacturing_order/:storeId",validateTokenBearer,getManufacturingOrder);
manufactureRouter.delete("/delete_manufacturing_order/:body",validateTokenBearer,deletmanufacturing);

module.exports = {manufactureRouter};
