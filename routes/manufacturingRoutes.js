const express = require("express");

const { validateTokenBearer } = require("../config/validateTokenBearer");

const {startManufacturing,editManufacturing,deletmanufacturing,getManufacturingOrder,manufactureAccepted,maufactureComplete,getCompletedManufactureOrders} = require("../controllers/manufacturingController");

const manufactureRouter = express.Router();

manufactureRouter.post("/create_manufacturing_order",validateTokenBearer,startManufacturing);
manufactureRouter.put("/edit_manufacturing_order",validateTokenBearer,editManufacturing);
manufactureRouter.get("/get_all_manufacturing_order/:storeId",validateTokenBearer,getManufacturingOrder);
manufactureRouter.delete("/delete_manufacturing_order/:body",validateTokenBearer,deletmanufacturing);
manufactureRouter.post("/maufacture_completed",validateTokenBearer,maufactureComplete);
manufactureRouter.get("/get_completed_manufacture_order/:storeId",validateTokenBearer,getCompletedManufactureOrders)
manufactureRouter.put("/manufacture_accepted",validateTokenBearer,manufactureAccepted)
module.exports = {manufactureRouter};
