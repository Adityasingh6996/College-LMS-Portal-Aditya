import User from "../models/user.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/course.js";
import { CourseProgress } from "../models/CourseProgress.js";

export const getUserData = async (req,res)=> { 
    try{
        const userId = req.auth.userId
        const user=  await User.findById(userId)

        if(!user){
            return res.json({ success: false, message: 'user not found' })
        }
            res.json({ success: true, user})
    } catch (error){
        res.json({ success: false , message: error.message})
    } 
}
//user enrolled courses with lecture link

export const userEnrolledCourses = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({ success: false , message: error.message})
    }
}

// purchase course

export const purchaseCourse = async (req,res)=>{
    try {
        const { courseId } = req.body
        const userId = req.auth.userId
        const userData =  await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData){
            return res.json({ success: false, message: 'data not found'})
        }

        // Use correct fields and ensure numbers
        const coursePrice = Number(courseData.coursePrice) || 0;
        const discount = Number(courseData.discount) || 0;
        const amount = (coursePrice - (discount * coursePrice / 100));

        // Defensive fallback
        const finalAmount = isNaN(amount) ? 0 : amount;

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: finalAmount,
        }

        const newPurchase = await Purchase.create(purchaseData)


        // Define origin from environment variable
        const origin = process.env.FRONTEND_URL;

        // Initialize Stripe instance
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const currency = process.env.CURRENCY.toLowerCase();

        //creating line items for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount * 100)
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// update user course progress
export const updateUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const { courseId, lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId,courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: 'lecture Already Completed'})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({success: true, message: 'Pogress Updated'})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//get user course progress
export const getUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const { courseId, lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId,courseId})

        res.json({success: true, progressData})
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//add user rating to course

export const addUserRating = async (req,res)=>{
    const userId = req.auth.userId;
    const {courseId, rating} = req.body;

    if(!courseId || !userId || !rating ||rating < 1|| rating > 5){
        return res.json({ success: false, message : 'Invalid details'});
    }

    try {
        const course =  await Course.findById(courseId);

        if(!course){
            return res.json({success: false, message: 'Course Not Found.'});
        }

        const user =  await User.findById(userId);

        if(!user || !userEnrolledCourses.includes(courseId)){
            return res.json({success: false, message: 'User has not purchased this Course.'});
        }

        const existingRatingIndex = course.courserRatings.findIndex(r => r.userId === userId)

        if(existingRatingIndex > -1){
            course.courserRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courserRatings.push({userId, rating});
        }
        await course.save();

        return res.json({success: true, message: 'Rating Added'})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

} 
