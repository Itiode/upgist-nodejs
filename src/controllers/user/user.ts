import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import UserModel, {
  User,
  validateSignupData,
  SignupData,
  validateBankDetails,
  BankDetails,
} from '../../models/user';

interface SignupResData {
  message: string;
  user?: {
    id: string;
    token: string;
    email: string;
    phone: string;
  };
}

export const addUser: RequestHandler<any, SignupResData, SignupData> = async (
  req,
  res,
  next
) => {
  const { error } = validateSignupData(req.body);
  if (error) return res.status(422).send({ message: error.details[0].message });

  const {
    firstName,
    middleName,
    lastName,
    email,
    phone,
    gender,
    birthDay,
    birthMonth,
    birthYear,
    password,
  } = req.body;

  try {
    const fetchedUser = await UserModel.findOne({
      $or: [{ phone }, { email }],
    });
    if (fetchedUser)
      return res.status(400).send({ message: 'User already registered' });

    const hashedPw = await bcrypt.hash(password, 12);

    const user = await new UserModel({
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
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

interface GetUsersQueryParams {
  pageNumber: string;
  pageSize: string;
}

interface GetUsersResData {
  message: string;
  count?: number;
  users?: User[];
}

export const getUsers: RequestHandler<
  any,
  GetUsersResData,
  any,
  GetUsersQueryParams
> = async (req, res, next) => {
  const pageNumber = +req.query.pageNumber;
  const pageSize = +req.query.pageSize;

  try {
    const users = await UserModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select('-password -__v');

    if (users.length === 0) return res.send({ message: 'No registered users' });

    res.send({
      message: 'Users fetched successfully',
      count: users.length,
      users: users,
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

interface AddBankDetailsResData {
  message: string;
}

export const updateBankDetails: RequestHandler<
  any,
  AddBankDetailsResData,
  BankDetails
> = async (req, res, next) => {
  try {
    const { error } = validateBankDetails(req.body);
    if (error)
      return res.status(422).send({ message: error.details[0].message });

    const userId = req['user'].id;

    await UserModel.updateOne({ _id: userId }, { bankDetails: req.body });

    return res.send({ message: 'Bank details updated successfully' });
  } catch (e) {
    next(new Error("Error in updating user's bank details: " + e));
  }
};
