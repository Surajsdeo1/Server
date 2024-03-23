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



exports.categoryPageDetails=async(req,res)=>{
    try {
        const {categoryId}=req.body;
        //get course for the specified category
        const selectedCategory=await Categories.findById(categoryId)
        .populate("courses")
        .exec();
        console.log(selectedCategory);
        //handle the case when the category is not found
        if(!selectedCategory){
            console.log("Category not found");
            return res.status(404).json({
                success:false,
                message:"category not found",
            });
        }
        //handle the case when there are no course
        if(selectedCategory.course.length===0){
            console.log("No course found for the selected  category.");
            return res.status(404).json({
                success:false,
                message:"No course found for the selected  category.",
            });

        }
        const selectedCourses=selectedCategory.course;
        //get courses for other categories
        const categoriesExceptSelected=await Categories.find({
            _id:{$ne:categoryId},

        }).populate("courses");
        let differentCourses=[];
        for(const  category of categoriesExceptSelected){
            differentCourses.push(...category.courses);
        }

        //get top selling course across all categories

        const allCategories=await Categories.find().populate("courses");
        const allCourses=allCategories.flatMap((category) => category.courses);
        const mostSellingCourses =allCourses
        .sort(( a,b)=>b.sold-a.sold)
        .slice(0,10);


  res. status(200).json({
    selectedCourses:selectedCourses,
    differentCourses:differentCourses,
    mostSellingCourses:mostSellingCourses,
  });

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        });
        
        
    }
};