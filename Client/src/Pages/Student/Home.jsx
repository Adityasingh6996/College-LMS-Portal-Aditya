import React from 'react'
import Hero from '../../Components/Student/Hero'
import Searchbar from '../../Components/Student/Searchbar'
import Companies from '../../Components/Student/Companies'
import CourseSection from '../../Components/Student/CourseSection'
import Testimonials from '../../Components/Student/Testimonials'
import CalltoAction from '../../Components/Student/CalltoAction'
import Footer from '../../Components/Student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex flex-col items-center space-y-7 text-center'>
        <Hero/>
        <Searchbar/>
        <Companies/>
        <CourseSection/>
        <Testimonials/>
        <CalltoAction/>
      </main>
      <Footer/>
    </div>
  )
}

export default Home
