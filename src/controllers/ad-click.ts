import { RequestHandler } from 'express';

import AdClick from '../models/ad-click';

interface AdClickResponse {
  message: string;
  count?: number;
  date?: string;
}

// TODO: Identify clicks from mobile app. To prevent endpoint abuse.
export const adClick: RequestHandler<any, AdClickResponse> = async (
  req,
  res,
  next
) => {
  const userId = req['user'].id;
  const date = new Date();

  const transformedDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  const clickId = `${userId}:${transformedDate}`;

  try {
    const adClick = await AdClick.findOne({ clickId });
    if (adClick) {
      await AdClick.updateOne(
        { clickId },
        { $inc: { count: 1 } },
        { new: true }
      );

      return res.status(200).send({
        message: 'Click registered successfully',
        count: adClick.count + 1,
        date: transformedDate,
      });
    } else {
      await new AdClick({ clickId, count: 1, user: userId }).save();
      return res.status(201).send({
        message: 'Click registered successfully',
        count: 1,
        date: transformedDate,
      });
    }
  } catch (err) {
    next(new Error('Error in registering click: ' + err));
  }
};