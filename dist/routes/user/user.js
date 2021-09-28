"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default();
const user_1 = require("../../controllers/user/user");
const admin_1 = __importDefault(require("../../middleware/admin"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_2 = require("../../controllers/user/user");
router.post('/', user_1.addUser);
router.get('/me', auth_1.default, user_2.getUser);
router.get('/', auth_1.default, admin_1.default, user_1.getUsers);
router.put('/bank-details', auth_1.default, user_1.updateBankDetails);
exports.default = router;
