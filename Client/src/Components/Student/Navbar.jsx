import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, useUser, UserButton } from '@clerk/clerk-react'
import { AppContext } from '../../Context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Navbar = () => {
  const location = useLocation()
  const isCoursePage = location.pathname.includes('/educator')

  const { openSignIn } = useClerk()
  const { user } = useUser()
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext)

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-8 md:px-14 py-4 border-b 
      ${isCoursePage ? 'bg-gradient-to-r from-blue-300 to-cyan-800' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500'}`}
    >
      {/* Replacing logo with stylish AIM */}
      <div onClick={() => navigate('/')} className="cursor-pointer">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-cyan-200 drop-shadow"
        >
          A<span className="text-white">I</span>M
        </motion.h1>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-5 text-white font-medium">
        {user && (
          <div className="flex items-center gap-3">
            <button onClick={becomeEducator}>
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <span>|</span>
            <Link to="/my-enrollments">My Enrollments</Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden items-center gap-3 text-white text-sm">
        {user && (
          <div className="flex flex-col items-end gap-1 max-sm:text-xs">
            <button onClick={becomeEducator}>
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <Link to="/my-enrollments">My Enrollments</Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src="/user_icon.svg" alt="User Icon" className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
