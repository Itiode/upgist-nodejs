import { RequestHandler } from 'express';

import AdImpression, {
  generateImpressionId,
  getImpressionsCount,
} from '../models/ad-impression';
import UserModel from '../models/user';

interface GetAdImpressionsRes {
  message: string;
  adImpressionsCount?: number;
}

export const getAdImpressionsCount: RequestHandler<
  { userId: string },
  GetAdImpressionsRes
> = async (req, res, next) => {
  const userId = req.params.userId;
  const impressionId = generateImpressionId(userId);

  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).send({ message: 'No user with the given ID' });

    const adImpression = await AdImpression.findOne({ impressionId });

    res.send({
      message: 'Ad impressions count gotten successfully',
      adImpressionsCount: adImpression.count,
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
    const impressionId = generateImpressionId(userId);

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
