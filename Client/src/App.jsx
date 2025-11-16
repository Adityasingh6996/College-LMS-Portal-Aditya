// Vercel-ready: This file is compatible with Vercel deployment
import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from "./Pages/Student/Home.jsx";
import EditCourse from './Pages/Educator/EditCourse.jsx';
import MyEnrollments from './Pages/Student/MyEnrollments.jsx'
import CoursesList from './Pages/Student/CoursesList.jsx'
import Coursedetails from './Pages/Student/Coursedetails.jsx'
import Player from './Pages/Student/Player.jsx'
import Educatorr from './Pages/Educator/Educatorr.jsx'
import Dashboard from './Pages/Educator/Dashboard.jsx'
import AddCourse from './Pages/Educator/AddCourse.jsx'
import MyCourses from './Pages/Educator/MyCourses.jsx'
import StudentEnrolled from './Pages/Educator/StudentsEnrolled.jsx'
import Loading from './Components/Student/Loading.jsx'
import Navbar from './Components/Student/Navbar.jsx';
import { useClerk, useUser,SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import 'quill/dist/quill.snow.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const isEducatorRoute=useMatch('/Educator/*')

  // const {openSignIn}=useClerk()
  // const {user}=useUser()

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Course-List' element={<CoursesList/>}/>
        <Route path='/Course-List/:input' element={<CoursesList/>}/>
        <Route path='/Course/:id' element={<Coursedetails/>}/>
        <Route path='/my-enrollments' element={<MyEnrollments/>}/>
        <Route path='/player/:courseId' element={<Player/>}/>
        <Route path='/loading/:path' element={<Loading/>}/>
        <Route path='/Educator' element={<Educatorr />}>
          <Route path='/Educator' element={<Dashboard/>}/>
          <Route path='add-course' element={<AddCourse/>}/>
          <Route path='my-courses' element={<MyCourses/>}/>
          <Route path='students-enrolled' element={<StudentEnrolled/>}/>
          <Route path='edit-course/:id' element={<EditCourse />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App