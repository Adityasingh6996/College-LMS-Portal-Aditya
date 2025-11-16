import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='py-2 flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>
      <div className='flex items-center gap-2'>
        {/* <img src={assets.logo} alt="logo" className='hidden md:block w-20' /> */}
        <h1 className='text-white text-2xl font-semibold '>AIM</h1>
        <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
        <p className='py-2 text-center text-xs md:text-sm text-gray-700'> Copyright 2025 &copy; AIM. All rights reserved</p>
      </div>
      <div className='flex items-center gap-3 max-md:mt-4'>
          <a href="#">
            <img src={assets.facebook_icon} alt="" />
          </a>
          <a href="#">
            <img src={assets.instagram_icon} alt="" />
          </a>
          <a href="#">
            <img src={assets.twitter_icon} alt="" />
          </a>
      </div>
    </footer>
  )
}

export default Footer
