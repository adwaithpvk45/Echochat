import express, { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar,getMessages,sendMessages} from "../controllers/message.controller.js";

const router = express.Router()

router.get("/users",protectedRoute,getUsersForSidebar)

router.get("/:id",protectedRoute,getMessages)

router.post("/send/:id",protectedRoute,sendMessages)



export default router