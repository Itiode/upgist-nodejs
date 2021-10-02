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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClicksCount = exports.generateClickId = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const schema = new mongoose_1.Schema({
    clickId: { type: String, trim: true, required: true },
    count: { type: Number, min: 0, max: 1000, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Ad-Click', schema);
const generateClickId = (userId) => {
    const date = new Date();
    const transformedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return `${userId}:${transformedDate}`;
};
exports.generateClickId = generateClickId;
const getClicksCount = (clicks) => {
    let clicksCount = 0;
    for (let click of clicks) {
        clicksCount += click.count;
    }
    return clicksCount;
};
exports.getClicksCount = getClicksCount;
