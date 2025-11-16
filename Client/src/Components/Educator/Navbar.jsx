import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Navbar = () => {
  const educatorData = dummyEducatorData
  const { user } = useUser()

  return (
    <div className="flex items-center justify-between px-6 md:px-12 py-4 shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500">
      
      {/* Stylish Project Name: AIM */}
      <Link to="/" className="flex items-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-cyan-300 drop-shadow-lg"
        >
          A<span className="text-white">I</span>M
        </motion.h1>
      </Link>

      {/* Greeting and Profile */}
      <div className="flex items-center gap-4 text-white font-medium">
        <p className="text-sm md:text-base">Hi, {user ? user.fullName : 'Developer'} 👋</p>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.profile_img} alt="profile" className="w-8 h-8 rounded-full border-2 border-white" />
        )}
      </div>
    </div>
  )
}

export default Navbar
