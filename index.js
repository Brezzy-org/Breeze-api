import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/users.js";
import therapistRouter from "./routes/therapist.js";
import moodRouter from "./routes/mood_tracking.js";
import blogRouter from "./routes/blogs.js";

// conect to the database
await mongoose.connect(process.env.MONGO_URI);

// create an express app
const app = express();

// use middlewares
app.use(express.json());
app.use(cors());

// routes will be used here
app.use(userRouter);
app.use(therapistRouter);
app.use(moodRouter);
app.use(blogRouter)

// Listen for incoming requests
app.listen(4050, () => {
    console.log("App is listening on port 4050")
});
