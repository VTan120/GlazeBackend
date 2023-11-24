const asyncHandler = require("express-async-handler");
const POSStore = require("../models/posStoreModel");
const XLSX = require('xlsx');

//@desc Update Inventory
//@route POST /api/pos/update_inventory
//@access Private
const createPOSStore = asyncHandler(async (req,res) => {
    const {storeId, storeLocation} = req.body;

    console.log("inside");

    if(!storeId || !storeLocation || storeId==="" || storeLocation===""){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    console.log("got all data");

    
    try{
        const existingStore = await POSStore.findOne({storeId:storeId.toUpperCase()});
    
        console.log(existingStore);
    
        if(existingStore){
            res.status(402);
            throw new Error("Store Id Already Used");
        }

        const newStore = new POSStore({
            storeId : storeId.toUpperCase(),
            storeLocation: storeLocation.toLowerCase(),
        });

        console.log(newStore);

        const upload = await newStore.save();

        console.log(upload);

        console.log("saved");
        res.status(200).json(newStore);
    }
    catch(err) {
        console.log(err);
        res.status(500);
        throw new Error("Internal Server Error");
    }
});

function updateQuantities(firstArray, secondArray) {
    // Create a map from productBarcode to the corresponding object in the second array
    
  
    // Iterate through the first array and update quantities in the second array
    
}

//@desc Update Inventory
//@route PUT /api/pos/update_inventory
//@access Private
const updateInventory = asyncHandler( async (req,res) => {
    const { storeId } = req.body;
    const file = req.file;
    
    if (!file) {
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }
    
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    var flag = 0;
    var mismatchedProduct = {}
    try {
        const store = await POSStore.findOne({storeId})

        const productMap = store.products.reduce((map, product) => {
            map[product.productBarcode] = product;
            return map;
        }, {});

        jsonData.slice(1).forEach(([barcode, name, productOffer, quantity]) => {
            const product = productMap[barcode];
            if (product) {
              if(product.productName !== name){
                flag = 1;
                mismatchedProduct = {barcode, newName:name, existingName:product.productName};
                throw new Error("Mismatched Barcode Name");
              }
              // Update the quantity
              product.quantity += quantity;
              product.productOffer = productOffer;
            } else {
              // If the product is not found, you can add it to the second array
              store.products.push({ productBarcode: barcode, productName: name, productOffer,quantity });
            }
        });
        await store.save();
        res.status(200).json(store);
    } catch (error) {
        console.log(error);
        if(flag === 1){
            res.status(400).json(mismatchedProduct);
            throw new Error("Mismatched Barcode Name");
        }
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

const getPOSStoreIds = asyncHandler( async (req,res) => {
    //Find and get all raw material
    const stores = await POSStore.find({}).select("storeId storeLocation");

    if(!stores){
        res.status(404);
        throw new Error("Materials Not Found");
    }

    res.status(200).json(stores)
});

const getPOSStore = asyncHandler( async (req,res) => {
    const storeId = req.params.storeId.toUpperCase();
    //Find and get all raw material
    const store = await POSStore.findOne({storeId})

    if(!store){
        res.status(404);
        throw new Error("Materials Not Found");
    }
    res.status(200).json(store);
});

// Store.findOne(
//     { storeId },
//     {
//       products: {
//         $elemMatch: { productId: productIdToFind },
//       },
//     },
//     (err, store) => {
//       if (err) {
//         console.error('Error:', err);
//       } else {
//         if (!store) {
//           console.log('Store not found.');
//         } else {
//           // 'product' will contain the matching product or null if not found
//           const product = store.products[0];
//           console.log('Product:', product);
//         }
//       }
//     }
//   );

module.exports = {updateInventory, createPOSStore, getPOSStoreIds, getPOSStore}