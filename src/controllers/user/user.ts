import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import UserModel, {
  User,
  validateSignupReq,
  SignupReq,
  UpdateUserReq,
  validateUpdateUserReq,
  validateBankDetails,
  BankDetails,
  AssignRoleReq,
  validateAssignRoleReq,
} from '../../models/user';
import { Name } from '../../models/schemas/name';

interface GetUserResData {
  message: string;
  data?: {
    name: Name;
    email: string;
    phone: string;
    gender: string;
    birthDay: string;
    birthMonth: string;
    bankDetails: {
      bankName: string;
      accountNumber: string;
      accountType: string;
      accountName: string;
    };
  };
}

export const getUser: RequestHandler<any, GetUserResData> = async (
  req,
  res,
  next
) => {
  const userId = req['user'].id;

  try {
    const user = await UserModel.findById(userId).select(
      '-password -__v -createdAt -updatedAt'
    );
    if (!user) return res.status(404).send({ message: 'User not found' });

    res.send({ message: "User's data fetched successfully", data: user });
  } catch (e) {
    next(new Error('Error in getting user: ' + e));
  }
};

interface SignupResData {
  message: string;
  user?: {
    id: string;
    token: string;
    email: string;
    phone: string;
  };
}

export const addUser: RequestHandler<any, SignupResData, SignupReq> = async (
  req,
  res,
  next
) => {
  const { error } = validateSignupReq(req.body);
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
        email,
        phone,
      },
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};

interface UpdateUserRes {
  message: string;
}

export const updateUser: RequestHandler<any, UpdateUserRes, UpdateUserReq> =
  async (req, res, next) => {
    const { error } = validateUpdateUserReq(req.body);
    if (error)
      return res.status(422).send({ message: error.details[0].message });

    try {
      const userId = req['user'].id;
      const { phone } = req.body;

      await UserModel.updateOne({ _id: userId }, { $set: { phone } });

      res.send({ message: 'Update successful' });
    } catch (e) {
      next(new Error('Error in updating user: ' + e));
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

interface AddBankDetailsRes {
  message: string;
}

export const updateBankDetails: RequestHandler<
  any,
  AddBankDetailsRes,
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

interface AssignRoleRes {
  message: string;
}

export const assignRole: RequestHandler<any, AssignRoleRes, AssignRoleReq> =
  async (req, res, next) => {
    const { error } = validateAssignRoleReq(req.body);
    if (error)
      return res.status(422).send({ message: error.details[0].message });

    const isSuperAdmin = req['user'].roles.find(
      (r: string) => r === 'Super Admin'
    );

    if (isSuperAdmin) {
      const phone = req.body.phone;

      try {
        let user = await UserModel.findOne({ phone });
        if (!user)
          return res
            .status(404)
            .send({ message: 'No user with the given phone number' });

        const validRoles = ['Admin', 'Moderator'];

        const newRole = req.body.role;

        const result = validRoles.find((r: string) => r === newRole);
        if (!result) {
          return res.status(400).send({ message: 'Invalid role.' });
        }

        const role = user.roles.find((r: string) => r === newRole);

        if (role) {
          return res
            .status(400)
            .send({ message: `User is a ${newRole} already.` });
        } else {
          user.roles.push(newRole);
        }

        await user.save();

        res.send({ message: `${user.name} now has the role of ${newRole}` });
      } catch (e) {
        next(new Error('Error in assigning role: ' + e));
      }
    } else {
      res
        .status(403)
        .send({ message: "Can't add role. User is not a super admin." });
    }
  };
