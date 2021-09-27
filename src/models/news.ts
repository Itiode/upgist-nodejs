import mongoose, { Schema } from 'mongoose';

interface News {
  source: string;
  author: string;
  title: string;
  description: string;
  content: string;
  category: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const schema = new Schema<News>({
  source: {
    type: String,
    trim: true,
    minLength: 1,
    maxLength: 250,
    required: true,
  },
  author: { type: String, trim: true, maxLength: 50 },
  title: {
    type: String,
    trim: true,
    minLength: 1,
    maxLength: 250,
    required: true,
  },
  description: { type: String, trim: true, maxLength: 250 },
  content: { type: String, trim: true },
  category: {
    type: String,
    trim: true,
    enum: [
      'business',
      'entertainment',
      'sports',
      'technology',
      'science',
      'health',
      'general',
    ],
    required: true,
  },
  url: { type: String, trim: true, required: true },
  urlToImage: { type: String, trim: true, required: true },
  publishedAt: { type: String, trim: true, required: true },
});

export default mongoose.model('News', schema);
