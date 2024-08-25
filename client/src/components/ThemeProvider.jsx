import React from 'react'
import { useSelector } from 'react-redux'
export default function ThemeProvider( {children} ) {
    const {theme} = useSelector((state) => state.theme);
    return (
    <div className={theme}>
      <div className='bg-white text-gray-800 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen min-w-screen'>
        {children}
      </div>
    </div>
  )
}
