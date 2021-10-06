"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdClick = exports.getAdClicksCount = void 0;
const ad_click_1 = __importStar(require("../models/ad-click"));
const ads_1 = require("../shared/ads");
const user_1 = __importDefault(require("../models/user"));
const getAdClicksCount = async (req, res, next) => {
    const { day, month, year } = req.query;
    const date = { day, month, year };
    const userId = req.params.userId;
    const queryDate = ads_1.getQueryDate(date);
    try {
        const user = await user_1.default.findById(userId);
        if (!user)
            return res.status(404).send({ message: 'No user with the given ID' });
        const adClicks = await ad_click_1.default.find({
            clickId: new RegExp(queryDate + '$'),
        });
        const adClicksCount = ad_click_1.getClicksCount(adClicks);
        res.send({
            message: 'Ad clicks count gotten successfully',
            adClicksCount,
        });
    }
    catch (err) {
        next(new Error('Error in getting ad clicks count: ' + err));
    }
};
exports.getAdClicksCount = getAdClicksCount;
// TODO: Identify clicks from mobile app. To prevent endpoint abuse.
const registerAdClick = async (req, res, next) => {
    const userId = req['user'].id;
    const clickId = ads_1.generateId(userId);
    try {
        const adClick = await ad_click_1.default.findOne({ clickId });
        if (adClick) {
            await ad_click_1.default.updateOne({ clickId }, { $inc: { count: 1 } }, { new: true });
            return res.status(200).send({
                message: 'Click registered successfully',
                count: adClick.count + 1,
                clickId,
            });
        }
        else {
            await new ad_click_1.default({ clickId, count: 1, user: userId }).save();
            return res.status(201).send({
                message: 'Click registered successfully',
                count: 1,
                clickId,
            });
        }
    }
    catch (err) {
        next(new Error('Error in registering click: ' + err));
    }
};
exports.registerAdClick = registerAdClick;
