import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../Components/Educator/Navbar'
import SideBar from '../../Components/Educator/SideBar'
import Footer from '../../Components/Educator/Footer'

const Educatorr = () => {
  return (
    <div className='text-default min-h-screen flex flex-col bg-white'>
      <Navbar />
      <div className='flex flex-1'>
        <SideBar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )
}


export default Educatorr
