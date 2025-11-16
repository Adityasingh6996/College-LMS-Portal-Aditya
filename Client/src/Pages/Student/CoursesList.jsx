import React, { useContext, useState ,useEffect} from 'react'
import { AppContext } from '../../Context/AppContext'
import Searchbar from '../../Components/Student/Searchbar'
import { useParams } from 'react-router-dom'
import Coursecard from '../../Components/Student/Coursecard'
import { assets } from '../../assets/assets'
import Footer from '../../Components/Student/Footer'

const CoursesList = () => {
  const {navigate, allCourses}= useContext(AppContext)
  const {input}=useParams()
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(()=>{
    console.log('allCourses:', allCourses);
    console.log('input:', input);
    
    if(allCourses && allCourses.length>0){
      const tempCourses=allCourses.slice();
      console.log('tempCourses:', tempCourses);

      if(input){
        const filtered = tempCourses.filter(
          item =>item.courseTitle.toLowerCase().includes(input.toLowerCase())
        );
        console.log('filtered courses:', filtered);
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(tempCourses);
      }
    } else {
      console.log('No courses available or courses array is empty');
      setFilteredCourses([]);
    }
  },[allCourses,input])

  return (
    <>
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div>
        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
        <p className='text-gray-600'><span className='text-blue-400 cursor-pointer' onClick={()=> navigate('/')}>Home</span> / <span>Course List </span></p>
        </div>
        <Searchbar data={input}/>
      </div>
      {
        input && <div className='inline-flex items-center gap-4 px-4 py-2 border border-gray-400 mt-4 text-gray-600'>
          <p>{input}</p>
          <img src={assets.cross_icon} alt="" onClick={()=> navigate('/Course-List')} className='cursor-pointer'/>
        </div>
      }
      <div className='my-16 px-2 md:p-0'>
        {filteredCourses.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
            {filteredCourses.map((course, index) => (
              <Coursecard key={index} course={course} />
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 text-lg font-semibold'>
            No such courses found
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default CoursesList
