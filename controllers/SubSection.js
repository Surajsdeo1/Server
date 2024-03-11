const SubSection=require("../models/SubSection");
const Section =require("../models/Section");
const {uploadImageCloudinary}=require("../utils/imageUploder");


//create subsection

exports.createSubSection=async(req,res)=>{
    try {
        
        //fetch data from req body
        const {sectionId,title,timeDuration,description}=req.body;

        //extract video file
        const video=req.files.videoFile;
        //validation
        if(!sectionId||!title||!timeDuration||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",

            });
        }
        //upload video to cloudnary
        const uploadDetails=await uploadImageCloudinary(video,process.env.FOLDER_NAME);

        //create a sub-section
        const SubsectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update  section with this sub section ObjectId

        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
            {$push:{
                subSection:SubsectionDetails._id,
            }},
            {new:true},
            );

            //HW:log updated section here, after adding populate query
        //retuurn response
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Sub Section not created",
           error:error.message,
        })
        
    }
};

//HW: updateSubsection 
//HW:delete susection
