import { RequestHandler } from 'express';

import AdClick, { getClicksCount } from '../models/ad-click';
import { generateId, QueryDate, getQueryDate } from '../shared/ads';
import UserModel from '../models/user';

interface GetAdClicksRes {
  message: string;
  adClicksCount?: number;
}

export const getAdClicksCount: RequestHandler<
  { userId: string },
  GetAdClicksRes,
  any,
  QueryDate
> = async (req, res, next) => {
  const { day, month, year } = req.query;
  const date: QueryDate = { day, month, year };

  const userId = req.params.userId;
  const queryDate = getQueryDate(date);

  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).send({ message: 'No user with the given ID' });

    const adClicks = await AdClick.find({
      clickId: new RegExp(queryDate + '$'),
      user: userId,
    });

    const adClicksCount = getClicksCount(adClicks);

    res.send({
      message: 'Ad clicks count gotten successfully',
      adClicksCount,
    });
  } catch (err) {
    next(new Error('Error in getting ad clicks count: ' + err));
  }
};

interface AdClickResponse {
  message: string;
  count?: number;
  clickId?: string;
}
// TODO: Identify clicks from mobile app. To prevent endpoint abuse.
export const registerAdClick: RequestHandler<any, AdClickResponse> = async (
  req,
  res,
  next
) => {
  const userId = req['user'].id;

  const clickId = generateId(userId);

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
        clickId,
      });
    } else {
      await new AdClick({ clickId, count: 1, user: userId }).save();
      return res.status(201).send({
        message: 'Click registered successfully',
        count: 1,
        clickId,
      });
    }
  } catch (err) {
    next(new Error('Error in registering click: ' + err));
  }
};
