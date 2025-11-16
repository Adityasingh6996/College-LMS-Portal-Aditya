import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../Context/AppContext';
import Loading from '../../Components/Student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../Components/Student/Footer'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify';
import axios from 'axios';

// ✅ Robust YouTube ID extractor
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  let videoId = null;
  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname;
    if (hostname.includes('youtube.com')) {
      if (urlObject.pathname.includes('/embed/')) {
        videoId = urlObject.pathname.split('/embed/')[1].split(/[?#]/)[0];
      } else {
        videoId = urlObject.searchParams.get('v');
      }
    } else if (hostname.includes('youtu.be')) {
      videoId = urlObject.pathname.substring(1).split(/[?#]/)[0];
    }
  } catch (error) {
    // maybe it's just an ID
    if (typeof url === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    return null;
  }
  return videoId;
};

const Coursedetails = () => {
  const { id } = useParams();
  const {
    allCourses,
    calculateRatings,
    calculateCourseDuration,
    calculateChapterTime,
    calculateNoofLectures,
    currency,
    backend,
    userData,
    getToken
  } = useContext(AppContext)

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  // ▶️ State for player
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null) // { videoId, chapterIndex, lectureIndex, title }

  const fetchCourseData = async () => {
    try {
      const response = await axios.get(backend + '/api/course/' + id);

      if (typeof response.data === 'string' && response.data.startsWith('<!doctype html>')) {
        toast.error('Course details API returned HTML. Backend route may be missing or misconfigured.');
        const fallbackCourse = allCourses?.find(c => c._id === id);
        if (fallbackCourse) setCourseData(fallbackCourse);
        return;
      }

      const data = response.data;
      if (data && data.success && data.courseData) {
        setCourseData(data.courseData);
      } else {
        const fallbackCourse = allCourses?.find(c => c._id === id);
        if (fallbackCourse) setCourseData(fallbackCourse);
        else toast.error(data?.message || 'Course not found');
      }
    } catch (error) {
      const fallbackCourse = allCourses?.find(c => c._id === id);
      if (fallbackCourse) setCourseData(fallbackCourse);
      else toast.error(error.message);
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        toast.warn('Please login to enroll in the course');
        return;
      }

      if (isAlreadyEnrolled) {
        toast.warn('Already Enrolled');
        return;
      }

      const enrollButton = document.querySelector('button#enroll-button');
      if (!enrollButton) return;

      const originalText = enrollButton.textContent;
      enrollButton.textContent = 'Processing...';
      enrollButton.disabled = true;

      let token;
      try {
        token = await getToken();
        if (!token) throw new Error('Failed to get authentication token');
      } catch (authError) {
        toast.error('Authentication failed. Please try logging in again.');
        enrollButton.textContent = originalText;
        enrollButton.disabled = false;
        return;
      }

      const { data } = await axios.post(
        `${backend}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.session_url) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message || 'Enrollment failed');
      }

    } catch (error) {
      toast.error(error.message || 'An error occurred during enrollment');
    } finally {
      const enrollButton = document.querySelector('button#enroll-button');
      if (enrollButton) {
        enrollButton.textContent = isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now';
        enrollButton.disabled = false;
      }
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ▶️ Play a lecture
  const handleLectureClick = (chapterIndex, lectureIndex) => {
    const lecture = courseData.courseContent[chapterIndex]?.chapterContent[lectureIndex];
    if (!lecture) return;

    if (isAlreadyEnrolled || lecture.isPreviewFree) {
      const videoId = getYouTubeVideoId(lecture.lectureUrl);
      if (videoId) {
        setCurrentlyPlaying({
          videoId,
          chapterIndex,
          lectureIndex,
          title: lecture.lectureTitle
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error("Invalid video link");
      }
    } else {
      toast.info("Please enroll to watch this lecture.");
    }
  };

  // ▶️ Next/Previous navigation
  const playNextLecture = () => {
    if (!courseData || !currentlyPlaying) return;
    let { chapterIndex, lectureIndex } = currentlyPlaying;
    let nextLectureIndex = lectureIndex + 1;
    let nextChapterIndex = chapterIndex;

    if (!courseData.courseContent[nextChapterIndex]?.chapterContent[nextLectureIndex]) {
      nextChapterIndex++;
      nextLectureIndex = 0;
    }

    const nextLecture = courseData.courseContent[nextChapterIndex]?.chapterContent[nextLectureIndex];
    if (!nextLecture) {
      toast.info("End of course reached!");
      return;
    }

    handleLectureClick(nextChapterIndex, nextLectureIndex);
  };

  const playPrevLecture = () => {
    if (!courseData || !currentlyPlaying) return;
    let { chapterIndex, lectureIndex } = currentlyPlaying;
    let prevLectureIndex = lectureIndex - 1;
    let prevChapterIndex = chapterIndex;

    if (prevLectureIndex < 0) {
      prevChapterIndex--;
      if (prevChapterIndex >= 0) {
        prevLectureIndex = (courseData.courseContent[prevChapterIndex]?.chapterContent.length || 1) - 1;
      }
    }

    const prevLecture = courseData.courseContent[prevChapterIndex]?.chapterContent[prevLectureIndex];
    if (!prevLecture) {
      toast.info("This is the first lecture.");
      return;
    }

    handleLectureClick(prevChapterIndex, prevLectureIndex);
  };

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left '>
        <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-cyan-600/70 to-white"></div>

        {/* Left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='sm:text-2xl text-4xl underline font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: (courseData.courseDescription || '').slice(0, 200) }}></p>
          <p className='text-sm pt-5'>Course by <span className='text-gray-800 font-semibold'>{courseData.educator?.name || 'Unknown'}</span></p>
          
          {/* Course content */}
          <div className='pt-8 text-gray-700'>
            {(courseData.courseContent || []).map((chapter, index) => (
              <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                  <div className='flex items-center gap-2'>
                    <img className={`transform transition-transform ${openSections[index] ? '' : 'rotate-270'}`} src={assets.down_arrow_icon} alt="" />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>{(chapter.chapterContent || []).length} lectures - {calculateChapterTime(chapter)}</p>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {(chapter.chapterContent || []).map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded'
                          onClick={() => handleLectureClick(index, i)}>
                        <img src={assets.play_icon} alt="" className='w-4 h-4 mt-1' />
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.isPreviewFree && <span className='text-blue-500'>Preview</span>}
                            <p>{humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (Player + course card) */}
        <div className='max-w-course-card z-10 shadow rounded bg-white min-w-[300px] sm:min-w-[420px]'>
          {currentlyPlaying ? (
            <>
              <YouTube
                videoId={currentlyPlaying.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName='w-full aspect-video'
                onEnd={playNextLecture}
              />
              <div className="flex justify-between items-center bg-gray-50 p-2 border-b">
                <button onClick={playPrevLecture} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">&lt; Prev</button>
                <p className="text-sm font-semibold">{currentlyPlaying.title}</p>
                <button onClick={playNextLecture} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Next &gt;</button>
              </div>
            </>
          ) : (
            <img src={courseData.courseThumbnail || ''} alt="" />
          )}

          <div className='p-5'>
            <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>
              {currency}{((courseData.coursePrice || 0) - (courseData.discount || 0) * (courseData.coursePrice || 0) / 100).toFixed(2)}
            </p>
            <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice || 0}</p>
            <p className='md:text-lg text-gray-500'>{courseData.discount || 0}% OFF</p>

            <button id="enroll-button" onClick={enrollCourse}
              className='mt-4 w-full py-3 bg-blue-600 text-white font-medium cursor-pointer'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
}

export default Coursedetails
