const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Packet= require("../models/packetsModel");
const Manufacture = require("../models/manufacturingModel");
const Store = require("../models/storeModel");
const Product = require("../models/productModel")
const CompletedManufacturing = require("../models/completManufacureOrderModel")

//@desc Insert Product, Month,Quanity,weight,
//@rout POST api/manufacture/create_manufacturing_order
//@acess private

const startManufacturing = asyncHandler(async(req,res)=>{

    const {storeId,product,productionMonth,packages}=req.body;

    if(!storeId ||!product|| !productionMonth ||!packages){

        res.status(402);
        throw new Error("All Fields Not Provided");

    }

    const store = await Store.findOne({storeId});
    if(!store){
        res.status(402)
        throw new Error("Unknown Store");
    }

    const products = await Product.findOne({name:product});
    if(!products){
        res.status(402)
        throw new Error("Unknown Product");
    }

    var  manufacture = {
        adminId:req.user["employeeId"],
        storeId,
        product,
        productionMonth,
        packages:[],

    } 

    const createManufacturingOrder= new Manufacture(manufacture);

    try {
        await createManufacturingOrder.save(); 
        res.status(200).json({message:"Manufacture Order Created Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


//@desc Edit Product, Month,Quanity,weight,_id
//@rout PUT api/manufacture/edit_manufacturing_order
//@acess private
const editManufacturing = asyncHandler(async(req,res)=>{

    const {product,productionMonth,packages,_id}=req.body;

    if(!product|| !productionMonth ||!packages  || !_id){

        res.status(402);
        throw new Error("All Fields Not Provided");

    }

    const manufacture= await Manufacture.findOne({_id});
    if(!manufacture){
        res.status(404)
        throw new Error("Manufacture order not found");
    }
    
    manufacture.product = product;
    manufacture.productionMonth=productionMonth;
    manufacture.packages=packages;


    try {
        await manufacture.save(); 
        res.status(200).json({message:"Manufacture Order Edited Successfully"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

//@desc delete manufacturing order,
//@rout DELETE api/manufacture/delete_manufacturing_order/:body
//@acess private
const deletmanufacturing =asyncHandler(async(req,res)=>{

    const _id = req.params["body"];

    if(!_id) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }
    
    try {
        const manufacture = await Manufacture.findOne({_id});

        if(!_id){
            res.status(404);
            throw new Error("request not Found");
        }

        if(manufacture.status>0){
            res.status(402);
            throw new Error("Order Already Approved");
        }

        // if(!["admin","super_admin"].includes(req.user["role"]) && order.employeeId !== req.user["employeeId"]){
        //     res.status(402);
        //     throw new Error("Not Your Order");
        // }

        const status = await Manufacture.deleteOne({_id});

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

});

//@desc To get all recordes of completd Manufacture
//@rout GET api/manufacture/get_completed_Manufacture_order
//@acess private

const getCompletedManufactureOrders = asyncHandler( async (req,res) => {
//     const page = parseInt(req.query.page) || 1;  // Current page
//     const limit = parseInt(req.query.limit) || 10;
//     //const storeId = req.query.storeId;
//     const storeId = req.params["storeId"];

//     if(!storeId){
//         res.status(402);
//         throw new Error("Invalid Store");
//     }
//     try {
//         const totalOrders = await CompletedManufacturing.countDocuments();
//         const totalPages = Math.ceil(totalOrders / limit);
//         const orders = await CompletedManufacturing.find({storeId})
//         .sort(date)
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .exec();;
// //{orderId:1}
//         res.status(200).json({
//             orders,
//             currentPage: page,
//             totalPages,
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500);
//         throw new Error("Internal Server Error");
//     }

     const storeId = req.params["storeId"];
     
    if(!storeId){
        res.status(402);
        throw new Error("Invalid Store");
    }

    try {
        const manufacturedorder = await CompletedManufacturing.find({storeId});
        res.status(200).json(manufacturedorder)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


//@desc Get all ManufacturingOrder Product, Month,Quanity,weight,
//@rout Get api/manufacture/get_all_manufacturing_order
//@acess private
const getManufacturingOrder= asyncHandler(async(req,res)=>{
    
    const storeId = req.params["storeId"];
    
    if(!storeId){
        res.status(402);
        throw new Error("Invalid Store");
    }

    try {
        const manufacture = await Manufacture.find({storeId});
        res.status(200).json(manufacture)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
});


//@desc To Accept Manufacture Order
//@rout PUT api/manufacture/manufacture_accepted
//@acess private
const manufactureAccepted =asyncHandler(async(req,res)=>{

    const {_id} = req.body;

    if(!_id) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    const manufactureorder = await Manufacture.findOne({_id});

    if(!manufactureorder) {
        res.status(402);
        throw new Error("Order Doesnt Exist");
    }

    if( manufactureorder.status !== 0 ){
        res.status(402);
        throw new Error("Order Not For Aproval");
    }

    manufactureorder.status=1;

    manufactureorder.approvedBy = req.user["employeeId"];
    manufactureorder.approvarName = req.user["employeeName"];
    manufactureorder.approvalDate = Date.now();
    try {
        await  manufactureorder.save(); 
        res.status(200).json({message:"Order Accepted"});
    } catch (error){
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

//@desc 
//@rout POST api/manufacture/maufacture_completed
//@acess private

const maufactureComplete= asyncHandler(async(req,res)=>{

    const {id} = req.body;

    console.log(id);

    if(!id){
        res.status(402);
        throw new Error("Id Not Provided");
    } 

    var manufacture = await Manufacture.findOne({_id:id});
    if(!manufacture){
        res.status(404);
        throw new Error("Order Doesnt Exist");
    }


   const newcompletedManufacturing = new CompletedManufacturing({

        storeId:manufacture.storeId,
        adminId:manufacture.adminId,
        product:manufacture.product,
        date: Date.now(),
        productionMonth:manufacture.productionMonth,
        weight:manufacture.weight,
        packages:manufacture.packages,
        status:2

   });

   console.log(newcompletedManufacturing);

   try {
    await newcompletedManufacturing.save();

    const status = await Manufacture.deleteOne({_id:id});

    if (status.deletedCount === 1) {
        res.status(200).json({ message: 'Order Completed Successfully.' });
    } 
    else {
        res.status(404).json({ message: 'Item not found.' });
    }
} catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Internal Server Error");
}

   

})
module.exports={startManufacturing,editManufacturing,deletmanufacturing,getManufacturingOrder,manufactureAccepted,maufactureComplete,getCompletedManufactureOrders}