// routes/blog.js
import { Router } from "express";

import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { createBlog, deleteBlog, getBlogs, updateBlog } from "../controllers/blogs.js";
import { blogImageUpload } from "../middlewares/upload.js";

export const blogRouter = Router();

// Route for creating a blog (Therapist only)
blogRouter.post("/blogs", isAuthenticated, hasPermission('create_blog'), blogImageUpload.single('image'), createBlog );

// Route for getting all blogs (Accessible by both users and therapists)
blogRouter.get("/blogs", isAuthenticated, hasPermission('get_blogs'), getBlogs);

// Route for updating a blog (Therapist only, restricted to own blogs)
blogRouter.patch("/blogs/:id", isAuthenticated, hasPermission('update_blog'), updateBlog);

// Route for deleting a blog (Therapist only, restricted to own blogs)
blogRouter.delete("/blogs/:id", isAuthenticated, hasPermission('delete_blog'), deleteBlog);

export default blogRouter;