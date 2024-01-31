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


export const getPostComments = async(req, res, next) => {
     try {
        const comments = await Comment.find({postId: req.params.postId}).sort({
            createdAt: -1,
        })
        res.status(200).json({
            message: 'Comments fetched successfully',
            comments,
        })

     } catch (error) {
        next(error)
     }
}


export const likeComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'Comment not found'))
        }
        
        const userIndex = comment.likes.indexOf(req.user.id)
        if(userIndex === -1){
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }

        await comment.save()
        res.status(200).json({
            message: 'Comment liked successfully',
            comment,
        })

    } catch (error) {
        next(error)
    }
}


export const editComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'Comment not found'))
        }

        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(errorHandler(401, 'Unauthorized, userId not matching or not admin'))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content,
        }, {new: true})

        res.status(200).json({
            message: 'Comment edited successfully',
            comment: editedComment,
        })

    } catch (error) {
        next(error)
    }
}