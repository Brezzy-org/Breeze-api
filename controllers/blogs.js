import { BlogModel } from "../models/blogs.js";
import { createBlogValidator, updateBlogValidator } from "../validators/blogs.js";

// Create a blog (Therapist only)
export const createBlog = async (req, res, next) => {
    try {
        // Validate fields
        const { error, value } = createBlogValidator.validate({
            ...req.body,
            image: req.file?.filename
        });
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Restrict to therapists only
        if (req.auth.role !== 'therapist') {
            return res.status(403).json("Only therapists can create blogs.");
        }

        // Prepare blog data with author ID
        const blogData = { 
            ...value,                 // Use validated data
            author: req.auth.id,      // Add therapist's ID as author
            image: req.file?.path     // Add the path of the image if uploaded
        };

        // Create and save the blog
        const newBlog = await BlogModel.create(blogData);

        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        next(error);
    }
};


// Get all blogs (Users and Therapists)
export const getBlogs = async (req, res, next) => {
    try {
        const { sort = "{}", limit = 10, skip = 0 } = req.query;
        // Fetch blogs,sorted and paginated
        const blogs = await BlogModel.find()
            .sort(JSON.parse(sort))  
            .limit(Number(limit))    
            .skip(Number(skip))      
            .populate('author', 'name');  

        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};


// Update a blog (Therapist only)
export const updateBlog = async (req, res, next) => {
    try {
            // validate fields
            const {error, value} = updateBlogValidator.validate(req.body);
            if (error) {
                return res.status(422).json(error)
            }

        const { id } = req.params;
        const blog = await BlogModel.findById(id);

        if (!blog || blog.author.toString() !== req.auth.id) {
            return res.status(403).json("Not authorized to update this blog.");
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error);
    }
};

// Delete a blog (Therapist only)
export const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await BlogModel.findById(id);

        if (!blog || blog.author.toString() !== req.auth.id) {
            return res.status(403).json("Not authorized to delete this blog.");
        }

        await BlogModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog successfully deleted!" });
    } catch (error) {
        next(error);
    }
};
