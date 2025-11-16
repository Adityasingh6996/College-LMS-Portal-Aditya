import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context/AppContext';
import Loading from '../../Components/Student/Loading';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { currency, backend, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backend}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCourse = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this course?");
    if (!confirm) return;

    try {
      const token = await getToken();
      const { data } = await axios.delete(`${backend}/api/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Course deleted');
        fetchEducatorCourses();
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  const filteredCourses = courses?.filter(course =>
    course.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='w-full'>
        <div className='flex justify-between items-center pb-4'>
          <h2 className='text-lg font-medium'>My Courses</h2>
          <input
            type='text'
            placeholder='Search courses...'
            className='border border-gray-300 rounded px-3 py-1 w-64'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto table-fixed w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold'>Course</th>
                <th className='px-4 py-3 font-semibold'>Earnings</th>
                <th className='px-4 py-3 font-semibold'>Students</th>
                <th className='px-4 py-3 font-semibold'>Published</th>
                <th className='px-4 py-3 font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-700'>
              {filteredCourses.map((course) => (
                <tr key={course._id} className='border-b border-gray-300'>
                  <td className='px-4 py-3 flex items-center space-x-3'>
                    <img src={course.courseThumbnail} className='w-16 rounded shadow' alt="Course" />
                    <span className='truncate'>{course.courseTitle}</span>
                  </td>
                  <td className='px-4 py-3'>
                    {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                  </td>
                  <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
                  <td className='px-4 py-3'>{course.isPublished ? 'Yes' : 'No'}</td>
                  <td className='px-4 py-3 flex space-x-2'>
                    <button
                      onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                      className='px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className='px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No courses found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />;
};

export default MyCourses;