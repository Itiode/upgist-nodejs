import { RequestHandler } from 'express';

import AdImpression from '../models/ad-impression';

interface AdImpressionRes {
  message: string;
  count?: number;
  date?: string;
}

// TODO: Identify impressions from mobile app. To prevent endpoint abuse.
export const adImpression: RequestHandler<any, AdImpressionRes> = async (
  req,
  res,
  next
) => {
  const userId = req['user'].id;
  const date = new Date();

  const transformedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  const impressionId = `${userId}:${transformedDate}`;

  try {
    const adImpression = await AdImpression.findOne({ impressionId });
    if (adImpression) {
      await AdImpression.updateOne(
        { impressionId },
        { $inc: { count: 1 } },
        { new: true }
      );

      return res.status(200).send({
        message: 'Impression registered successfully',
        count: adImpression.count + 1,
        date: transformedDate,
      });
    } else {
      await new AdImpression({ impressionId, count: 1, user: userId }).save();
      return res.status(201).send({
        message: 'Impression registered successfully',
        count: 1,
        date: transformedDate,
      });
    }
  } catch (err) {
    next(new Error('Error in registering impression: ' + err));
  }
};
