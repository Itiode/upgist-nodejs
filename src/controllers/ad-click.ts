import { RequestHandler } from 'express';

import AdClick from '../models/ad-click';

interface AdClickResponse {
  message: string;
  count?: number;
}

export const adClick: RequestHandler<any, AdClickResponse> = async (
  req,
  res,
  next
) => {
  const userId = req['user'].id;
  const date = new Date();

  const clickId = `${userId}:${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  try {
    let click = await AdClick.findOne({ clickId });
    if (click) {
      await AdClick.updateOne(
        { clickId },
        { $inc: { count: 1 } },
        { new: true }
      );
      return res
        .status(200)
        .send({ message: 'Click registered successfully', count: click.count });
    } else {
      await new AdClick({ clickId, count: 1 }).save();
      return res
        .status(201)
        .send({ message: 'Click registered successfully', count: 1 });
    }
  } catch (err) {
    next(new Error('Error in authenticating user: ' + err));
  }
};
