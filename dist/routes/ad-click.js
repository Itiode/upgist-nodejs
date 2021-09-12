"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default();
const ad_click_1 = require("../controllers/ad-click");
router.post('/', ad_click_1.adClick);
exports.default = router;
