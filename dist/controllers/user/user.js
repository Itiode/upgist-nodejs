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
exports.addUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importStar(require("../../models/user"));
const addUser = async (req, res, next) => {
    const { error } = user_1.validateSignupData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { firstName, middleName, lastName, email, phone, gender, birthDay, birthMonth, birthYear, password, } = req.body;
    try {
        const fetchedUser = await user_1.default.findOne({ $or: [{ phone }, { email }] });
        if (fetchedUser)
            return res.status(400).send({ message: 'User already registered' });
        const hashedPw = await bcrypt_1.default.hash(password, 12);
        const user = await new user_1.default({
            firstName,
            middleName: middleName === null || undefined ? '' : middleName,
            lastName,
            email,
            phone,
            gender,
            birthDay,
            birthMonth,
            birthYear,
            password: hashedPw,
        }).save();
        res.status(201).send({
            message: 'Signup successful!',
            user: {
                id: user._id,
                token: user.genAuthToken(),
                email,
                phone,
            },
        });
    }
    catch (e) {
        next(new Error('Error in adding user: ' + e));
    }
};
exports.addUser = addUser;
