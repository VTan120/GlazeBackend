const asyncHandler = require("express-async-handler");
const { google } = require('googleapis');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Budget = require("../models/budgetModel");
const Sales = require("../models/salesTargetModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Store = require("../models/storeModel");
const User = require("../models/userModel");
const CompleteOrder = require("../models/completedOrderModel");
const { updateInventoryAfterOrder } = require("./rawMaterialInventoryController");

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
        employeeName:req.user["employeeName"],
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

    order.employeeName = req.user["employeeName"];

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
    order.approvarName = req.user["employeeName"];
    order.approvalDate = Date.now();
    try {
        await order.save(); 
        res.status(200).json({message:"Order Approved"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const completeOrder = asyncHandler(async (req,res) => {
    const {id} = req.body;

    if(!id){
        res.status(402);
        throw new Error("Id Not Provided");
    } 

    var order = await Order.findOne({_id:id});
    
    if(!order){
        res.status(404);
        throw new Error("Order Doesnt Exist");
    }

    if(order.status<3){
        res.status(402);
        throw new Error("Order Not Ready To Be Complete");
    }

    const newCompleteOrder = new CompleteOrder({
        orderId: order.orderId,
        employeeId: order.employeeId,
        approvedBy: order.approvedBy,
        employeeName:order.employeeName,
        approvarName:order.approvarName,
        storeId: order.storeId,
        consumptionDate: order.consumptionDate,
        products: order.products,
        materialPrices: order.materialPrices,
        requestDate: order.requestDate,
        approvalDate: order.approvalDate,
        invoiceNumber:order.invoiceNumber,
        supplierName:order.supplierName,
        quoteImage:order.quoteImage,
        status: 4,
    });

    try {
        await newCompleteOrder.save();

        const status = await Order.deleteOne({_id:id});

        const invUpdate = await updateInventoryAfterOrder({storeId:order.storeId,materials:order.materialPrices})


        if (status.deletedCount === 1 && invUpdate) {
            res.status(200).json({ message: 'Order Completed Successfully.' });
        } 
        else {
            res.status(404).json({ message: 'Something Went Wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

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
    order.employeeName = req.user["employeeName"];
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
    order.approvarName = req.user["employeeName"];
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

        if(order.status >= 1){
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
    const {quoteNo, supplierName, materialPrices , _id } = req.body;

    if(!quoteNo || !supplierName || !materialPrices || !_id ) {
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

    order.approvarName = req.user["employeeName"];

    order.requestDate = Date.now();

    order.materialPrices = materialPrices;

    order.quoteImage = quoteNo;

    order.supplierName = supplierName;

    console.log(order);
    try {
        await order.save(); 
        res.status(200).json({message:"Order Edited Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
})


const uploadInvoiceImage = asyncHandler(async (req, res) => {
    const {invoice , _id } = req.body;

    if(!invoice || !_id ) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    console.log(invoice,_id);

    var order = await Order.findOne({_id});

    if(!order){
        res.status(404)
        throw new Error("Order Doesnt Exist");
    }

    if(order.status < 3){
        res.status(402);
        throw new Error("Order Cant Be Completed In This Stage");
    }

    if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
        res.status(402);
        throw new Error("Unauthorised Access");
    }

    order.invoiceNumber = invoice;

    try {
        await order.save(); 
        res.status(200).json({message:"Order Edited Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

// const uploadInvoiceImage = asyncHandler(async (req, res) => {

//     console.log("inside upload");
//     if (req.file === "") {
//         return res.status(402).json({ error: 'No image provided.' });
//     }

//     const image = req.file;

//     console.log(image);

//     // cloudinary.config({
//     //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     //     api_key: process.env.CLOUDINARY_API_KEY,
//     //     api_secret: process.env.CLOUDINARY_API_SECRET,
//     // });

//     console.log("ready to upload");
//     // try {
//     //     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     //     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//     //     const uploadFile = await cloudinary.uploader.upload(dataURI, {
//     //         resource_type: "auto",
//     //     });
//     //     res.json(uploadFile);
//     // } catch (error) {
//     //     console.log(error);
//     //     res.status(500);
//     //     throw new Error("Internal Server Error");
//     // }

//     try {

//         console.log(image);

//           const metaData = {
//             name: image.originalname.substring(
//               0,
//               image.originalname.lastIndexOf(".")
//             ),
//             parents: [process.env.FOLDER_ID], 
//           };
      
//           const media = {
//             mimeType: image.mimetype,
//             body: Buffer.from(image.buffer).toString("base64") // the image sent through multer will be uploaded to Drive
//           };

//           const auth = new google.auth.GoogleAuth({
//                 keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
//                 scopes: ['https://www.googleapis.com/auth/drive.file'],
//             });
        
//             const drive = google.drive({
//                 version: 'v3',
//                 auth,
//             });

//             console.log("Ready to upload");

      
//           // uploading the file
//           const response = await drive.files.create({
//             resource: metaData,
//             media: media,
//           });

//           console.log("uploaded");
      
//           console.log("ID:", response.data);
//           res.status(200).json(response.data)
//     } catch (error) {
//         console.log(error);
//         throw new Error("Error In Process")
//     }

// })


const getOrdersInStore = asyncHandler( async (req,res) => {
    const storeId = req.params["storeId"];

    if(!storeId){
        res.status(402);
        throw new Error("Invalid Store");
    }
    try {
        var budgetYears = {};
        var salesYears = {};
        const orders = await Order.find({storeId, status:{$ne: 4}}).sort({status:1});

        var updatedOrders = [];

        for(i in orders){
            if(orders[i].status === 0 || orders[i].status === -1){
                if(!salesYears[orders[i].consumptionDate.year]){
                    salesYears[orders[i].consumptionDate.year] = await Sales.findOne({year:orders[i].consumptionDate.year});
                }
                const salesTarget = salesYears[orders[i].consumptionDate.year] ? salesYears[orders[i].consumptionDate.year].months.find(obj => obj.monthName === orders[i].consumptionDate.month) : {products:false};
                updatedOrders.push({...orders[i].toObject(),salesTarget:salesTarget ? salesTarget.products : false })
            }
            else if(orders[i].status === 1){
                if(!budgetYears[orders[i].consumptionDate.year]){
                    budgetYears[orders[i].consumptionDate.year] = await Budget.findOne({year:orders[i].consumptionDate.year});
                }
                const monthlyBudget = budgetYears[orders[i].consumptionDate.year] ? budgetYears[orders[i].consumptionDate.year].months.find(obj => obj.monthName === orders[i].consumptionDate.month) : {monthlyBudget:false};
                updatedOrders.push({...orders[i].toObject(),monthlyBudget:monthlyBudget?.monthlyBudget ?? false})
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

const getCompletedOrdersInStore = asyncHandler( async (req,res) => {
    const page = parseInt(req.query.page) || 1;  // Current page
    const limit = parseInt(req.query.limit) || 10;
    const storeId = req.query.storeId;
    // const storeId = req.params["storeId"];

    if(!storeId){
        res.status(402);
        throw new Error("Invalid Store");
    }
    try {
        const totalOrders = await CompleteOrder.countDocuments();
        const totalPages = Math.ceil(totalOrders / limit);
        const orders = await CompleteOrder.find({storeId})
        .sort({orderId:1})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();;

        res.status(200).json({
            orders,
            currentPage: page,
            totalPages,
        })
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

    let order = await Order.findOne({_id});
    if(!order){
        order = await CompleteOrder.findOne({_id});
        if(!order){
            res.status(404);
            throw new Error("No Budget Set For The Year");
        }
    }

    const budget = await Budget.findOne({year:order.consumptionDate.year});
    if(!budget){
        res.status(404);
        throw new Error("Cannot Find Budget Year");
    }

    try {
        res.status(200).json({order,monthlyBudget:budget.months.find(obj => obj.monthName === order.consumptionDate.month)});
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


module.exports = { completeOrder, getOrderBudgetDetails, createOrder , approveOrder , getOrdersInStore , getProducts, getCompletedOrdersInStore , rejectOrder , deleteOrder , editOrder, updateMaterialPrices, sendForBudgetApproval, uploadInvoiceImage}