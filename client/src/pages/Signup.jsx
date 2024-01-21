import React from 'react'
import { Link } from 'react-router-dom'
import {Button, Label, TextInput} from 'flowbite-react'

export default function Signup() {
  return (
    <div className=' min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>

        <div className=' flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className=' px-2 py-1 bg-gradient-to-r from-yellow-200 via-orange-400 to-red-600 rounded-lg text-white'>Glitchy</span> Blogs
          </Link>

          <p className=' text-sm mt-5'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div className=' flex-1'>
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your Username'/>
              <TextInput type='text' placeholder='Username' id='username'/>
            </div>

            <div>
              <Label value='Your Email'/>
              <TextInput type='text' placeholder='Email' id='email'/>
            </div>

            <div>
              <Label value='Your Password'/>
              <TextInput type='text' placeholder='Password' id='password'/>
            </div>

            <Button gradientDuoTone='pinkToOrange' type='submit' outline>
              Sign Up
            </Button>
          </form>
          
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account ?</span>
            <Link to='/sign-in' className=' text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
