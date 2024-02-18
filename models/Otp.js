const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const oTPSchema=new mongoose.Schema({
     email:{
        type:String,
        required:true,
     },
     otp:{
        type:String,
        required:true,

     },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,

     }

   

});
async function sendVarificationEmail(email,otp){
   try {
      const mailResponse=await mailSender(email,"Varification  Email from Pathsala",otp);
      console.log("Email send successfull:", mailResponse);
      
   } catch (error) {
      console.log("Error occured while sending mails:",error);
      throw error;
   }
       }
       oTPSchema.pre("save", async function(next){
         await sendVarificationEmail(this.email,this.otp);
         next();
       } )
       
module.exports=mongoose.model("OTP",oTPSchema);