"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adClick = void 0;
const ad_click_1 = __importDefault(require("../models/ad-click"));
// TODO: Identify clicks from mobile app. To prevent endpoint abuse.
const adClick = async (req, res, next) => {
    const userId = req['user'].id;
    const date = new Date();
    const transformedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const clickId = `${userId}:${transformedDate}`;
    try {
        const adClick = await ad_click_1.default.findOne({ clickId });
        if (adClick) {
            await ad_click_1.default.updateOne({ clickId }, { $inc: { count: 1 } }, { new: true });
            return res.status(200).send({
                message: 'Click registered successfully',
                count: adClick.count + 1,
                date: transformedDate,
            });
        }
        else {
            await new ad_click_1.default({ clickId, count: 1, user: userId }).save();
            return res.status(201).send({
                message: 'Click registered successfully',
                count: 1,
                date: transformedDate,
            });
        }
    }
    catch (err) {
        next(new Error('Error in registering click: ' + err));
    }
};
exports.adClick = adClick;
