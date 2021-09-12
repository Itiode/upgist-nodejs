"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adClick = void 0;
const ad_click_1 = __importDefault(require("../models/ad-click"));
const adClick = async (req, res, next) => {
    const userId = req['user'].id;
    const date = new Date();
    const clickId = `${userId}:${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    try {
        let click = await ad_click_1.default.findOne({ clickId });
        if (click) {
            await ad_click_1.default.updateOne({ clickId }, { $inc: { count: 1 } }, { new: true });
            return res
                .status(200)
                .send({ message: 'Click registered successfully', count: click.count });
        }
        else {
            await new ad_click_1.default({ clickId, count: 1 }).save();
            return res
                .status(201)
                .send({ message: 'Click registered successfully', count: 1 });
        }
    }
    catch (err) {
        next(new Error('Error in authenticating user: ' + err));
    }
};
exports.adClick = adClick;
