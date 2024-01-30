import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {Button, Textarea} from 'flowbite-react'
import { useState } from 'react';

export default function CommentSection({postId}) {

    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(comment.length > 200){
            return
        }

        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    userId: currentUser._id,
                    postId: postId
                })
            })
            const data = await res.json()
    
            if(res.ok){
                setComment('')
            }

        } catch (error) {
            console.log(error.message)
        }
    }


  return (
    <div className=' max-w-2xl mx-auto w-full p-3'>
        {
            currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as: </p>
                    <img src={currentUser.profilePicture} alt='' className=' h-5 w-5 object-cover rounded-full' />
                    <Link to='/dashboard?tag=profile' className=' text-xs text-cyan-600 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className=' text-sm text-teal-500 my-5 flex gap-1'>
                    You must login to comment.
                    <Link to='/sign-in' className=' text-blue-500 hover:underline'>
                        Sign In
                    </Link>
                </div>
            )
        }

        {
            currentUser && (
                <form className='border border-teal-500 rounded-md p-3'>
                    <Textarea placeholder='Add a comment...' rows='3' maxLength='200'
                        onChange={(e) => setComment(e.target.value)} value={comment}/>
                    
                    <div className='flex justify-between mt-5 items-center'>
                        <p className='  text-gray-500 text-xs'>{200 - comment.length} characters remaining...</p>
                        <Button outline gradientDuoTone={'purpleToBlue'} type='submit' onClick={handleSubmit}>Submit</Button>
                    </div>
                </form>
            )
        }
    </div>
  )
}
