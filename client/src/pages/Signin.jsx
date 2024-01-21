import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { signInStart, signInSuccess, signInFailure } from '../redux/slices/userSlices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth'

export default function Signin() {

  const [formData, setFormData] = React.useState({})
  
  const {loading, error} = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('Please enter all fields'))
    }

    try {
      dispatch(signInStart())

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }) 
      const data = await response.json()

      if(data.success === false) {
        dispatch(signInFailure(data.message))
      }
      if(response.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className=' min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>

        <div className=' flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className=' px-2 py-1 bg-gradient-to-r from-yellow-200 via-orange-400 to-red-600 rounded-lg text-white'>Glitchy</span> Blogs
          </Link>

          <p className=' text-sm mt-5'>
            This is demo project for <span className='font-bold'>Glitchy</span> Blogs. You can create your own blogs and share with your friends. Enter correct credentiols to sign in.
          </p>
        </div>

        <div className=' flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Email'/>
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
            </div>

            <div>
              <Label value='Your Password'/>
              <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
            </div>

            <Button gradientDuoTone='pinkToOrange' type='submit' outline disabled={loading}>
              {
                loading ? (
                <div className='flex gap-2'>
                  <Spinner size='sm'/>
                  <span>Loading...</span>
                </div> ) : 
                'Sign In'
              }
            </Button>
            <OAuth/>
          </form>
          
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account ?</span>
            <Link to='/sign-up' className=' text-blue-500'>
              Sign Up
            </Link>
          </div>

          {
            error && (
              <Alert className=' mt-5' color='failure'>
                {error}
              </Alert>
            )
          }

        </div>

      </div>
    </div>
  )
}
