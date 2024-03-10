const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploder");



//createCourese handler function

exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        //get Thumbnail
        const thumbnail = req.files.thumbnailImage;


        //validation

        if (!!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
            return res.status(400).json({
                success: false,
                message: 'All field are Required',
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);
        //Todo: verify that userId and instructorDetails._id are same or different? 


        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'Instructor Details not found',
            });
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: 'Tag Details not found',
            });
        }

        //Upload Image topp cloudnary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //CREATE AN ENTRY for new Course


        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouwillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })
        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {
                _id: instructorDetails._id,

            },
            {
                $push: {
                    courses: newCourse._id,
                }
            }, { new: true },

        );

        //update the Tag ka  schema
        //TODO:hw


        //return response
        return res.status(200).json({
            success: true,
            message: "Coourse Created Successfully",
            data: newCourse,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create Course',
            error: error.message,

        })
    }
};





//getAllCourse handler function
exports.showAllCourses = async (req, res) => {
    try {
        //TOdo: change the below  statement incrementally--maine likh liya h 
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentEnrilled: true,
           

        })
        .populate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:allCourses,
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch course data',
            error: error.message,

        })
    }
}







//getAllCourse handler function