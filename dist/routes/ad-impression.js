"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default();
const ad_impression_1 = require("../controllers/ad-impression");
const auth_1 = __importDefault(require("../middleware/auth"));
router.post('/', auth_1.default, ad_impression_1.adImpression);
exports.default = router;
