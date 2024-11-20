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
        // if (req.auth.role !== 'therapist') {
        //     return res.status(403).json("Only therapists can create blogs.");
        // }


        // Prepare blog data with author ID
        const blogData = {
            ...value,                 // Use validated data
            author: req.auth.id,      // Add therapist's ID as author
        };

        // Create and save the blog
        const newBlog = await BlogModel.create(blogData);

        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        next(error);
    }
};

// Get blogs by a specific therapist (Users and Therapists)
export const getBlogsByTherapist = async (req, res, next) => {
    try {
        const therapistId = req.auth.id;
        const { sort = "{}", limit = 10, skip = 0 } = req.query;

        // Determine sorting order safely
        let sortOrder;
        try {
            sortOrder = JSON.parse(sort);
        } catch {
            sortOrder = { createdAt: -1 }; // Default: newest first
        }

        console.log("Therapist ID:", therapistId);
        console.log("Sort Order:", sortOrder);

        // Fetch blogs created by the specific therapist
        const blogs = await BlogModel.find({ author: therapistId })
            .sort(sortOrder)
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('author', 'name');

        res.status(200).json(blogs);
    } catch (error) {
        next(error);
    }
};




// Get all blogs with sorting (Users and Therapists)
export const getBlogs = async (req, res, next) => {
    try {
        const { sort = 'latest', limit = 10, skip = 0 } = req.query;

        // Determine the sorting order 
        let sortOrder;
        switch (sort) {
            case 'latest':
                sortOrder = { createdAt: -1 }; // Newest first
                break;
            case 'oldest':
                sortOrder = { createdAt: 1 };  // Oldest first
                break;
            case 'author':
                sortOrder = { author: 1 };     // Alphabetical order by author
                break;
            default:
                sortOrder = {}; // Default is no sorting
                break;
        }

        // Fetch blogs with sorting, pagination, and author population
        const blogs = await BlogModel.find()
            .sort(sortOrder)
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
        // Validate fields (including image if available)
        const { error, value } = updateBlogValidator.validate({
            ...req.body,
            image: req.file?.filename, // Include image if it exists
        });
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Prepare the updated blog data
        const updatedBlogData = {
            ...value,                   // Include validated data from body
            author: req.auth.id,        // Ensure the author is the logged-in user
        };

        // Update the blog and return the updated document
        const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, updatedBlogData, { new: true });

        // Return the updated blog to the client
        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });

    } catch (error) {
        next(error);  // Handle any errors
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

// Delete a blog (Therapist only)
export const getSingleBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const blog = await BlogModel.findById(id);

        if (!blog) {
            return res.status(404).json("Blog not found");
        }

        res.status(200).json(blog);
    } catch (error) {
        next(error);
    }
};
