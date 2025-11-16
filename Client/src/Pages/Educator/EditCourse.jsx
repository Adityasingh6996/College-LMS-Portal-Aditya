// EditCourse.jsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCourse = () => {
  const { backend, getToken } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseData, setCourseData] = useState({
    courseTitle: '',
    coursePrice: 0,
    discount: 0,
    thumbnail: '',
    courseContent: [],
  });

  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error('Image upload failed');
      return null;
    }
  };

  const fetchCourse = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backend}/api/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        const { courseTitle, courseDescription, coursePrice, discount, courseContent, thumbnail } =
          data.courseData;

        setCourseData({
          courseTitle,
          coursePrice,
          discount,
          thumbnail,
          courseContent,
        });

        if (quillRef.current) {
          quillRef.current.root.innerHTML = courseDescription;
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
    fetchCourse();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: name === "coursePrice" || name === "discount" ? Number(value) : value,
    });
  };

  const handleChapter = (action, chapterId) => {
    const chapters = [...courseData.courseContent];
    if (action === 'add') {
      const title = prompt('Enter Chapter Title:');
      if (!title) return;
      chapters.push({
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder: chapters.length + 1,
      });
    } else if (action === 'remove') {
      const filtered = chapters.filter((ch) => ch.chapterId !== chapterId);
      setCourseData({ ...courseData, courseContent: filtered });
      return;
    } else if (action === 'toggle') {
      chapters.forEach((ch) => {
        if (ch.chapterId === chapterId) ch.collapsed = !ch.collapsed;
      });
    }
    setCourseData({ ...courseData, courseContent: chapters });
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    const chapters = [...courseData.courseContent];
    const chapter = chapters.find((ch) => ch.chapterId === chapterId);
    if (!chapter) return;

    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      chapter.chapterContent.splice(lectureIndex, 1);
      setCourseData({ ...courseData, courseContent: chapters });
    }
  };

  const handleAddLectureToChapter = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
      toast.error('All fields required');
      return;
    }
    const updatedChapters = courseData.courseContent.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        return {
          ...chapter,
          chapterContent: [
            ...chapter.chapterContent,
            {
              ...lectureDetails,
              lectureId: uniqid(),
              lectureOrder: chapter.chapterContent.length + 1,
              lectureDuration: Number(lectureDetails.lectureDuration),
            },
          ],
        };
      }
      return chapter;
    });

    setCourseData({ ...courseData, courseContent: updatedChapters });
    setLectureDetails({ lectureTitle: '', lectureDuration: '', lectureUrl: '', isPreviewFree: false });
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = courseData.thumbnail;
    if (image) {
      const uploaded = await uploadImageToCloudinary(image);
      if (!uploaded) return;
      imageUrl = uploaded;
    }

    const payload = {
      ...courseData,
      coursePrice: Number(courseData.coursePrice),
      discount: Number(courseData.discount),
      courseDescription: quillRef.current.root.innerHTML,
      thumbnail: imageUrl,
    };

    console.log("Final Payload Sent:", payload);

    try {
      const token = await getToken();
      const { data } = await axios.put(`${backend}/api/course/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success('Course updated');
        navigate('/educator/my-courses');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input type="text" name="courseTitle" value={courseData.courseTitle} onChange={handleChange} placeholder="Course Title" className="w-full border p-2 rounded" required />

        <div>
          <label>Description</label>
          <div ref={editorRef} className="border p-2 rounded min-h-[120px]"></div>
        </div>

        <input type="number" name="coursePrice" value={courseData.coursePrice} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Price" />

        <input type="number" name="discount" value={courseData.discount} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Discount %" />

        <div>
          <label>Thumbnail</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          {courseData.thumbnail && <img src={courseData.thumbnail} alt="thumb" className="max-h-16 mt-2" />}
        </div>

        {courseData.courseContent.map((chapter, i) => (
          <div key={chapter.chapterId} className="border p-3 rounded mb-3">
            <div className="flex justify-between">
              <strong>{i + 1}. {chapter.chapterTitle}</strong>
              <div className="space-x-2">
                <button type="button" onClick={() => handleChapter('toggle', chapter.chapterId)}>Toggle</button>
                <button type="button" onClick={() => handleChapter('remove', chapter.chapterId)}>Remove</button>
              </div>
            </div>
            {!chapter.collapsed && (
              <div className="pl-4 mt-2">
                {chapter.chapterContent.map((lecture, j) => (
                  <div key={lecture.lectureId} className="text-sm flex justify-between">
                    {j + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins
                    <button type="button" onClick={() => handleLecture('remove', chapter.chapterId, j)}>x</button>
                  </div>
                ))}
                <button type="button" onClick={() => handleLecture('add', chapter.chapterId)}>+ Add Lecture</button>
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={() => handleChapter('add')} className="bg-gray-200 p-2 rounded">+ Add Chapter</button>

        {showPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="bg-white p-4 rounded w-96 relative">
              <h3 className="text-lg font-semibold mb-2">Add Lecture</h3>
              <input placeholder="Title" value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} className="w-full border p-1 mb-2" />
              <input type="number" placeholder="Duration" value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })} className="w-full border p-1 mb-2" />
              <input placeholder="URL" value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} className="w-full border p-1 mb-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} />
                Free Preview
              </label>
              <div className="flex justify-between mt-4">
                <button type="button" onClick={handleAddLectureToChapter} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                <button type="button" onClick={() => setShowPopup(false)} className="text-red-500">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded mt-4">Update Course</button>
      </form>
    </div>
  );
};
export default EditCourse;
