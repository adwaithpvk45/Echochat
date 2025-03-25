import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

    
export const useAuthStore = create((set,get)=>{

    const BASE_URL = import.meta.env.MODE==="production"?"http://localhost:5001":"/"
   return { 
    authUser :null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth : true,
    onlineUsers:[],
    socket:null,

    checkAuth : async()=>{ // for checking if the people are authenticated while refreshing the page
        try {
            const res = await axiosInstance.get("/auth/check")
            console.log(res)
            set({authUser:res.data.user})
            get().connectSocket()
            console.log("the response is fetching : " + res.data.message)
        } catch (error) {
            console.log("Error in checkAuth:",error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signUp: async(data) =>{
        set({isSigningUp:true})
        console.log(data)
        try {
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }

    },

    logout:async(data)=>{
        try{
            await axiosInstance.post("/auth/logout");
           set({authUser:null})
        toast.success("Logged out successfully")
        get().disconnectSockect()
    }catch(error){
        toast.error(error.response.data.message)
    }
    },

    login: async(data)=>{
        console.log(data)
        set({isLoggingIn:true})
        try {
            const res= await axiosInstance.post("/auth/login",data)
            console.log(res.data)
            set({authUser:res.data})
            toast.success("Logged in successfully!");
            console.log("going to connect to socket");
            get().connectSocket()
            console.log("socket connected")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile: async (data)=>{
        console.log(data)
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/updateProfile",data)
            set({authUser:res.data})
            toast.success("Profile pic updated!")
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:(userId) =>{
        // For connecting to backend websocket 
        const {authUser} = get()

        console.log(userId)

        if(!authUser||get().socket?.connected) return; //checking if already connected with websocket
      
         const socketConnection = io(BASE_URL,{ // credentials for connecting to backend
            query: {
                userId:authUser._id,
            },
         })

         socketConnection.connect() //connecting to backend, if not written it will connect automatically
         
         set({socket:socketConnection}) // saving the connection data into socket

         socketConnection.on("getOnlineUsers",(userIds)=>{ // listening from backend on event - getOnlineUsers
            set({onlineUsers:userIds})
         })
    },

    disconnectSockect:()=>{
        if(get().socket?.connected)get().socket.disconnect(); // to disconnect from websocket.
    }

}});

