const express = require("express");

const {createTracking,getAllTracking}= require("../controllers/trackingController");
const { validateTokenBearer } = require("../config/validateTokenBearer");

const trackingRouter =express.Router();
//To create tracking
trackingRouter.post("/create_tracking",validateTokenBearer,createTracking);


trackingRouter.get("/get_tracking_info",validateTokenBearer,getAllTracking);

module.exports = {trackingRouter};