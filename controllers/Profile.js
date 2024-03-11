const Profile=require("../models/Profile");
const User = require("../models/User");




exports.updateProfile=async(req,res)=>{
    try {
       //get data

       const {dateOfBirth="",about="", contactNumber,gender}=req.body;

       //get userId
       
       const id=req.User.id;//syad User ka speling galat h user hoga syd
       //validation
       if(!contactNumber||!gender||!id)
       {
        return res.status(400).json({
            success:false,
            message:'All fields  are required',
        });

       }
       //find profile
       const userDetails=await User.findById(id);
       const profileId=userDetails.additionalDetails;
       const profileDetails=await Profile.findById(profileId);
       //update profile

       profileDetails.dateOfBirth=dateOfBirth;
       profileDetails.about=about;
       profileDetails.gender=gender;
       profileDetails.contactNumber=contactNumber;
       await profileDetails.save();
       //return response 
       return res.status(200).json({
        success:true,
        message:"profile update succefully",
        profileDetails,
       })


        
    } catch (error) {
        return res.status(500).json({
            success:false,
           error:error.message,
        
        });
}
};

//deleteAccount

exports.deleteAccount=async(req,res)=>{
    try {
        //get id
        const id=req.User.id;//syad User ka speling galat h user hoga syd

        //validation id
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
         //Todo:Hw unenroll user from all enrolled course
        //delete user
        await User.findByIdAndDelete({_id:id});

       
        //return response
        return res.status(200).json({
            success:true,
            message:'Account deleted succefully',

        })

        
    } catch (error) {
        return res.status(200).json({
            success:false,
            message:'user cannot  deleted successfully',
        
    });
}
};





exports.getAllUserDetails=async(req,res)=>{
    try {
        //get id
        const id=req.User.id;//syad User ka speling galat h user hoga syd
        //validation and get user details
        const userDetails=await User.findById(id).populate("additionalDetails").exex();
         //return response
        return res.status(200).json({
            success:true,
            message:'User Date fetched Successfully',
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
        
    }
}
