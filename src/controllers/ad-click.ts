import { RequestHandler } from 'express';

import AdClick, { generateClickId } from '../models/ad-click';
import UserModel from '../models/user';

interface GetAdClicksRes {
  message: string;
  adClicksCount?: number;
}

export const getAdClicksCount: RequestHandler<
  { userId: string },
  GetAdClicksRes
> = async (req, res, next) => {
  const userId = req.params.userId;
  const clickId = generateClickId(userId);

  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).send({ message: 'No user with the given ID' });

    const adClick = await AdClick.findOne({ clickId });

    res.send({
      message: 'Ad clicks count gotten successfully',
      adClicksCount: adClick.count,
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

  const clickId = generateClickId(userId);

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
