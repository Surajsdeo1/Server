const Categories=require("../models/categories");
//cerate  Tag ka handler function

exports.createCategories=async(req,res)=>{
    try {
        //fetch data
        const {name,description}=req.body;
        //data validation
        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:'All Field are Required'

            });
        }
        //create entry in DB
        const CategoriesDetails=await Categories.create({
            name:name,
            description:description,

        });
        console.log(CategoriesDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:'Categories Created Successfully',
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,

        });
        
    }
};



//getAlltags handler function

exports.showAllCategories=async(req,res)=>{
    try {
         const allCategories=await Categories.find({},{name:true,description:true});
         res.status(200).json({
            success:true,
            message:'All Categories returned successfully',
            allCategories,
         });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,

        });
        
    }
};