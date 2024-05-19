import React from 'react'

export default function Title({
    title
}) {
  return (
    <div className='block font-sans text-5xl antialiased font-semibold leading-tight tracking-normal text-transparent bg-gradient-to-tr from-blue-600 to-blue-400 bg-clip-text text-center'>
        {title}
    </div>
  )
}
