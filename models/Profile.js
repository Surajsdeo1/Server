const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
      gender:{
        type:String,
        
      },
      dobOfBirth:{
        type:String,

      },
      about:{
        type:String,
        trim:true,
      },
      conactNumber:{
        type:Number,
        trim:true,
      }

   

    


});
module.exports=mongoose.model("Profile",profileSchema);