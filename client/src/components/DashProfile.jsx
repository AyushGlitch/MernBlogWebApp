import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import {app} from '../firebase.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess } from '../redux/slices/userSlices/userSlice.js'
import { HiOutlineExclamationCircle } from "react-icons/hi";


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

    const [showModal, setShowModal] = useState(false)

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


    const handleDeleteUser = async () => {
        setShowModal(false)

        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const data = await res.json()
            if(res.ok){
                dispatch(deleteUserSuccess())
            }
            else {
                dispatch(deleteUserFailure(data))
            }

        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }


    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })

            const data = await res.json()
            if(res.ok){
                dispatch(signOutSuccess())
                window.location.href = '/'
            }
            else {
                console.log(data)
            }

        } catch (error) {
            console.log(error)
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
            <span className=' cursor-pointer' onClick={() => {
                setShowModal(true)
            }}>
                Delete Account
            </span>
            <span className=' cursor-pointer' onClick={handleSignout}>Sign Out</span>
        </div>

        {
            updateUserSuccess && <Alert color='success'>
                {updateUserSuccess}
            </Alert>
        }

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className=' mb-5 text-lg text-gray-500 dark:text-gray-400'>
                        Are you sure you want to delete your account?
                    </h3>

                    <div className='flex flex-row justify-between'>
                        <Button color='failure' onClick={handleDeleteUser}>
                            Yes, I'm sure
                        </Button>
                        <Button color='light' onClick={() => setShowModal(false)}>
                            No
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
