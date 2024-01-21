import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import OAuth from '../components/OAuth'

export default function Signup() {

  const [formData, setFormData] = React.useState({})
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!formData.username || !formData.email || !formData.password) {
      return setError('Please fill all the fields')
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }) 
      const data = await response.json()

      if(data.success === false) {
        return setError(data.message)
      }
      setLoading(false)
      if(response.ok){
        navigate('/sign-in')
      }

    } catch (error) {
      setError(error.message)
      console.log(error) 
      setLoading(false)
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div className=' flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your Username'/>
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
            </div>

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
                'Sign Up'
              }
            </Button>
            <OAuth/>
          </form>
          
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account ?</span>
            <Link to='/sign-in' className=' text-blue-500'>
              Sign In
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
