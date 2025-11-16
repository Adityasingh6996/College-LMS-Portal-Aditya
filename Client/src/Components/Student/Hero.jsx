import React from 'react'
import { assets } from '../../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from cyan-100/70'>
      <h1 className='text-3xl  md:text-6xl relative font-bold text-gray-900 max-w-3xl mx-auto'>Empower your future with the courses designed to <div className='text-blue-400 '>fit your choice.</div><img src={assets.sketch} alt="sketch" className='md:block hidden absolute -bottom-7 right-0' /></h1>
      <p className='md:block hidden text-gray-500 max-w-2xl mx-auto'>We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.</p>

    </div>

  )
}

export default Hero
