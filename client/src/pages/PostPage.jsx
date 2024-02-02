import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import {Button, Spinner} from 'flowbite-react'
import CommentSection from '../components/CommentSection'
import PostCard from '../components/PostCard'

export default function PostPage() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const {postSlug} = useParams()

    const [recentPosts, setRecentPosts] = useState(null)

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


    useEffect( () => {
        try {
            const fetchRecentPosts = async () => {
                const res  = await fetch('/api/post/getposts?limit=3')
                const data = await res.json()

                if(res.ok){
                    setRecentPosts(data.posts)
                }
            }

            fetchRecentPosts()

        } catch (error) {
            console.log(error)
        }
    })

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

            <CommentSection postId= {post._id}/>

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1 className=' text-xl mt-5'>Recent Articles</h1>

                <div className='flex flex-wrap justify-center gap-5 mt-5'>
                    {
                        recentPosts && 
                        recentPosts.map( (post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
        </main>
    )
}
