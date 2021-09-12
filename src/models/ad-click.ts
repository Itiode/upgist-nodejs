import mongoose, { Schema } from 'mongoose';

interface AdClick {
  _id: string;
  clickId: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

const schema = new Schema<AdClick>(
  {
    clickId: { type: String, trim: true, required: true },
    count: { type: Number, min: 0, max: 100, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('ad-click', schema);
