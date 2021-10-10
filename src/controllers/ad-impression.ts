import { RequestHandler } from 'express';

import AdImpression, { getImpressionsCount } from '../models/ad-impression';
import { QueryDate, getQueryDate, generateId } from '../shared/ads';
import UserModel from '../models/user';

interface GetAdImpressionsRes {
  message: string;
  adImpressionsCount?: number;
}

export const getAdImpressionsCount: RequestHandler<
  { userId: string },
  GetAdImpressionsRes,
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

    const impressions = await AdImpression.find({
      impressionId: new RegExp(queryDate + '$'),
      user: userId,
    });

    const adImpressionsCount = getImpressionsCount(impressions);

    res.send({
      message: 'Ad impressions count gotten successfully',
      adImpressionsCount,
    });
  } catch (err) {
    next(new Error('Error in getting ad impressions count: ' + err));
  }
};

interface AdImpressionRes {
  message: string;
  count?: number;
  impressionId?: string;
}

// TODO: Identify impressions from mobile app. To prevent endpoint abuse.
export const registerAdImpression: RequestHandler<any, AdImpressionRes> =
  async (req, res, next) => {
    const userId = req['user'].id;
    const impressionId = generateId(userId);

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
          impressionId,
        });
      } else {
        await new AdImpression({ impressionId, count: 1, user: userId }).save();
        return res.status(201).send({
          message: 'Impression registered successfully',
          count: 1,
          impressionId,
        });
      }
    } catch (err) {
      next(new Error('Error in registering impression: ' + err));
    }
  };
