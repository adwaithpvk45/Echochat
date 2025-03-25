import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req,res) => {
  console.log(req.body)
   const {fullName,email,password} = req.body
   try {
          if(!fullName||!email||!password){
            console.error({message:"Please fill all the fields"})
            return res.status(400).json({message:"Please fill all the fields"})
          }
          if(password.length<6){
             return res.status(400).json({message:"the password length is not enough"})
          }
       const user= await User.findOne({email})   
       
       if(user){
        console.error({message:"User already exists"})
        return res.status(400).json({message:"User already exists"}) 
       }

        const salt = await bcrypt.genSalt(10)
        
        const hashedPassword  = await bcrypt.hash(password,salt)

       const newUser = new User({
        fullName,
        email,
        password:hashedPassword,
       })

       if(newUser){
         generateToken(newUser._id,res)
         await newUser.save()
         res.status(200).json({message:"User registered",newUser})
       }else{
         res.status(400).json({message:"Invalid user"})
       }

   } catch (error) {
     console.log("Error in Signup controller",error.message);
     res.status(500).json({message:"Internal Server error"});
   }
}

export const login = async (req,res) =>{
  const {email,password} = req.body
   console.log("The req body is",req.body)
  try {
    
    const user = await User.findOne({email})
    console.log(user)

    if(!user){
     return  res.status(400).json({message:"Invalid Credential ( email )"})
    }

    const passwordCorrect = await bcrypt.compare(password,user.password)

    if(!passwordCorrect){
      return res.status(400).json({message:"Incorrect password"})
    }

    generateToken(user._id,res)

    res.status(200).json({message:"Loggedin successfully",user})

  } catch (error) {
     console.error({message:error})
      res.status(500).json({message:error})
  }
}

export const logout = (req,res) =>{
    try {
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json("logged out")
    } catch (error) {
      res.status(500).json("internal server error:" + error)
    }
}

export const updateProfile = async (req,res) => {
  console.log("entered the updating function")
  try {
      console.log(req)
    const {profilePic} = req.body

    const userId = req.user._id

    if(!profilePic){
      res.status(400).json({message:"Profile pic is required"})
    }

   const uploadResponse =  await cloudinary.uploader.upload(profilePic)

   const updatedUser =await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

   res.status(200).json({message:"User Profile Pic Updated",updatedUser})

  } catch (error) {
    console.log("internal server error:" + error)
    res.status(500).json({message:"Internal server error"})
  }
}

export const checkAuth = (req,res) =>{
  console.log(req.user)
  console.log("checkAuth entered")
  try {
    return res.status(200).json({message:"Authorised",user:req.user})
  } catch (error) {
    console.log("Not authenticated in checkAuth",error)
    return res.status(500).json({message:"Internal Server error"})
  }
}