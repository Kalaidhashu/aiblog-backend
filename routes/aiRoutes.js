const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateBlog,
  correctGrammar,
  chatWithAI,
  generateImagePrompt,
} = require('../controllers/aiController');

router.post('/generate-blog', protect, generateBlog);
router.post('/grammar-correct', protect, correctGrammar);
router.post('/chatbot', protect, chatWithAI);
router.post('/generate-image-prompt', protect, generateImagePrompt);

module.exports = router;