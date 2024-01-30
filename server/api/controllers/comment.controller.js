import Comment from "../models/comment.model.js"
import { errorHandler } from "../utils/error.js"

export const createComment = async (req, res, next) => {
    try {
        const {content, userId, postId} = req.body
        if(userId !== req.user.id) {
            return next(errorHandler(401, 'Unauthorized, userId not matching'))
        }

        const newComment = new Comment({
            content,
            userId,
            postId,
        })
        await newComment.save()

        res.status(201).json({
            message: 'Comment created successfully',
            comment: newComment,
        })

    } catch (error) {
        next(error)
    }
}