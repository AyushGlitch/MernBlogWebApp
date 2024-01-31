import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {Button, Textarea, Modal} from 'flowbite-react'
import { useEffect, useState } from 'react';
import Comment from './Comment';
import {useNavigate} from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({postId}) {

    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)

    const navigate = useNavigate()

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
                setComments([data.comment, ...comments])
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    useEffect( () => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                if(res.ok){
                    const data = await res.json()
                    setComments(data.comments)
                }

            } catch (error) {
                console.log(error.message)
            }
        }

        getComments()
    }, [])


    const handleLike = async (commentId) => {
        try {
            if(!currentUser){
                navigate('/sign-in')
                return;
            }

            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            })
            const data = await res.json()

            if(res.ok){
                setComments( comments.map( (comment) => (
                    comment._id === commentId ? {
                        ...comment,
                        numberOfLikes: data.comment.numberOfLikes,
                        likes: data.comment.likes,
                    } : 
                    comment
                )))
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    const handleEdit = async (comment, editedComment) => {
        setComments(
            comments.map( (c) => c._id === comment._id ? {...c, content: editedComment} : c)
        )
    }

    
    const handleDelete = async (commentId) => {
        setShowModal(false)
        try {
            if(!currentUser){
                navigate('/sign-in')
                return;
            }

            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
            })

            if(res.ok){
                const data = await res.json()
                setComments(comments.filter( (comment) => comment._id !== commentId))
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

        {
            comments.length === 0 ? (
                <p>No comments yet!</p>
            ) : (
                <>
                    <div className='flex items-center my-5 text-sm gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    
                    {
                        comments.map( comment => (
                            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => (
                                setShowModal(true),
                                setCommentToDelete(commentId)
                            )} />
                        ))
                    }
                </>
            )
        }

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header/>
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className=' mb-5 text-lg text-gray-500 dark:text-gray-400'>
                        Are you sure you want to delete this comment?
                    </h3>

                    <div className='flex flex-row justify-between'>
                        <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
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
