import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import {Button, Spinner} from 'flowbite-react'
import CommentSection from '../components/CommentSection'

export default function PostPage() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const {postSlug} = useParams()

    useEffect( () => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if(res.ok) {
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(false)
                }
                else{
                    setError(true)
                    setLoading(false)
                }

            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchPost()
    }, [postSlug])

    if(loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>
    )

    return (
        <main className='flex flex-col p-3 max-w-6xl mx-auto min-h-screen'>
            <h1 className=' text-3xl mt-10 p-3 text-center font-serif mx-auto max-w-2xl lg:max-w-4xl'>
                {post && post.title}
            </h1>

            <Link to={`/search?category=${post && post.category}`} className=' self-center mt-5'>
                <Button color='gray' pill size='xs'>{post && post.category}</Button>
            </Link>

            <img src={post && post.image} alt={post && post.title} className=' mt-10 p-3 max-h-[600px] w-full object-cover' />

            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>
                    {post && new Date(post.createdAt).toLocaleDateString()}
                </span>

                <span className=' italic'>
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>

            <div className=' p-3 mx-auto max-w-2xl w-full' dangerouslySetInnerHTML={{__html: post && post.content}}>

            </div>

            {console.log(post._id)}
            <CommentSection postId= {post._id}/>
        </main>
    )
}
