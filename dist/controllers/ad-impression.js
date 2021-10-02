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
exports.registerAdImpression = exports.getAdImpressionsCount = void 0;
const ad_impression_1 = __importStar(require("../models/ad-impression"));
const user_1 = __importDefault(require("../models/user"));
const getAdImpressionsCount = async (req, res, next) => {
    const userId = req.params.userId;
    const impressionId = ad_impression_1.generateImpressionId(userId);
    try {
        const user = await user_1.default.findById(userId);
        if (!user)
            return res.status(404).send({ message: 'No user with the given ID' });
        const adImpression = await ad_impression_1.default.findOne({ impressionId });
        res.send({
            message: 'Ad impressions count gotten successfully',
            adImpressionsCount: adImpression.count,
        });
    }
    catch (err) {
        next(new Error('Error in getting ad impressions count: ' + err));
    }
};
exports.getAdImpressionsCount = getAdImpressionsCount;
// TODO: Identify impressions from mobile app. To prevent endpoint abuse.
const registerAdImpression = async (req, res, next) => {
    const userId = req['user'].id;
    const impressionId = ad_impression_1.generateImpressionId(userId);
    try {
        const adImpression = await ad_impression_1.default.findOne({ impressionId });
        if (adImpression) {
            await ad_impression_1.default.updateOne({ impressionId }, { $inc: { count: 1 } }, { new: true });
            return res.status(200).send({
                message: 'Impression registered successfully',
                count: adImpression.count + 1,
                impressionId,
            });
        }
        else {
            await new ad_impression_1.default({ impressionId, count: 1, user: userId }).save();
            return res.status(201).send({
                message: 'Impression registered successfully',
                count: 1,
                impressionId,
            });
        }
    }
    catch (err) {
        next(new Error('Error in registering impression: ' + err));
    }
};
exports.registerAdImpression = registerAdImpression;
