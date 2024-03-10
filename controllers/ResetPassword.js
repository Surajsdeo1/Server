const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");


//reset PasswordToken
exports.resetPasswordToken=async(req,res)=>{
    try {
           //get email fro email ki body
 const email=req.body.email;


 //check user from this mail,email validation
 const user=await User.findOne({email:email});
 if(!user){
     return res.json({
         success:false,
         message:'your Email is not registered with us'
     });
 }
 //genertate token 
 const token =crypto.randomUUID();
 //update user by adding token expiration time
   const updatedDetails=await User.findOneAndUpdate({
     email:email},
     {
         token:token,
         resetPasswordExpires:Date.now() +5*60*1000,
     },
     // updated document  return hota h "new:true" se
     {new:true}

   );
 //create url
 const  url=`http://localhost:3000/update-password/${token}`
 //sen mail containing the url
 await mailSender(email,"Password Reset Link",
 `Password Reset Link:${url}`);
 //return response 
 return res.json({
     success:true,
     message:'Email sent successfully, please check email and change pwd',
 });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:" Something went wrong while sending reset pwd mail "

        });
        
    }
}

 
//reset Password

exports.resetPassword= async(req,res)=>{
   try {
     //data fetch
     const {password,confirmPassword,token}=req.body;
     //data validation
     if(password !== confirmPassword){
         return res.json({
             success:false,
             message:'Password not matching',
         });
     }
     //get userdatails from DB using token
     const userDetails=await User.findOne({token:token});
 
     //if no  entry -invalid token 
     if(!userDetails){
         return res.json({
             success:false,
             message:"Token is Invalid"
         });
     }
     //token time check
     if(userDetails.resetPasswordExpires<Date.now()){
         return res.json({
             sucess:false,
             message:'Token is expired, please regenerate your token',
         });
     }
     //hash pwd
     const hashedPassword=await bcrypt.hash(password,10);
     //password update
     await User.findOneAndUpdate({
         token:token
     },
     {
         password:hashedPassword
 
     },
     {
         new:true
     },);
 
     //return response
     return res.status(300).json({
         success:true,
         meaages:'Password reset succesful',
     });
    
   } catch (error) {
    console.log(error);
        return res.status(500).json({
            success:false,
            message:" Something went wrong while sending reset pwd mail "

        });
   }
}