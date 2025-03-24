import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute = async (req,res,next) =>{
    try {
        console.log(req.cookies)
        const token = req.cookies.jwt

        if(!token){
            return res.status(201).json({message:"unauthorized access"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(201).json({message:"unauthorized access"})
        }

        const user = await User.findById(decoded.userid).select("-password")

        if(!user){
            return  res.status(401).json({message:"User not found"})
        }
  
        req.user = user

        next()
        
    } catch (error) {
        console.log("Internal server Error" + error)
        res.status(500).json({message:"Internal server error,Protected route error :" + error})
    }
}