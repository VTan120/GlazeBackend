const express = require("express");

const {createPackets,getAllPackets,deletePackets} = require("../controllers/packetController");
const { validateTokenBearer } = require("../config/validateTokenBearer");

const packetRouter=express.Router();

//To create Packing
packetRouter.post("/create_packets",validateTokenBearer,createPackets);

packetRouter.get("/get_all_products_packets",validateTokenBearer,getAllPackets)

packetRouter.put("/delete_packets",validateTokenBearer,deletePackets)

module.exports={packetRouter}