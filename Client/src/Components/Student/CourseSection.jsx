import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext.jsx'
import Coursecard from './Coursecard'
import './CourseSection.css'
import { useClerk, useUser ,UserButton} from '@clerk/clerk-react'

const CourseSection = () => {
  const {allCourses}=useContext(AppContext)
  const {openSignIn}=useClerk()
  const {user}=useUser()
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-700'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design to <br/>business and wellness, our courses are crafted to deliver results.</p>
      <div className='grid auto gap-3 px-4 md:px-0 md:my-14'>
        {allCourses.slice(0,4).map((course,index)=> <Coursecard key={index} course={course}/>)}
      </div>
      <button onClick={() => {  
        if (user) {
          window.scrollTo(0, 0);
          window.location.href = '/Course-List';
        } else {
          openSignIn();
          }
        }}
        className='text-gray-600 border border-gray-500/30 px-10 py-3 rounded cursor-pointer'
       >Show all courses
      </button>
    </div>
  )
}

export default CourseSection
