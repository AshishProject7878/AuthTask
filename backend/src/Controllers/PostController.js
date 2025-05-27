import Post from '../Models/PostModel.js';
import User from '../Models/AuthModel.js'; // Add this import

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, description, refLinks } = req.body;
        const userId = req.userId; // From authMiddleware
        const user = await User.findById(userId); // Corrected from user to User

        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await Post.create({
            title,
            description,
            username: user.name,
            refLinks: refLinks || [],
            userId,
        });

        res.status(201).json({
            _id: post._id,
            title: post.title,
            description: post.description,
            username: post.username,
            refLinks: post.refLinks,
            userId: post.userId,
        });
    } catch (err) {
        console.error('Create post error:', err.message, err.stack); // Improved logging
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        console.error('Get posts error:', err.message, err.stack);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (err) {
        console.error('Get post by ID error:', err.message, err.stack);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { title, description, refLinks } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.refLinks = refLinks || post.refLinks;

        await post.save();
        res.status(200).json({
            _id: post._id,
            title: post.title,
            description: post.description,
            username: post.username,
            refLinks: post.refLinks,
            userId: post.userId,
        });
    } catch (err) {
        console.error('Update post error:', err.message, err.stack);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error('Delete post error:', err.message, err.stack);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};