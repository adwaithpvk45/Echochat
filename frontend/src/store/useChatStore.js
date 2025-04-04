import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore =create((set,get)=> // set is used to set the variable value and get used to fetch the variables in the store
    (
    {
    isUsersLoading:false, 
    isMessagesLoading:false,
    messages:[],
    users:[],
    selectedUser:null,

   
    getUsers:async ()=>{
        try{
            set({isUsersLoading:true})
        const res= await axiosInstance.get("/messages/users")
        console.log(res.data)
        set({users:res.data})
        console.log(res)
    }catch(error){
        console.log("An error in fetching or sending req")
        toast.error(error.response.data.message)
    }finally{
        set({isUsersLoading:false})
    }
    },

    getMessages:async(userId)=>{
        set({isMessagesLoading:true})
        try {
            const res =await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data})
        } catch (error) {
            console.log("Error in getting messages",error)
            toast.error(error.response.data.message)
        }finally{
            set({isMessagesLoading:false})
        }
    },
    
    sendMessages:async(messageData)=>{
        const {selectedUser,messages} = get() 
        console.log(messageData)
        try {
             const res= await axiosInstance.post(`messages/send/${selectedUser._id}`,messageData)
             set({messages:[...messages,res.data]})   
        } catch (error) {
            toast.error(error.response.data.message)
        }

    },
    subscribeToMessages :()=>{

         const {selectedUser} = get();
         if(!selectedUser) return;

         const socket = useAuthStore.getState().socket // this is used to obtain socket variable(containing the connection data) from the useAuthStore not the module socket

         socket.on("newMessage",(newMessage)=>{ //listening to newMessage socket connection from backend and got the newMessage instantly
            set({ 
                messages:[...get().messages,newMessage]
            })

         })
    },

    unsubscribeFromMessages : ()=>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },


    setSelectedUser:(user)=>{
            set({selectedUser:user})
    },
})

)