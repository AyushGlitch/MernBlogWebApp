import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password || username=== '' || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'))
    }

    const hashedPassword = await bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    })

    try {
        await User.create(newUser)
        return res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'))
    }

    try {
        const validUser = await User.find({ email: email})
        if(!validUser){
            return next(errorHandler(400, 'User not found'))
        }
        
        const validPassword = await bcryptjs.compare(password, validUser[0].password)
        if(!validPassword){
            return next(errorHandler(400, 'Invalid Credentials'))
        }

        const token = jwt.sign({ id: validUser[0]._id, isAdmin: validUser[0].isAdmin }, process.env.JWT_KEY)

        const { password: hashedPassword, ...others } = validUser[0]._doc

        return res.status(200)
                    .cookie('token', token, { httpOnly: true })
                    .json(others)

    } catch (error) {
        next(error)
    }
}


export const google = async (req, res, next) => {
    const {email, name, googlePhotoUrl} = req.body

    try {
        const user = await User.findOne({email: email})

        if(user){
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_KEY)
            const { password: hashedPassword, ...others } = user._doc
            return res.status(200)
                        .cookie('token', token, { httpOnly: true })
                        .json(others)
        }

        else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = await bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })
            await newUser.save()
            const { password, ...others } = newUser._doc
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_KEY)
            return res.status(200)
                        .cookie('token', token, { httpOnly: true })
                        .json(others)
        }

    } catch (error) {
        next(error)
    }
}