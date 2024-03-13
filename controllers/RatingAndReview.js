const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;// user spelling m mistack ho skta h dhyan dena
        //fetchdata from req body
        const { rating, review, courseId } = req.body;
        //check if user is enrolled or not 
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentEnrolled: { $elemMatch: { $eq: userId } },
        })
        if (!courseDetails) {
            return res.status(404).json({
                success: true,
                message: 'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        // create  rating and review

        //up9date course with this rating/review 

    } catch (error) {

    }
}