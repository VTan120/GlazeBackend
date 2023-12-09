
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Packet= require("../models/packetsModel");
const Manufacture = require("../models/manufacturingModel");
const Store = require("../models/storeModel");
const Product = require("../models/productModel")
const CompletedManufacturing = require("../models/completManufacureOrderModel")
const RawMaterialInventory = require("../models/rawMaterialInventoryModel");

//@desc Insert Product, Month,Quanity,weight,
//@rout POST api/manufacture/create_manufacturing_order
//@acess private

const startManufacturing = asyncHandler(async(req,res)=>{

    const {storeId,product, manufactureMonth,manufactureYear ,quantity,weight ,weightInput}=req.body;

    if(!storeId ||!product|| !manufactureMonth ||!manufactureYear ||!quantity ||!weight ||!weightInput){

        res.status(402);
        throw new Error("All Fields Not Provided");

    }
   
    console.log("jcnak");

    const store = await Store.findOne({storeId});
    if(!store){
        res.status(402)
        throw new Error("Unknown Store");
    }
    console.log("sstore")
    const products = await Product.findOne({name:product.value});
    if(!products){
        res.status(402)
        throw new Error("Unknown Product");
    }
    console.log("producxt")
    var  manufacture = {
        adminId:req.user["employeeId"],
        storeId,
        product:product.value,
        productionMonth:{ month:manufactureMonth, year:manufactureYear},
        package:{packageType:weight , packageQuantity:quantity},
        weight:weightInput,

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

    const {_id,storeId,product, manufactureMonth,manufactureYear ,quantity,weight ,weightInput}=req.body;

    if(!_id||!storeId ||!product|| !manufactureMonth ||!manufactureYear ||!quantity ||!weight ||!weightInput){

        res.status(402);
        throw new Error("All Fields Not Provided");

    }
    console.log("if")

    const manufacture= await Manufacture.findOne({_id});
    console.log(manufacture)
    if(!manufacture){
        res.status(404)
        throw new Error("Manufacture order not found");
    }
    console.log("if2")
    
    
    
    try {
        manufacture.product = product.value;
        manufacture.productionMonth.month=manufactureMonth;
        manufacture.productionMonth.year=manufactureYear;
        manufacture.package.packageType=weight;
        manufacture.package.packageQuantity=quantity;
        manufacture.weight=weightInput;
        await manufacture.save(); 
        res.status(200).json({message:"Manufacture Order Edited Successfully"});
    } catch (error){
        console.log(error)
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

//@desc Get all ManufacturingOrder Product, Month,Quanity,weight,
//@rout Get api/manufacture/get_manufacturing_order_details/:id
//@acess private
const getManufacturingOrderDetails= asyncHandler(async(req,res)=>{
   
    const _id = req.params["id"];
    
    if(!_id){
        res.status(402);
        throw new Error("Invalid id");
    }
    

    try {
        const manufacture = await Manufacture.findById(_id);
       
        if(!manufacture){
            res.status(402);
            throw new Error("Invalid");
        }
        
        const inventory = await RawMaterialInventory.findOne({storeId:manufacture.storeId});
        console.log(inventory)
        if(!inventory){
            res.status(402);
            throw new Error("Inventory not found");
        }

        const product = await Product.findOne({name:manufacture.product});
        
        if(!product){
            res.status(402);
            throw new Error("Invalid");
        }
        //console.log(product);
        
        let returnValue=[];

        const invetoryMap = inventory.rawMaterials.reduce((map, material) => {
            map[material.name] = material.batches.reduce((acc, currentObject) => {
                return acc + currentObject.weight;
              }, 0);
            return map;
        }, {});

        product.recipe.map((material)=>{
            returnValue.push({
                materialName:material.name,

                requiredQuantity:(manufacture.weight*material.percentage/100).toFixed(3),
                
                availableQuantity:(invetoryMap[material.name]*1000).toFixed(3)

            })
        })



        res.status(200).json(returnValue);
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Internal Server Error");
    }

});


//@desc To Accept Manufacture Order
//@rout PUT api/manufacture/manufacture_accepted
//@acess private
const manufactureAccepted =asyncHandler(async(req,res)=>{

    const {_id,comparision} = req.body;

    if(!_id || !comparision) {
        res.status(402);
        throw new Error("All Fields Not Provided");
    }

    comparision.map((data)=>{
        if(parseFloat(data.requiredQuantity)>parseFloat(data.availableQuantity)){
            
            res.status(402);
        throw new Error(`Not Sufficient ${data.materialName}`);
        }
    })

    const manufactureorder = await Manufacture.findOne({_id});

    if(!manufactureorder) {
        res.status(402);
        throw new Error("Order Doesnt Exist");
    }

    if( manufactureorder.status !== 0 ){
        res.status(402);
        throw new Error("Order Not For Aproval");
    }

    const inventory = await RawMaterialInventory.findOne({storeId:manufactureorder.storeId});
    
    if(!inventory){
        res.status(402);
        throw new Error("Inventory not found");
    }

    const product = await Product.findOne({name:manufactureorder.product});
    
    if(!product){
        res.status(402);
        throw new Error("Invalid");
    }

    
    let materials=[];

    const invetoryMap = inventory.rawMaterials.reduce((map, material) => {
        map[material.name] = material.batches;
        
        return map;
    }, {});

    
  
    const getBatches=(requiredQuantity,materialName)=>{ 
        const batches=invetoryMap[materialName]
        let tempArr=[]
        let i=0;

        while(parseFloat(requiredQuantity)>0.0){
            if(!batches[i]){
                break
            }
            if(parseFloat(requiredQuantity)<parseFloat(batches[i].weight*1000)){
                invetoryMap[materialName][i].weight-=(requiredQuantity/1000);
                tempArr.push({batchId:batches[i].batchId,weight:requiredQuantity});
                console.log(batches[i]);
                if(parseFloat(batches[i].weight*1000)< 0.01){
                    console.log("removing");
                    invetoryMap[materialName].shift();
                }
                break
            }
            tempArr.push({batchId:batches[i].batchId,weight:batches[i].weight*1000})
           
            requiredQuantity-=(batches[i].weight*1000)
            invetoryMap[materialName].shift();
            
        }

        return tempArr;

    }

    try {
        product.recipe.map((material)=>{
            materials.push({
                materialName:material.name,
    
                batches:getBatches((manufactureorder.weight*material.percentage/100 ).toFixed(3),material.name),
    
            })
        })
        
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Something Went Wrong");
    }

    

    manufactureorder.status=1;
    manufactureorder.materials=materials;
    manufactureorder.approvedBy = req.user["employeeId"];
    manufactureorder.approvarName = req.user["employeeName"];
    manufactureorder.approvalDate = Date.now();
    try {
        await  inventory.save();
        await  manufactureorder.save(); 
        res.status(200).json({message:"Order Accepted"});
    } catch (error){
        console.log(error);
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
        package:manufacture.package,
        materials:manufacture.materials,
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

   

});




module.exports={startManufacturing,editManufacturing,deletmanufacturing,getManufacturingOrder,manufactureAccepted,maufactureComplete,getCompletedManufactureOrders,getManufacturingOrderDetails}