import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Label, TextInput } from 'flowbite-react'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/*Left Side Of Sign Up*/ }
        <div className='flex-1'>
        <Link to={'/'} className='font-bold dark:text-white text-4xl'><span className='px-1 py-1 bg-gradient-to-r from-green-500 via-teal-400 to-indigo-400 rounded-lg text-white'>Hassan's</span>BLOG</Link>
        <p className=' mt-5 text-sm'>
          This is a Hassan's Blog. You can sign up with email or password
          or with google.
        </p>
        </div>
        {/*On the right side of sign up */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
            <Label value='Your username'/>
            <TextInput placeholder='Username' id='username'/>
            </div>
            <div>
            <Label value='Your email'/>
            <TextInput placeholder='name@company.com' id='email'/>
            </div>
            <div>
            <Label value='Your password'/>
            <TextInput placeholder='Password' id='password'/>
            </div>
            <Button gradientDuoTone={'greenToBlue'}>Sign up</Button>
            <div className='flex gap-2 text-sm mt-4'>
            <span>Have an account?</span>
            <Link to={'/sign-in'} className='text-blue-500'>Sign in</Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}
