import { errorHandler } from "./error.js"
import jwt from 'jsonwebtoken'


export const verifyToken = (req, res, next) => {
    const token = req.cookies.token

    if(!token){
        return next(errorHandler(401, 'Unauthorized, token not found'))
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized, token not valid'))
        }

        req.user = user
        next()
    })
}