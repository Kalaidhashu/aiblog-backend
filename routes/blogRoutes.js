const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  toggleFavorite,
  getTrendingBlogs,
} = require('../controllers/blogController');

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.get('/trending', getTrendingBlogs);
router.post('/:id/like', protect, likeBlog);
router.post('/:id/favorite', protect, toggleFavorite);
router.route('/:id')
  .get(getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;