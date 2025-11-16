import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'
import './CourseSection.css'
const Testimonials = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
      <h2 className='text-3xl font-medium text-gray-800'>Testimonials</h2>
      <p className='md:text-base text-gray-500 mt-3'>Hear from our learners as they share their journeys of transformation, success, and how our<br/>
      platform has made a difference in their lives.</p>
      <div className='grid auto gap-8 mt-14'>
        {dummyTestimonial && Array.isArray(dummyTestimonial) && dummyTestimonial.map((testimonial, index) => (
          testimonial && (
            <div key={index} className='text-sm text-left border border-gray-600/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow:hidden'>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-600/10'>
                <img src={testimonial.image || assets.profile_img_1} alt={testimonial.name || 'User'} className='h-12 w-12 rounded-full'/>
                <div>
                  <h1 className='text-lg font-medium text-gray-800'>{testimonial.name || 'Anonymous'}</h1>
                  <p className='text-gray-800/80'>{testimonial.role || ''}</p>
                </div>
              </div>
              <div className='p-5 pb-7'> 
                  <div className='flex gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <img
                        className="h-5"
                        key={i}
                        src={testimonial.rating && i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                        alt="star"
                      />
                    ))}
                  </div>
                  <p className='text-gray-500 mt-5'>{testimonial.feedback || ''}</p>
              </div>
              <a href="#" className='text-blue-500 underline px-4'>Read More</a>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default Testimonials
