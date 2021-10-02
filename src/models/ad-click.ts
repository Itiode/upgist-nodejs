import mongoose, { Schema } from 'mongoose';

interface AdClick {
  _id: string;
  clickId: string;
  count: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const schema = new Schema<AdClick>(
  {
    clickId: { type: String, trim: true, required: true },
    count: { type: Number, min: 0, max: 1000, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Ad-Click', schema);

export const generateClickId = (userId: string) => {
  const date = new Date();

  const transformedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  return `${userId}:${transformedDate}`;
};

export const getClicksCount = (clicks: AdClick[]): number => {
  let clicksCount = 0;

  for (let click of clicks) {
    clicksCount += click.count;
  }

  return clicksCount;
};
