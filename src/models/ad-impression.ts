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
    count: { type: Number, min: 0, max: 1000, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Ad-Impression', schema);

export const generateImpressionId = (userId: string) => {
  const date = new Date();

  const transformedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return `${userId}:${transformedDate}`;
};

export const getImpressionsCount = (impressions: AdImpression[]): number => {
  let impressionsCount = 0;

  for (let impression of impressions) {
    impressionsCount += impression.count;
  }

  return impressionsCount;
};
