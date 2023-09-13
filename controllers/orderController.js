const asyncHandler = require("express-async-handler");
const RawMaterial = require("../models/rawMaterialModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const createOrder  = asyncHandler(async (req,res) => {
    const {product, weight, costPerKg, employeeId, employeeName} = req.body;

    if(!product || !weight || !costPerKg || !employeeId || !employeeName) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const material = RawMaterial.findOne({name: product})

    if(!material ){
        res.status(402);
        throw new Error("Unknown Product");
    }

    const newOrder = new Order({
        product,
        weight,
        costPerKg,
        employee:{
            employeeId,
            employeeName
        },
        status:"sent_for_approval"
    });
    try {
        await newOrder.save(); 
        res.status(200).json({message:"Order Created Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const approveOrder = asyncHandler(async (req,res) => {
    const {_id, employeeId, employeeName} = req.body;

    if(!_id || !employeeId) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const order = Order.findOne({_id});

    if(!order) {
        res.status(402);
        throw new Error("Order Doesnt Exist");
    }

    if(["done", "approved"].includes(order.status)){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    order.status = "approved";
    order.aproval = {employeeId, employeeName}

    try {
        await order.save(); 
        res.status(200).json({message:"Order Approved"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})


module.exports = {createOrder}