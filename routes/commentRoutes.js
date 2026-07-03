const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addComment,
  deleteComment,
  getBlogComments,
} = require('../controllers/commentController');

router.post('/', protect, addComment);
router.get('/blog/:blogId', getBlogComments);
router.delete('/:id', protect, deleteComment);

module.exports = router;