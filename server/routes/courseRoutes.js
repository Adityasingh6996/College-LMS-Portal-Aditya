import express from 'express'
import { getAllCourses,
  getCourseId,
  createCourse,
  updateCourse,
  deleteCourse} from '../controllers/courseController.js'

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourses)
courseRouter.get('/:id', getCourseId)
courseRouter.post('/', createCourse);         // POST new course
courseRouter.put('/:id', updateCourse);       // PUT update course
courseRouter.delete('/:id', deleteCourse);    // DELETE course

export default courseRouter;