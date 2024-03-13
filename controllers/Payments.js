const { instance } = require("../config/razorpay");
const Course = require("../models/Course");

const User = require("../models/User");
const mailSender = require("../utils/mailSender");


const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");




//capture the payment and initiate the Razorpay order

exports.capturePayment = async (req, res) => {
    //get course id and user id

    const { course_id } = req.body;

    const userId = req.body.id;

    //validation
    //valid course id 
    if (!course_id) {
        return res.json({
            success: false,
            message: "Please provide valid course ID",
        });
    };

    //valid courseDetails
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: 'Could not find the course',
            });
        }
        //user already pay for the same course

        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentEnrolled.includes(uid)) {//studentisEnrolled course models m nhi h
            return res.status(200).json({
                success: false,
                message: 'Student is already enrolled',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString,
        notes: {
            courseID: course_id,
            userId,
        }
    };
    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: PaymentResponse.id,
            amount: paymentResponse.amount,
            currency: paymentResponse.currency,
        });


    } catch (error) {

        console.log(error);
        res.json({
            success: false,
            message: "Could notinitate order",
        });

    }


    //return response
};
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");


    if (signature === digest) {
        console.log("payment is authorised");

        const { courseId, userId } = req.body.payload.payment.entity.notes;
        try {
            //fufil the action
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {
                    _id: courseId
                },
                { $push: { studentEnrolled: userId } },
                { new: true },
            )
            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: 'Course not found',
                });

            }
            console.log(enrolledCourse);

            //find the student andadd the course to their list enrolled course me

            const enrolledStudent = await Course.findOneAndUpdate(
                {
                    _id: userId
                },
                { $push: { course: courseId } },
                { new: true },
            )
            console.log(enrolledStudent);

            //mail send krdo confirmation ka
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "congratulation from Pathsala",
                "Congratulations you are onboarded into new Pathsala Course",
            );


            console.log(emailResponse);
            return res.status(200).json({
                success: true,
                message: "Signature Verified and Course Added",
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }


    }

    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }

};


