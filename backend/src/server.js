import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB}  from "./lib/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import { app,io,server } from "./lib/socket.js"
import path from "path"
dotenv.config()

const _dirname = path.resolve()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))


if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(_dirname,"../frontend/dist")))

  app.get('*',(req,res)=>{
    res.sendFile(path.join(_dirname,"../frontend","dist","index.html"))
  })
}

const PORT = process.env.PORT

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)


server.listen(PORT,()=>{
    connectDB()
    console.log(`Backend server running at port ${PORT} & Frontend Working at `);
    
})