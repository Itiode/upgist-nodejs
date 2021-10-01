"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adImpression = void 0;
const ad_impression_1 = __importDefault(require("../models/ad-impression"));
// TODO: Identify impressions from mobile app. To prevent endpoint abuse.
const adImpression = async (req, res, next) => {
    const userId = req['user'].id;
    const date = new Date();
    const transformedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const impressionId = `${userId}:${transformedDate}`;
    try {
        const adImpression = await ad_impression_1.default.findOne({ impressionId });
        if (adImpression) {
            await ad_impression_1.default.updateOne({ impressionId }, { $inc: { count: 1 } }, { new: true });
            return res.status(200).send({
                message: 'Impression registered successfully',
                count: adImpression.count + 1,
                date: transformedDate,
            });
        }
        else {
            await new ad_impression_1.default({ impressionId, count: 1, user: userId }).save();
            return res.status(201).send({
                message: 'Impression registered successfully',
                count: 1,
                date: transformedDate,
            });
        }
    }
    catch (err) {
        next(new Error('Error in registering impression: ' + err));
    }
};
exports.adImpression = adImpression;
