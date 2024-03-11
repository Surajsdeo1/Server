const Section=require("../models/Section");
const Course=require("../models/Course");


exports.createSection=async (req,res)=>{
    try {

        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }

        //create section
        const newSection=await Section.create({sectionName});
        //update course with section ObjectID
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        );
        //TODO HW: use populate to replace sections /sub-secttions both in the updatedCourseDetails

        //return response
        return res.status(200).json({
            success:false,
            message:"section Created succesfully",
            updatedCourseDetails,
        });

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"unable to create Section, please try again",
            error:error.message,
        });
        
    }
}
exports.updateSection=async(req,res)=>{
    try {
        //data input
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:"section updated successfully ",
            
        });
        


        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"unable to update Section, please try again",
            error:error.message,
        });
        
    }

};

exports.deleteSection=async (req,res)=>{
    try {
        //get ID-assuming that we are sending ID in params
        const {sectionId}=req.body;
        //use findByIDand Delete
        await Section.findByIdAndDelete(sectionId);

        //TODO[testing]: do we need to delete the entry from the course schema??
        //retrun  response
        return res.status(200).json({
            success:true,
            message:"section delete Successfully",
            
        });
        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"unable to delete Section, please try again",
            error:error.message,
        });
        
    }
}