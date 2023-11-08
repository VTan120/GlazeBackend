const asyncHandler = require("express-async-handler");

const Packets = require("../models/packetsModel");
const Product= require("../models/productModel");

//@desc Insert ProductName,Weight
//@rout POST api/packets/create_packets
//@acess private

const createPackets= asyncHandler(async(req,res)=>{

    const {productName,packetWeight} =req.body;

    if(!productName || !packetWeight){
        res.status(402);
        throw new Error("All field Mandatory");
    }
    
    const existingProduct= await Product.findOne({name:productName.toLowerCase()})

    if(!existingProduct){
        res.status(402)
        throw new Error("Unknown Product");
    }

    const existingPackets = await Packets.findOne({productName:productName.toLowerCase(),packetWeight});
    
    if(existingPackets){
        res.status(402);
        throw new Error("Packet and Product combination already exists");
    }

    //creating and Saving packets
     const newPacket = new Packets({productName,packetWeight})

     try {
        await newPacket.save();
        res.status(200).json({productName,packetWeight});

     } catch (error) {
        res.status(500);
        throw new Error("Internal Server error");
     }
})

//@desc Get All Type of Product Packets
//@route GET /api/packets/get_all_products_packets
//@access Private

const getAllPackets= asyncHandler( async(req,res)=>{

    try {
        const packets = await Packets.find();
        res.status(200).json(packets)
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error");
    }
})

//@desc Delete PacketsProduct combinatiom
//@route DELETE /api/packets/delete_packets
//@access Private
const deletePackets = asyncHandler( async (req,res) => {
    const {_id} = req.body;

    //checking if all values are inserted
    if(!_id ){
        res.status(402);
        throw new Error("All Fields Are Mandatory");
    }


    //Find and delete the raw material
    try {
        const deleted = await Packets.deleteOne({_id})
        productpackets = await Packets.find();
        res.status(200).json(productpackets);
    } catch (err) {
        console.log(err);
        res.status(402);
        throw new Error("No Such Productpackets");
    }
});


module.exports={createPackets,getAllPackets,deletePackets}