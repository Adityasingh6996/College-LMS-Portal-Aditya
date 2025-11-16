import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-auto' style={{ marginTop: '10px', marginBottom: '0' }}>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30 '>
        
        {/* Logo + LMS Description */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h1 className='text-white text-2xl font-semibold '>AIM</h1>
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            AIM is a modern Learning Management System (LMS) that offers a wide variety of professional courses online. Our platform enables learners to gain skills through expertly designed content, quizzes, and real-time feedback — all in one place.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#top" className='hover:underline transition-all duration-200'>Home</a></li>
            <li><span className='cursor-default'>About us</span></li>
            <li><span className='cursor-default'>Privacy policy</span></li>
          </ul>
        </div>

        {/* Reach Us + LinkedIn */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Reach us at</h2>
          <div className='flex flex-col space-y-2 mb-6'>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=krishnabhambani1@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className='text-sm text-white/80 hover:text-white hover:underline transition-all duration-200'
            >
              krishnabhambani1@gmail.com
            </a>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=pandeypradumn2222@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className='text-sm text-white/80 hover:text-white hover:underline transition-all duration-200'
            >
              pandeypradumn2222@gmail.com
            </a>
          </div>

          <h2 className='font-semibold text-white mb-5'>Connect with us</h2>
          <div className='flex flex-col space-y-2'>
            <a 
              href="https://www.linkedin.com/in/pradumnpandey/" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-sm text-white/80 hover:text-blue-400 hover:underline transition-all duration-200 flex items-center gap-2'
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Pradumn Pandey
            </a>
            <a 
              href="https://www.linkedin.com/in/krishnabhambani/" 
              target="_blank" 
              rel="noopener noreferrer"
              className='text-sm text-white/80 hover:text-blue-400 hover:underline transition-all duration-200 flex items-center gap-2'
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Krishna Bhambani
            </a>
          </div>
        </div>
      </div>

      <p className='py-4 text-center text-xs md:text-sm text-white/60'>
        © 2025 AIM. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;