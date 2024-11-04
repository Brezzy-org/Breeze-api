import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/users.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";


// create router
const userRouter = Router();

// define routes
userRouter.post("/users/register", registerUser);

userRouter.post("/users/login", loginUser);

userRouter.get("/users/me", isAuthenticated, hasPermission('get_user_profile'), getUserProfile);

userRouter.patch("/users/me/:id", isAuthenticated, hasPermission('update_user_profile'), updateUserProfile);

userRouter.post("/users/logout", logoutUser)

// export router
export default userRouter