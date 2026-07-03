const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  summary: {
    type: String,
    maxlength: [300, 'Summary cannot exceed 300 characters'],
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg',
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Science', 'Health', 'Business', 'Education', 'Entertainment', 'Travel', 'Food', 'Other'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  readingTime: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update reading time before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', blogSchema);