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
}