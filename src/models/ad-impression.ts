import mongoose, { Schema } from 'mongoose';

interface AdImpression {
  _id: string;
  impressionId: string;
  count: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const schema = new Schema<AdImpression>(
  {
    impressionId: { type: String, trim: true, required: true },
    count: { type: Number, min: 0, max: 100, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Ad-Impression', schema);
