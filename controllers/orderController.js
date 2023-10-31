const asyncHandler = require("express-async-handler");
const Budget = require("../models/budgetModel");
const Sales = require("../models/salesTargetModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Store = require("../models/storeModel");

const createOrder  = asyncHandler(async (req,res) => {
    const {products,  storeId, month, year} = req.body;

    if(!products || !storeId || !month || !year ) {
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
        consumptionDate:{
            month,
            year
        },
        products:[],
        materialPrices:[],
    } 

    var materialPrices = {};

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
                if(!materialPrices[material.name]){
                    materialPrices[material.name] = {
                        materialName:material.name, 
                        weight:products[i].quantity * material.percentage/100,
                        price:0
                    }
                }
                else {
                    materialPrices[material.name].weight = materialPrices[material.name].weight + products[i].quantity * material.percentage/100;
                }
            
                var tempMaterial = {
                    name:material.name,
                    weight:products[i].quantity * material.percentage/100,
                }
                tempProduct.materials.push(tempMaterial)
            }
        });
        order.products.push(tempProduct);
    }
    
    try {
        order.materialPrices = Object.values(materialPrices);
        const newOrder = new Order(order);
        await newOrder.save(); 
        res.status(200).json({message:"Order Created Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const editOrder  = asyncHandler(async (req,res) => {
    const {products , _id, month, year } = req.body;

    if(!products || !_id ) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    var order = await Order.findOne({_id});

    if(!order){
        res.status(404)
        throw new Error("Order Doesnt Exist");
    }

    if(order.status >= 1){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
        res.status(402);
        throw new Error("Unauthorised Access");
    }

    order.employeeId = req.user["employeeId"];

    order.requestDate = Date.now();

    order.consumptionDate = {
        month,
        year
    };

    order.products = [];

    var materialPrices = {};

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
                if(!materialPrices[material.name]){
                    materialPrices[material.name] = {
                        materialName:material.name, 
                        weight:products[i].quantity * material.percentage/100,
                        price:0
                    }
                }
                else {
                    materialPrices[material.name].weight = materialPrices[material.name].weight + products[i].quantity * material.percentage/100;
                }
            
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
        order.materialPrices = Object.values(materialPrices);
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

    if(order.status !== 0 && order.status !== 2){
        res.status(402);
        throw new Error("Order Not For Aproval");
    }

    if(order.status === 0){
        order.status = 1;
    }
    else if(order.status === 2){
        order.status = 3;
    }
    else{
        order.status = -1;
    }
    order.approvedBy = req.user["employeeId"];
    order.approvalDate = Date.now();
    try {
        await order.save(); 
        res.status(200).json({message:"Order Approved"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const sendForBudgetApproval = asyncHandler(async (req,res) => {
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

    if(order.status >= 2){
        res.status(402);
        throw new Error("Order Already Approved");
    }
    else if(order.status <1){
        res.status(402);
        throw new Error("Order Cant Be Approved");
    }

    order.status = 2;
    order.employeeId = req.user["employeeId"];
    order.requestDate = Date.now();
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

    if(order.status >= 3){
        res.status(402);
        throw new Error("Order Already Approved");
    }

    order.status = -1;
    order.approvedBy = req.user["employeeId"];
    order.note = note;
    order.requestDate = Date.now();
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
            throw new Error("Not Your Order");
        }

        const status = await Order.deleteOne({_id});

        if (status.deletedCount === 1) {
            res.status(200).json({ message: 'Item deleted successfully.' });
        } 
        else {
            res.status(404).json({ message: 'Item not found.' });
        }
    } catch (error){
        if(res.statusCode === 402){
            throw new Error("Not Your Order");
        }
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const updateMaterialPrices  = asyncHandler(async (req,res) => {
    const {materialPrices , _id } = req.body;

    if(!materialPrices || !_id ) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    var order = await Order.findOne({_id});

    if(!order){
        res.status(404)
        throw new Error("Order Doesnt Exist");
    }

    if(order.status !== 1){
        res.status(402);
        throw new Error("Order Not Approved Or in Next Stage");
    }

    if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
        res.status(402);
        throw new Error("Unauthorised Access");
    }

    order.employeeId = req.user["employeeId"];

    order.requestDate = Date.now();

    order.materialPrices = materialPrices;
    try {
        await order.save(); 
        res.status(200).json({message:"Order Edited Successfully"});
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
        var budgetYears = {};
        var salesYears = {};
        const orders = await Order.find({storeId}).sort({status:1});

        var updatedOrders = [];

        for(i in orders){
            if(orders[i].status === 0 || orders[i].status === -1){
                if(!salesYears[orders[i].consumptionDate.year]){
                    salesYears[orders[i].consumptionDate.year] = await Sales.findOne({year:orders[i].consumptionDate.year});
                }
                const salesTarget = salesYears[orders[i].consumptionDate.year] ? salesYears[orders[i].consumptionDate.year].months.find(obj => obj.monthName === orders[i].consumptionDate.month) : {products:false};
                updatedOrders.push({...orders[i].toObject(),salesTarget:salesTarget.products})
            }
            else if(orders[i].status === 1){
                if(!budgetYears[orders[i].consumptionDate.year]){
                    budgetYears[orders[i].consumptionDate.year] = await Budget.findOne({year:orders[i].consumptionDate.year});
                }
                const monthlyBudget = budgetYears[orders[i].consumptionDate.year] ? budgetYears[orders[i].consumptionDate.year].months.find(obj => obj.monthName === orders[i].consumptionDate.month) : {monthlyBudget:false};
                updatedOrders.push({...orders[i].toObject(),monthlyBudget:monthlyBudget.monthlyBudget})
            }
            else{
                updatedOrders.push(orders[i]);
            }

        }
        res.status(200).json(updatedOrders)
    } catch (error) {
        console.log(error);
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

const getOrderBudgetDetails = asyncHandler(async (req,res) => {
    const _id = req.params["orderId"];

    if(!_id) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    try {
        const order = await Order.findOne({_id});
        const budget = await Budget.findOne({year:order.consumptionDate.year});
        if(!order){
            res.status(404);
            throw new Error("Cannot Find Order");
        }
        if(!budget){
            res.status(404);
            throw new Error("Cannot Find Budget Year");
        }
        res.status(200).json({order,monthlyBudget:budget.months.find(obj => obj.monthName === order.consumptionDate.month)});
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


module.exports = { getOrderBudgetDetails, createOrder , approveOrder , getOrdersInStore , getProducts , rejectOrder , deleteOrder , editOrder, updateMaterialPrices, sendForBudgetApproval}