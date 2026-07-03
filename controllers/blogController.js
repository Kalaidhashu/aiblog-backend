const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const author = req.query.author;
    
    let query = {};
    if (author) {
      query.author = author;
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // @desc    Get single blog
// // @route   GET /api/blogs/:id
// // @access  Public
// const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id)
//       .populate('author', 'username profileImage')
//       .populate({
//         path: 'comments',
//         populate: { path: 'user', select: 'username profileImage' },
//       });
    
//     if (blog) {
//       // Increment views
//       blog.views += 1;
//       await blog.save();
      
//       res.json(blog);
//     } else {
//       res.status(404).json({ message: 'Blog not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {

    // Check valid MongoDB ID
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username profileImage');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);

  } catch (error) {
    console.error('Get Blog Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, coverImage, summary } = req.body;
    
    const blog = await Blog.create({
      title,
      content,
      summary: summary || content.substring(0, 300),
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      coverImage: coverImage || 'default-cover.jpg',
      author: req.user._id,
    });
    
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    await blog.deleteOne();
    res.json({ message: 'Blog removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like/unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const userIndex = blog.likes.indexOf(req.user._id);
    
    if (userIndex === -1) {
      // Like blog
      blog.likes.push(req.user._id);
      await blog.save();
      res.json({ message: 'Blog liked', liked: true });
    } else {
      // Unlike blog
      blog.likes.splice(userIndex, 1);
      await blog.save();
      res.json({ message: 'Blog unliked', liked: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle favorite blog
// @route   POST /api/blogs/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const blogIndex = user.favorites.indexOf(blog._id);
    
    if (blogIndex === -1) {
      user.favorites.push(blog._id);
      await user.save();
      res.json({ message: 'Blog added to favorites', favorited: true });
    } else {
      user.favorites.splice(blogIndex, 1);
      await user.save();
      res.json({ message: 'Blog removed from favorites', favorited: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username profileImage')
      .sort({ views: -1, likes: -1 })
      .limit(10);
    
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  toggleFavorite,
  getTrendingBlogs,
};