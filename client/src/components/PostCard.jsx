import {Link} from 'react-router-dom'

export default function PostCard({post}) {
  return (
    <div className=' group relative w-full border h-[300px] overflow-hidden rounded-lg sm:w-[330px] border-teal-500 hover:border-2'>
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt='post cover' className='h-[180px] w-full object-cover group-hover:h-[120px] transition-all duration-200 z-20' />
        </Link>

        <div className='flex flex-col p-3 gap-2'>
            <p className=' text-lg font-semibold line-clamp-2'>{post.title}</p>
            <span className=' italic text-sm'>{post.category}</span>

            <Link to={`/post/${post.slug}`} className=' z-10 group-hover:bottom-3 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'>
                Read Article
            </Link>
        </div>
    </div>
  )
}
