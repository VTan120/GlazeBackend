const express = require("express");

const {createTracking}= require("../controllers/trackingController");
const { validateTokenBearer } = require("../config/validateTokenBearer");

const trackingRouter =express.Router();

trackingRouter.post("/create_tracking",validateTokenBearer,createTracking);

module.exports = {trackingRouter};