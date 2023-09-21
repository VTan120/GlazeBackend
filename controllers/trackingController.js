const asyncHandler = require("express-async-handler");

const Tracking =require("../models/trackingModel");

//@desc Insert trackingid,Ordenumber
//@route POST /api/tracking/create_tracking
//@access Private

const createTracking= asyncHandler(async (req,res)=>{
   //Stores orderNumber and trackingNumber 
    const{orderNumber,trackingNumber}=req.body;

     if(!orderNumber || !trackingNumber){
        res.status(402);
        throw new Error("All field Mandatory");
     }

     const existingOrder =await Tracking.findOne({orderNumber});
     const existingTracking =await Tracking.findOne({trackingNumber});

     if(existingOrder || existingTracking){
        res.status(402);
        throw new Error("Tracking all ready exist");
     }
     
     const newOrder= new Tracking({orderNumber,trackingNumber});

     try {
        await newOrder.save();
        res.status(200).json({orderNumber,trackingNumber});

     } catch (error) {
        res.status(500);
        throw new Error("Internal Server error");
     }

  })
  
//@desc Get All Tracking Information
//@route GET /api/tracking/get_tracking_info
//@access Private
  const getAllTracking=asyncHandler(async(req,res)=>{
      
       var trackingrecord;

       trackingrecord= await Tracking.find()

       if(!trackingrecord){
         res.status(404);
         throw new Error("Tracking data not found");
       }

       res.status(200).json(trackingrecord);

  })

  module.exports ={createTracking,getAllTracking};



