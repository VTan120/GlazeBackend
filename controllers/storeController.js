const asyncHandler = require("express-async-handler");
const Store = require("../models/storeModel");
const User = require("../models/userModel");
const RawMaterialInventory = require("../models/rawMaterialInventoryModel");


//@desc Add new raw material/ingredient to database
//@route POST /api/raw_material/add_raw_material
//@access Private
const createStore = asyncHandler( async (req,res) => {
    const {city} = req.body;

    //checking if all values are inserted
    if(!city){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }
    //Checking duplicate materials
    const existingStore = await Store.countDocuments({city});
    try{
        const newStore = new Store({
            storeId : `${city.slice(0,3).toUpperCase()}${existingStore+1}`,
            city: city.toLowerCase(),
        });
        newStore.save();
        const newRawInventory = new RawMaterialInventory({
            storeId : newStore.storeId,
        });
        newRawInventory.save();
        res.status(200).json(newStore);
    }
    catch(err) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);

//@desc Edit raw material/ingredient to database
//@route PUT /api/raw_material/edit_raw_material
//@access Private
const addStoreManager = asyncHandler( async (req,res) => {
    const {employeeId, storeId} = req.body;

    //checking if all values are inserted
    if(!employeeId || !storeId){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    //Checking duplicate materials
    const existingStore = await Store.findOne({storeId});
    if(!existingStore){
        res.status(404);
        throw new Error("No Such Store");
    }

    //getting the material to edit
    const existingUser = await User.findOne({employeeId});
    if(!existingUser){
        res.status(404);
        throw new Error("User Doesnt Exist");
    }

    //Save edited raw material
    try {
        
        existingStore.storeManager = {employeeId, storeManagereName:existingUser.employeeName};
        await existingStore.save();
        res.status(200).json(existingStore);
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);

//@desc Delete raw material/ingredient to database
//@route DELETE /api/raw_material/delete_raw_material
//@access Private
const deleteRawMaterial = asyncHandler( async (req,res) => {
    const {_id} = req.body;

    //checking if all values are inserted
    if(!_id ){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }


    //Find and delete the raw material
    try {
        const deleted = await RawMaterial.deleteOne({_id})
        materials = await RawMaterial.find();
        res.status(200).json(materials);
    } catch (err) {
        console.log(err);
        res.status(402);
        throw new Error("No Such Raw Material");
    }
});


const getStoreIds = asyncHandler( async (req,res) => {
    //Find and get all raw material
    const stores = await Store.find({}).select("storeId");

    if(!stores){
        res.status(404);
        throw new Error("Materials Not Found");
    }

    res.status(200).json(stores)
});


const getRawMaterial = asyncHandler( async (req,res) => {
    const name = req.params["name"].toLowerCase()

    //checking if all values are inserted
    if(!name ){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    const material = await RawMaterial.findOne({$or :[{newEnglishName:newEnglishName.toLowerCase()}, {newHindiName:newHindiName.toLowerCase()}]});

    if(!material){
        res.status(404);
        throw new Error("Material Not Found");
    }

    res.status(200).json(material)
});
 
 


module.exports = {createStore , addStoreManager , getStoreIds}