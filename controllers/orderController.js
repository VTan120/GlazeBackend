const asyncHandler = require("express-async-handler");
const RawMaterial = require("../models/rawMaterialModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Store = require("../models/storeModel");

const createOrder  = asyncHandler(async (req,res) => {
    const {products,  storeId} = req.body;

    if(!products || !storeId ) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const store = await Store.findOne({storeId});
    if(!store){
        res.status(402)
        throw new Error("Unknown Store");
    }

    var order = {
        employeeId:req.user["employeeId"],
        storeId,
        products:[]
    } 

    for( i in products){
        const r = await Product.findOne({name:products[i].name});
        if(!r){
            res.status(402)
            throw new Error(`Unknown Product ${products[i].name}`);
        }
        var tempProduct = {
            name:products[i].name,
            quantity:products[i].quantity,
            materials:[]
        };
        // console.log(r);
        r.recipe.forEach(material => {
            if(material.name !== ""){
            
            var tempMaterial = {
                name:material.name,
                weight:products[i].quantity * material.percentage/100,
            }
            tempProduct.materials.push(tempMaterial)
            }
        });
        order.products.push(tempProduct);
    }

    console.log(order);

    const newOrder = new Order(order);
    try {
        await newOrder.save(); 
        res.status(200).json({message:"Order Created Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const editOrder  = asyncHandler(async (req,res) => {
    const {products , _id} = req.body;

    if(!products || !_id ) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    var order = await Order.findOne({_id});

    if(!order){
        res.status(404)
        throw new Error("Order Doesnt Exist");
    }

    if(order.status === 1){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
        res.status(402);
        throw new Error("Unauthorised Access");
    }

    order.products = [];

    for( i in products){
        const r = await Product.findOne({name:products[i].name});
        if(!r){
            res.status(402)
            throw new Error(`Unknown Product ${products[i].name}`);
        }
        var tempProduct = {
            name:products[i].name,
            quantity:products[i].quantity,
            materials:[]
        };
        // console.log(r);
        r.recipe.forEach(material => {
            if(material.name !== ""){
            
            var tempMaterial = {
                name:material.name,
                weight:products[i].quantity * material.percentage/100,
            }
            tempProduct.materials.push(tempMaterial)
            }
        });
        order.products.push(tempProduct);
    }

    console.log(order);
    try {
        order.status = 0;
        await order.save(); 
        res.status(200).json({message:"Order Edited Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})


const approveOrder = asyncHandler(async (req,res) => {
    const {_id} = req.body;

    if(!_id) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const order = await Order.findOne({_id});

    if(!order) {
        res.status(402);
        throw new Error("Order Doesnt Exist");
    }

    if(order.status === 1){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    order.status = 1;
    order.approvedBy = req.user["employeeId"];
    order.date = Date.now();
    try {
        await order.save(); 
        res.status(200).json({message:"Order Approved"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const rejectOrder = asyncHandler(async (req,res) => {
    const {_id , note} = req.body;

    if(!_id || !note) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const order = await Order.findOne({_id});

    if(!order) {
        res.status(402);
        throw new Error("Order Doesnt Exist");
    }

    if(order.status === 1){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    order.status = 2;
    order.approvedBy = req.user["employeeId"];
    order.note = note;
    order.date = Date.now();
    try {
        await order.save(); 
        res.status(200).json({message:"Order Rejected"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const deleteOrder = asyncHandler(async (req,res) => {
    const {_id} = req.body;

    if(!_id) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    try {
        const order = await Order.findOne({_id});

        if(order.status === 1){
            res.status(402);
            throw new Error("Order Already Approved");
        }

        if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
            res.status(402);
            throw new Error("Unauthorised Access");
        }

        const status = await Order.deleteOne({_id});

        if (status.deletedCount === 1) {
            res.status(200).json({ message: 'Item deleted successfully.' });
        } 
        else {
            res.status(404).json({ message: 'Item not found.' });
        }
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})


const getOrdersInStore = asyncHandler( async (req,res) => {
    const storeId = req.params["storeId"];

    if(!storeId){
        res.status(402);
        throw new Error("Invalid Store");
    }

    try {
        const orders = await Order.find({storeId});
        res.status(200).json(orders)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const getProducts = asyncHandler(async (req,res) => {
    
    try {
        const products = await Product.find({}).select("name");
        res.status(200).json(products)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


module.exports = { createOrder , approveOrder , getOrdersInStore , getProducts , rejectOrder , deleteOrder , editOrder}