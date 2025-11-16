
import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../Context/AppContext'
import { Line } from 'rc-progress'
import Footer from '../../Components/Student/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyEnrollments = () => {
  const { enrolledCourses = [], calculateCourseDuration, navigate, backend, getToken, calculateNoofLectures } = useContext(AppContext)
  const [progressArray, setProgressArray] = useState([])
  const [loading, setLoading] = useState(true)

  const getCourseProgress = async () => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      setLoading(false);
      return;
    }
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const { data } = await axios.post(`${backend}/api/user/get-course-progress`,
              { courseId: course._id },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const totalLectures = calculateNoofLectures(course);
            const lecturesCompleted = data?.progressData?.lecturesCompleted?.length || 0;
            return { totalLectures, lecturesCompleted };
          } catch (err) {
            console.error('Error fetching course progress:', err);
            return { totalLectures: 0, lecturesCompleted: 0 };
          }
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCourseProgress();
    // Only run when enrolledCourses changes
    // eslint-disable-next-line
  }, [enrolledCourses]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">My Enrollments</h1>
        <p>No courses enrolled yet.</p>
      </div>
    );
  }

  return (
    <>
    <div className='md:px-36 px-8 pt-10'>
      <h1 className='text-2xl font-semibold'>My Enrollments</h1>
      <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
          <tr>
            <th className='px-4 py-3 font-semibold truncate'>Course</th>
            <th className='px-4 py-3 font-semibold truncate'>Duration</th>
            <th className='px-4 py-3 font-semibold truncate'>Completed</th>
            <th className='px-4 py-3 font-semibold truncate'>Status</th>
          </tr>
        </thead>
        <tbody className='text-gray-800'>
          {
            enrolledCourses.map((course,index)=>(
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt=""  className='w-14 sm:w-24 md:w-28'/>
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>
                      {course.courseTitle}
                    </p>
                    <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lecturesCompleted / progressArray[index].totalLectures) *100 : 0} className='bg-gray-300 rounded-full'></Line>
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>{progressArray[index] && `${progressArray[index].lecturesCompleted} / ${progressArray[index].totalLectures}`} <span> Lectures</span></td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button 
                    className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white cursor-pointer' 
                    onClick={()=> navigate('/player/' + course._id)}
                  >
                    {progressArray[index] ? 
                      (progressArray[index].lecturesCompleted === progressArray[index].totalLectures ? 'Completed' : 'Ongoing')
                      : 'Loading...'
                    }
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    <br/>
    <br/>
    <Footer/>
    </>
  )
}

export default MyEnrollments
