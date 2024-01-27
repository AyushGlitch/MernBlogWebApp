import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    console.log(req.user);
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Title and content are required'))
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, "")
    const newPost = new Post(
        {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            slug,
            userId: req.user.id,
        }
    )

    try {
        const savedPost = await newPost.save()
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: savedPost,
        })

    } catch (error) {
        next(error)
    }

}