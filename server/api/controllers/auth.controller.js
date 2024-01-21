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

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY)

        const { password: hashedPassword, ...others } = validUser[0]._doc

        return res.status(200)
                    .cookie('token', token, { httpOnly: true })
                    .json(others)

    } catch (error) {
        next(error)
    }
}