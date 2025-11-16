import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'
import { Link } from 'react-router-dom'
const Coursecard = ({course}) => {
  const { currency } = useContext(AppContext)
  const { calculateRatings } = useContext(AppContext)

  if (!course) return null;
  return (
    <Link to={'/course/' + (course._id || '')} onClick={()=>scrollTo(0,0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
      <img src={course.courseThumbnail || assets.course_1} alt="" className='w-full'/>
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle || 'Untitled Course'}</h3>
        <p className='text-gray-600'>{(course.educator && course.educator.name) ? course.educator.name : 'Unknown Educator'}</p>
        <div className='flex items-center justify-between space-x-2'>
          <p>{calculateRatings(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, index) => (
              <img key={index} src={index < Math.floor(calculateRatings(course)) ? assets.star : assets.star_blank} alt="star" className='w-3.5 h-3.5'/>
            ))}
          </div>
          <p className='text-gray-500'>{(course.courseRatings && course.courseRatings.length) ? course.courseRatings.length : 0}</p>
        </div>
        <p className='text base font-semibold text-gray-800'>{currency}{(course.coursePrice && course.discount !== undefined) ? ((course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)) : '0.00'}</p>
      </div>
    </Link>
  )
}

export default Coursecard
