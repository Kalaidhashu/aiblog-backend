const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Add comment to blog
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { blogId, text } = req.body;
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    const comment = await Comment.create({
      user: req.user._id,
      blog: blogId,
      text,
    });
    
    const populatedComment = await Comment.findById(comment._id).populate('user', 'username profileImage');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is comment author or blog author or admin
    const blog = await Blog.findById(comment.blog);
    
    if (
      comment.user.toString() !== req.user._id.toString() &&
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
const getBlogComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addComment,
  deleteComment,
  getBlogComments,
};