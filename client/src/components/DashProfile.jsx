import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, Button, TextInput } from 'flowbite-react'
import {app} from '../firebase.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart, updateSuccess, updateFailure } from '../redux/slices/userSlices/userSlice.js'


export default function DashProfile() {

    const {currentUser} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const filePickerRef = useRef()
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)

    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()
    const [updateUserSuccess, setUpdateUserSuccess] = useState(false)

    const handleImageChange = (e) => {
        const file= e.target.files[0]
        
        if(file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect( () => {
        if(imageFile){
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        setImageFileUploadError(null)

        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError("Couldn't upload image (File must be less than 2 MB)")
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({...formData, profilePicture: downloadURL})
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(Object.keys(formData).length === 0){
            return
        }

        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if(res.ok){
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User Profile Updated Successfully..!!")
            } else {
                dispatch(updateFailure(data))
            }

        } catch (error) {
            dispatch(updateFailure(error.message))
        }
    }

  return (
    <div className=' max-w-lg mx-auto p-3 w-full'>
        <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input type='file' accept='/image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className=' relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>

                {
                    imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} strokeWidth={5} styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
                            }
                        }}/>
                    )
                }

                <img src={imageFileUrl || currentUser.profilePicture} alt='user' className=' w-full h-full rounded-full object-cover border-8 border-[lightgray]' />
            </div>
            {
                imageFileUploadError && <Alert color='failure'> {imageFileUploadError} </Alert>
            }

            <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />
            <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />

            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>

        <div className='flex justify-between text-red-500 mt-5'>
            <span className=' cursor-pointer'>Delete Account</span>
            <span className=' cursor-pointer'>Sign Out</span>
        </div>

        {
            updateUserSuccess && <Alert color='success'>
                {updateUserSuccess}
            </Alert>
        }
    </div>
  )
}
