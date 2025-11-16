import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import { v2 as cloudinary } from 'cloudinary';

const educatorRouter = express.Router();

//add educator role

educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', protectEducator, addCourse)
educatorRouter.get('/Courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default educatorRouter;
