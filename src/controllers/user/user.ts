import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';

import User, { validateSignupData, SignupData } from '../../models/user';

interface SignupResData {
  message: string;
  user?: {
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

  const { firstName, middleName, lastName, email, phone, gender, birthDay, birthMonth, birthYear, password, } = req.body;

  try {
    const fetchedUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (fetchedUser)
      return res.status(400).send({ message: 'User already registered' });

    const hashedPw = await bcrypt.hash(password, 12);

    const user = await new User({
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
        token: user.genAuthToken(),
        email,
        phone,
      },
    });
  } catch (e) {
    next(new Error('Error in adding user: ' + e));
  }
};
