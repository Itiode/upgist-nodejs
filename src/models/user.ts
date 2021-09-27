import mongoose, { Schema } from 'mongoose';
import config from 'config';
import * as Jwt from 'jsonwebtoken';
import Joi from 'joi';

import nameSchema, { Name } from './schemas/name';

export interface User {
  name: Name;
  email: string;
  phone: string;
  gender: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  password: string;
  roles: string[];
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType: string;
  };
}

const schema = new Schema<User>(
  {
    name: { type: nameSchema },
    email: {
      type: String,
      trim: true,
      minLength: 5,
      maxLength: 250,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      minLength: 11,
      maxLength: 11,
      unique: true,
      required: true,
    },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    birthDay: {
      type: String,
      trim: true,
      minLength: 1,
      maxLength: 2,
      required: true,
    },
    birthMonth: {
      type: String,
      trim: true,
      minLength: 1,
      maxLength: 2,
      required: true,
    },
    birthYear: {
      type: String,
      trim: true,
      minLength: 4,
      maxLength: 4,
      required: true,
    },
    password: { type: String, trim: true, required: true },
    roles: [String],
    bankDetails: {
      bankName: { type: String, trim: true, maxLength: 250 },
      accountType: { type: String, trim: true, maxLength: 25 },
      accountNumber: { type: String, trim: true, minLength: 10, maxLength: 10 },
      accountName: { type: String, trim: true, maxLength: 250 },
    },
  },
  { timestamps: true }
);

schema.methods.genAuthToken = function () {
  return Jwt.sign(
    {
      id: this._id,
      phone: this.phone,
      email: this.email,
      roles: this.roles,
    },
    config.get('jwtAuthPrivateKey'),
    { expiresIn: '1h' }
  );
};

export default mongoose.model('user', schema);

export interface SignupData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  password: string;
}

export function validateSignupData(data: SignupData) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(2).max(25).required(),
    middleName: Joi.string().trim().min(2).max(25),
    lastName: Joi.string().trim().min(2).max(25).required(),
    email: Joi.string()
      .min(5)
      .max(250)
      .email({ minDomainSegments: 2 })
      .required(),
    phone: Joi.string()
      .trim()
      .min(11)
      .max(11)
      .regex(new RegExp('^[0-9]*$'))
      .required(),
    gender: Joi.string().trim().min(2).max(25).required(),
    birthDay: Joi.string().trim().min(1).max(2).required(),
    birthMonth: Joi.string().trim().min(1).max(2).required(),
    birthYear: Joi.string().trim().min(4).max(4).required(),
    password: Joi.string().trim().min(6).max(250).required(),
  });

  return schema.validate(data);
}

export interface AuthData {
  email: string;
  password: string;
}

export function validateAuthData(data: AuthData) {
  const schema = Joi.object({
    email: Joi.string()
      .max(250)
      .trim()
      .email({ minDomainSegments: 2 })
      .required(),
    password: Joi.string().min(6).max(50).trim().required(),
  });

  return schema.validate(data);
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
}

export function validateBankDetails(data: BankDetails) {
  const schema = Joi.object({
    banName: Joi.string().trim().max(250).required(),
    accountName: Joi.string().trim().max(250).required(),
    accountType: Joi.string().trim().max(25).required(),
    accountNumber: Joi.string().trim().min(10).max(10).required(),
  });

  return schema.validate(data);
}
