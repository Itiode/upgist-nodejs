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
exports.assignRole = exports.updateBankDetails = exports.getUsers = exports.updateUser = exports.addUser = exports.getUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importStar(require("../../models/user"));
const getUser = async (req, res, next) => {
    const userId = req['user'].id;
    try {
        const user = await user_1.default.findById(userId).select('-password -__v -createdAt -updatedAt');
        if (!user)
            return res.status(404).send({ message: 'User not found' });
        res.send({ message: "User's data fetched successfully", data: user });
    }
    catch (e) {
        next(new Error('Error in getting user: ' + e));
    }
};
exports.getUser = getUser;
const addUser = async (req, res, next) => {
    const { error } = user_1.validateSignupReq(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { firstName, middleName, lastName, email, phone, gender, birthDay, birthMonth, birthYear, password, } = req.body;
    try {
        const fetchedUser = await user_1.default.findOne({
            $or: [{ phone }, { email }],
        });
        if (fetchedUser)
            return res.status(400).send({ message: 'User already registered' });
        const hashedPw = await bcrypt_1.default.hash(password, 12);
        const user = await new user_1.default({
            name: {
                first: firstName,
                middle: middleName === null || undefined ? '' : middleName,
                last: lastName,
            },
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
                name: user.name,
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
const updateUser = async (req, res, next) => {
    const { error } = user_1.validateUpdateUserReq(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    try {
        const userId = req['user'].id;
        const { phone } = req.body;
        // const user = await UserModel.updateOne(
        //   { _id: userId },
        //   { $set: { phone } },
        //   { new: true }
        // );
        const user = await user_1.default.findOneAndUpdate({ _id: userId }, { $set: { phone } }, { new: true, useFindAndModify: false });
        console.log(user);
        res.send({
            message: 'Update successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (e) {
        next(new Error('Error in updating user: ' + e));
    }
};
exports.updateUser = updateUser;
const getUsers = async (req, res, next) => {
    const pageNumber = +req.query.pageNumber;
    const pageSize = +req.query.pageSize;
    try {
        const users = await user_1.default.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .select('-password -__v');
        if (users.length === 0)
            return res.send({ message: 'No registered users' });
        res.send({
            message: 'Users fetched successfully',
            count: users.length,
            users: users,
        });
    }
    catch (e) {
        next(new Error('Error in adding user: ' + e));
    }
};
exports.getUsers = getUsers;
const updateBankDetails = async (req, res, next) => {
    try {
        const { error } = user_1.validateBankDetails(req.body);
        if (error)
            return res.status(422).send({ message: error.details[0].message });
        const userId = req['user'].id;
        await user_1.default.updateOne({ _id: userId }, { bankDetails: req.body });
        return res.send({ message: 'Bank details updated successfully' });
    }
    catch (e) {
        next(new Error("Error in updating user's bank details: " + e));
    }
};
exports.updateBankDetails = updateBankDetails;
const assignRole = async (req, res, next) => {
    const { error } = user_1.validateAssignRoleReq(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const isSuperAdmin = req['user'].roles.find((r) => r === 'Super Admin');
    if (isSuperAdmin) {
        const phone = req.body.phone;
        try {
            let user = await user_1.default.findOne({ phone });
            if (!user)
                return res
                    .status(404)
                    .send({ message: 'No user with the given phone number' });
            const validRoles = ['Admin', 'Moderator'];
            const newRole = req.body.role;
            const result = validRoles.find((r) => r === newRole);
            if (!result) {
                return res.status(400).send({ message: 'Invalid role.' });
            }
            const role = user.roles.find((r) => r === newRole);
            if (role) {
                return res
                    .status(400)
                    .send({ message: `User is a ${newRole} already.` });
            }
            else {
                user.roles.push(newRole);
            }
            await user.save();
            res.send({ message: `${user.name} now has the role of ${newRole}` });
        }
        catch (e) {
            next(new Error('Error in assigning role: ' + e));
        }
    }
    else {
        res
            .status(403)
            .send({ message: "Can't add role. User is not a super admin." });
    }
};
exports.assignRole = assignRole;
