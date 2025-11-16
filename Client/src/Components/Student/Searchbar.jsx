import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Searchbar = ({data}) => {
  const navigate=useNavigate()
  const [input,setInput]=useState(data?data:'')
  const onSearchHandler=(e)=>{
    e.preventDefault();
    navigate(`/Course-List/`+ input);

  }

  return (
      <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center justify-between bg-white border border-gray-500/20 rounded'>
        <img src={assets.search_icon} alt="search-icon" className='md:w-auto w-10 px-3'/>
        <input onChange={e=>setInput(e.target.value)} value={input} type="text" placeholder='Search for Courses' id="" className='w-full h-full text-gray-800 outline-none'/>
        <button type="submit" className='bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 cursor-pointer'>Search</button>
      </form>
  )
}

export default Searchbar
