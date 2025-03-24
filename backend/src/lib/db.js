import mongoose from "mongoose"

export const connectDB = async() =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb connection : ${connection.connection.host}`)
    } catch (error) {
        console.log(`Problem in connecting with mongodb: ${error}`)
    }
}