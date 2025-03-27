import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        console.log("filtered",filteredUsers)
        res.status(200).json(filteredUsers);
    }
        catch (error) {
        console.log("Internal error in getUsersForSidebar" + error)
        res.status(500).json({message:error.message})
    }
}

export const getMessages = async (req,res) =>{
    try{
        const senderId = req.params.id
        const myId = req.user._id
      
        const messages = await Message.find({
            $or:[
                {senderId:senderId,receiverId:myId},
                {senderId:myId,receiverId:senderId}
            ]
        })

        res.status(200).json(messages)
    }catch(error){
        console.log("Internal server error" + error)
        res.status(500).json("Internal server error in gettingMessages")
    }
}

export const sendMessages = async(req,res) =>{
    try{
        const {text,image} = req.body 
    const userId = req.params.id
    const senderId = req.user._id

    let imageUrl
    if(image){
        const uploadResponse= await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message(
        {
             senderId,
             receiverId:userId,
             text,
             Image:imageUrl
        }
    )
    await newMessage.save()
    
    //next we need to do real time functionality using socket.io
     
    const receiverSocketId = getReceiverSocketId(userId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(201).json(newMessage)
}catch(error){
    console.log("error"+ error)
    res.status(500).json({message:"Internal server error in sendMessages:" + error})
}
}