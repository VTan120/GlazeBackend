const asyncHandler = require("express-async-handler");
const RawMaterial = require("../models/rawMaterialModel");


//@desc Add new raw material/ingredient to database
//@route POST /api/raw_material/add_raw_material
//@access Private
const createRawMaterial = asyncHandler( async (req,res) => {
    const {englishName, hindiName, expiryTime} = req.body;

    //checking if all values are inserted
    if(!englishName || !hindiName || !expiryTime){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    //Checking duplicate materials
    const existingMaterial = await RawMaterial.findOne({$or :[{englishName:englishName.toLowerCase()}, {hindiName:hindiName.toLowerCase()}]});
    if(existingMaterial){
        res.status(402);
        throw new Error("Raw Material Alteady Added");
    }



    //Create and save new raw material
    try {
        //Making sure expiryTime is integer
        const expiryTimeNum = parseInt(expiryTime);
        const newMaterial = new RawMaterial({
            englishName:englishName.toLowerCase(),
            hindiName:hindiName.toLowerCase(),
            expiryTime:expiryTimeNum
        })

        await newMaterial.save();

        materials = await RawMaterial.find();
        res.status(200).json(materials);
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);

//@desc Edit raw material/ingredient to database
//@route PUT /api/raw_material/edit_raw_material
//@access Private
const editRawMaterial = asyncHandler( async (req,res) => {
    const {_id, newEnglishName, newHindiName, expiryTime} = req.body;

    //checking if all values are inserted
    if(!_id || !newEnglishName || !newHindiName  || !expiryTime){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    //Checking duplicate materials
    const duplicateMaterial = await RawMaterial.findOne({$or :[{newEnglishName:newEnglishName.toLowerCase()}, {newHindiName:newHindiName.toLowerCase()}]});
    if(duplicateMaterial){
        res.status(402);
        throw new Error("Raw Material Alteady Added");
    }

    //getting the material to edit
    const existingMaterial = await RawMaterial.findOne({_id});
    if(!existingMaterial){
        res.status(402);
        throw new Error("Raw Material Doesnt Exist");
    }

    //Save edited raw material
    try {
        const expiryTimeNum = parseInt(expiryTime);
        existingMaterial.englishName = newEnglishName.toLowerCase();
        existingMaterial.hindiName = newHindiName.toLowerCase();
        existingMaterial.expiryTime = expiryTimeNum;

        await existingMaterial.save();
        materials = await RawMaterial.find();
        res.status(200).json(materials);
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


const getAllRawMaterials = asyncHandler( async (req,res) => {
    //Find and get all raw material
    const materials = await RawMaterial.find();

    if(!materials){
        res.status(404);
        throw new Error("Materials Not Found");
    }

    res.status(200).json(materials)
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
 
 


module.exports = {createRawMaterial, deleteRawMaterial, editRawMaterial, getAllRawMaterials, getRawMaterial}