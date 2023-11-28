const asyncHandler = require("express-async-handler");
const RawMaterialInventory = require("../models/rawMaterialInventoryModel");


//@desc Update Inventory
//@route PUT /api/raw_material_inventory/update_inventory
//@access Private
const updateInventory = asyncHandler(async(req,res) => {
    const {storeId, materials} = req.body;

    if(!storeId || !materials){
        res.status(400)
        throw new Error("All fields not provided");
    }

    const store = await RawMaterialInventory.findOne({storeId});

    if(!store) {
        res.status(404);
        throw new Error("Store Not Found");
    }

    const materialMap = store.rawMaterials.reduce((map, material) => {
        map[material.name] = material;
        return map;
    })

    materials.forEach(({materialName, weight,price}) => {
        const material = materialMap[materialName];
        if (material) {
          // Update the quantity
          material.batches.push({batchId:store.latestBatch+1,weight,date:Date.now()});
          product.productOffer = productOffer;
        } else {
          // If the product is not found, you can add it to the second array
          store.rawMaterials.push({ name: materialName, batches: [{batchId:store.latestBatch+1,weight,date:Date.now()}] });
        }
    });

    store.latestBatch +=1;

    try {
        await store.save();
        res.status(200).json({message:"Inventory Updated"})
    } catch (error) {
        res.status(500);
        throw new Error("Something Went Wrong")
    }
});

const updateInventoryAfterOrder = asyncHandler(async({storeId, materials}) => {

    console.log("updating inventory");

    if(!storeId || !materials){
        return(false);
    }
    // console.log(storeId, materials);
    const store = await RawMaterialInventory.findOne({storeId});

    console.log(store);

    if(!store) {
        return(false);
    }

    const materialMap = store.rawMaterials.reduce((map, material) => {
        map[material.name] = material;
        return map;
    }, {})

    materials.forEach(({materialName, weight}) => {
        const material = materialMap[materialName];
        if (material) {
          // Update the quantity
          material.batches.push({batchId:store.latestBatch+1,weight,date:Date.now()});
        } else {
          // If the product is not found, you can add it to the second array
          store.rawMaterials.push({ name: materialName, batches: [{batchId:store.latestBatch+1,weight,date:Date.now()}] });
        }
    });

    console.log("changes to batches");
    store.latestBatch +=1;
    console.log("changes to batchno");

    try {
        await store.save();
        console.log("changes saved");
        return(true);
    } catch (error) {
        return(false);
    }
});

module.exports = {updateInventory, updateInventoryAfterOrder};