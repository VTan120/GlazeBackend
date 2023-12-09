const asyncHandler = require("express-async-handler");
const Counter= require("../models/counterModel");
const POSBll = require("../models/posBll");
const POSStore = require("../models/posStoreModel");

//@desc Update Inventory
//@route PUT /api/raw_material_inventory/update_inventory
//@access Private
const saveBill = asyncHandler(async(req,res) => {
    const {storeId, payment,products,customerPhoneNumber,customerName} = req.body;

    if(!storeId || !payment || !products || !customerPhoneNumber || !customerName){
        res.status(402)
        throw new Error("All fields not provided");
    }

    try {
        const store = await POSStore.findOne({storeId})

        if(!store){
            res.status(404);
            throw new Error("Store Not Found");
        }
    
        const productMap = store.products.reduce((map, product) => {
            map[product.productId] = product;
            return map;
        }, {});

        products.map((product) => {
            productInStore  = productMap[product.productId];

            if (product) {
                // Update the quantity
                productInStore.quantity -= product.quantity;
            }
        });

        await store.save();

        console.log(products);

        const billCounter = await Counter.findOne({name:"posBillCounter"});
        const billNo = billCounter.count +1;
        billCounter.count +=1;
        billCounter.save();

        const bill = new POSBll({
            storeId,
            payment,
            products,
            customerPhoneNumber,
            customerName,
            billNo
        });
        
        bill.save();
        res.status(200).json({message:"Inventory Updated"})
    } catch (error) {
        res.status(500);
        throw new Error("Something Went Wrong")
    }
});

const getAllPOSBills = asyncHandler(async(req,res) => {
    const storeId = req.params.storeId;

    if(!storeId ){
        res.status(402)
        throw new Error("All fields not provided");
    }

    try {
        const bills = await POSBll.find({storeId})

        if(!bills){
            res.status(404);
            throw new Error("Store Not Found");
        }
        res.status(200).json(bills)
    } catch (error) {
        res.status(500);
        throw new Error("Something Went Wrong")
    }
});

const getPOSBillByNo = asyncHandler(async(req,res) => {
    const billNo = req.params.billNo;

    if(!billNo ){
        res.status(402)
        throw new Error("All fields not provided");
    }

    const bill = await POSBll.findOne({billNo})

    if(!bill){
        res.status(404);
        throw new Error("Bill Not Found");
    }
    try {
        res.status(200).json(bill)
    } catch (error) {
        res.status(500);
        throw new Error("Something Went Wrong")
    }
});

const getPOSBillByPhone = asyncHandler(async(req,res) => {
    const customerPhoneNumber = req.params.phoneNo;

    if(!customerPhoneNumber ){
        res.status(402)
        throw new Error("All fields not provided");
    }
    const bills = await POSBll.find({customerPhoneNumber})

    if(!bills){
        res.status(404);
        throw new Error("Bill Not Found");
    }
    try {
        res.status(200).json(bills)
    } catch (error) {
            res.status(500);
            throw new Error("Something Went Wrong")
        
    }
});

module.exports = {saveBill, getAllPOSBills, getPOSBillByNo, getPOSBillByPhone};