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
        // Validate fields (including image if available)
        const { error, value } = updateBlogValidator.validate({
            ...req.body,
            image: req.file?.filename, // Include image if it exists
        });
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        console.log('susBody', req.body)

        const { id } = req.params;

        // Find the blog by ID
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found." });
        }

        // Check if the logged-in user is the author of the blog
        if (blog.author.toString() !== req.auth.id) {
            return res.status(403).json({ error: "Not authorized to update this blog." });
        }
        console.log('myVslue', value)

        // Prepare the updated blog data
        const updatedBlogData = {
            ...value,                   // Include validated data from body
            author: req.auth.id,        // Ensure the author is the logged-in user
            image: req.file ? req.file?.path : blog.image,  // Update image if a new file is provided
        };

        console.log('myVslue', updatedBlogData)


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
