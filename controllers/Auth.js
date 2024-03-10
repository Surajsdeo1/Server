const User=require("../models/User");
const  OTP=require("../models/Otp");
const otpgenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
require("dotenv").config();



//SEND OTP
exports.sendOTP=async(req,res)=>{
   try {

     // fetch  email from body

     const  {email}=req.body;

     //find user is present in DB or Not

     const checkUserPresent=await User.findOne({email});

     //if user already exits then return the response 

     if(checkUserPresent){
         return res.status(401).json({
            sucess:false,
            message:'User already registered',
         })
 
     }

     // if User is not Registered then generate OTP

    var otp=otpgenerator.generate(6,{
           upperCaseAlphabets:false,
           lowerCaseAlphabets:false,
           specialChars:false,
    });
    console.log("otp generated:",otp);

// check OTP is Unique or not

 let result= await OTP.findOne({otp:otp});
 while(result){
    otp=otpgenerator(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,

 });
 result= await OTP.findOne({otp:otp});
} 
const otpPayload={email,otp};


//create an  entry for otp

    const otpBody=await OTP.create(otpPayload);
    console.log(otpBody);
   

    //return response sucessful

    res.status(200).json({
        sucess:true,
        message:'OTP send sucessfully',
    })



   } catch (error) {
    console.log(error);
    return res.status(500).json({
        sucess:false,
        message:error.message,
    })

    
   }



    };

    // Sign page authentication
    exports.signUp=async (req,res)=>{
        //fetch data from body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accounttype,
            contactNumber,
            otp
        }=res.body;

        //checked all fields are fill or not 

        if(!firstName || !lastName || !email||!password || !confirmPassword|| !otp)
        {
          return res.status(403).json({
                success:false,
                message:"All Fields are requied to fill",
            })
        }

        // check password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword are not match so please fill carefully ",
            })
        }

        //check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success:false,
                message:"Email is already registered ",
            })
        }

        // find most recent OTP  stored for the User
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length==0)
        {
            return res.status(400).json({
                success:false,
                message:"Otp not found ",
            });
        }else if(otp!==recentOtp.otp)
        {
            return res.status(400).json({
                success:false,
                message:"Invalid Otp ",
            });

        }
        //Hash Password
        


    }
    //LogIn page Authen9tication
    exports.login=async(req,res)=>{
        try {
            //get data from req body
            const {email,password}=req.body;
             //validation data
             if(!email || !password)
             {
                return res.status(403).json({
                    success:false,
                    message:"All field are Required to fill"

                });
             }
             //user check exist or not
             const user=await User.findOne({email}).populate("aditionalDetails");
             if(!user){
                return res.status(401).json({
                    success:false,
                    message:" <Sorry to say but>Email is Not registered, please SignUp first"
                });
             }
             //Generate JWT  after password matching
             if(await bcrypt.compare(password,user.password))
             {
                const payload={
                    email:user.email,
                    id:user._id,
                    accountType:user.accountType,

                }
                const token=jwt.sign(payload, process.env.JWT_SECRET,{
                    expiresIn:"2h",

                });
                user.token=token;
                user.password=undefined

           
              //create cookie and send response
              const options={
                expires:new Date(Date.now() +3*24*60*60*1000),
                httpOnly:true,
              }
              res.cookie("token",token,options).status(200).json({
                success:false,
                token,
                user,
                message:'Logged in succesfully',

              })
            }

            else{
                return res.status(401).json({
                  success:false,
                  message:'Password is not matched'
                });
            }
             
          
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:'logIn failer please try again',
            });
            
        }
    }
    //change password
    //TODO HomeWork
    exports.changePassword={
        //get date from req body
        //get oldpassword, newpassword,confirmNewPassword
        //validation
        //update pwd in DB
        //send mail -password updated
        //retrun response

    }
