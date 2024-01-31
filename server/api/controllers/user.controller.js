import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"


export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(401, 'Unauthorized'))
    }

    if(req.body.password){
        req.body.password = await bcryptjs.hashSync(req.body.password, 10)
    }

    if(req.body.username){
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }

        if(req.body.username.match(/[^a-zA-Z0-9]/)){
            return next(errorHandler(400, 'Username cannot contain special characters'))
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                profilePicture: req.body.profilePicture
            },
        }, { new: true })

        const {password, ...others} = updatedUser._doc
        res.status(200).json(others)

    } catch (error) {
        next(error)
    }
}


export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(401, 'Unauthorized'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')

    } catch (error) {
        next(error)
    }
}


export const signout = (req, res, next) => {
    try {
        res.clearCookie('token').status(200).json('User has been signed out')

    } catch (error) {
        next(error)
    }
}


export const getUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(401, 'Not an Admin, so not allowed to see all users'))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit)

        const usersWithoutPassword = users.map( (user) => {
            const {password, ...others} = user._doc
            return others
        })

        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1, 
            now.getDate(),
        )
        const lastMonthUsers = await User.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        })

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        })

    } catch (error) {
        next(error)
    }
}


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if(!user){
            return next(errorHandler(404, 'User not found'))
        }

        const {password, ...others} = user._doc
        res.status(200).json({
            user: others,
        })

    } catch (error) {
        next(error)
    }
}