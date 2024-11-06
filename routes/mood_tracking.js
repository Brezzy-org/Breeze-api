import { Router } from "express";
import { addMood, deleteMood, getMood, getMoods, updateMood } from "../controllers/mood_tracking.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";

export const moodRouter = Router();

moodRouter.post("/moods", isAuthenticated, hasPermission('add_mood'), addMood);

moodRouter.get("/moods", isAuthenticated, hasPermission('get_moods'),  getMoods);

moodRouter.get("/moods/:id", isAuthenticated, hasPermission('get_mood'),  getMood);

moodRouter.patch("/moods/:id", isAuthenticated, hasPermission('update_mood'), updateMood);

moodRouter.delete("/moods/:id", isAuthenticated, hasPermission('delete_mood'), deleteMood);


export default moodRouter;