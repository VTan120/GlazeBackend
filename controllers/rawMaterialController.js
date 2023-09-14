const asyncHandler = require("express-async-handler");
const RawMaterial = require("../models/rawMaterialModel");


//@desc Add new raw material/ingredient to database
//@route POST /api/raw_material/add_raw_material
//@access Private
const createRawMaterial = asyncHandler( async (req,res) => {
    const {name, expiryTime} = req.body;

    if(!name || !expiryTime){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    const existingMaterial = await RawMaterial.findOne({name});

    if(existingMaterial){
        res.status(402);
        throw new Error("Raw Material Alteady Added");
    }

    try {
        const expiryTimeNum = parseInt(expiryTime);
        const newMaterial = new RawMaterial({
            name,
            expiryTime:expiryTimeNum
        })

        await newMaterial.save();

        res.status(200).json({name:newMaterial.name});
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);

//@desc Add new raw material/ingredient to database
//@route POST /api/raw_material/add_raw_material
//@access Private
const editRawMaterial = asyncHandler( async (req,res) => {
    const {name, expiryTime} = req.body;

    if(!name || !expiryTime){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    const existingMaterial = await RawMaterial.findOne({name});

    if(!existingMaterial){
        res.status(402);
        throw new Error("Raw Material Doesnt Exist");
    }

    try {
        const expiryTimeNum = parseInt(expiryTime);
        const newMaterial = new RawMaterial({
            name,
            expiryTime:expiryTimeNum
        })

        await newMaterial.save();

        res.status(200).json({name:newMaterial.name});
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);

//@desc Add new raw material/ingredient to database
//@route POST /api/raw_material/add_raw_material
//@access Private
const deleteRawMaterial = asyncHandler( async (req,res) => {
    const {name, expiryTime} = req.body;

    if(!name || !expiryTime){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }

    const existingMaterial = await RawMaterial.findOne({name});

    if(existingMaterial){
        res.status(402);
        throw new Error("Raw Material Alteady Added");
    }

    try {
        const expiryTimeNum = parseInt(expiryTime);
        const newMaterial = new RawMaterial({
            name,
            expiryTime:expiryTimeNum
        })

        await newMaterial.save();

        res.status(200).json({name:newMaterial.name});
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
}
);
 


module.exports = {createRawMaterial}