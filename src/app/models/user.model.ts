import { model, Model, Schema } from "mongoose";
import {
  IAddress,
  IUser,
  UserInstanceMethods,
} from "../interfaces/user.interface";
import validator from "validator";
import bcrypt from "bcryptjs";

// sub schema
const addressSchema = new Schema<IAddress>(
  {
    city: { type: String },
    street: { type: String },
    zip: { type: Number },
  },
  {
    _id: false, // as it is a SUB SCHEMA we will turn off the _id so that automated mongodb id do not get inserted.
  }
);

// main schema
const userSchema = new Schema<IUser, Model<IUser>, UserInstanceMethods>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
      minlength: [
        3,
        "First name must be at least 3 characters. Got '{VALUE}'.",
      ],
      maxlength: [
        10,
        "First name must not exceed 10 characters. Got '{VALUE}'.",
      ],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
      minlength: [3, "Last name must be at least 3 characters. Got '{VALUE}'."],
      maxlength: [
        10,
        "Last name must not exceed 10 characters. Got '{VALUE}'.",
      ],
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
      min: [18, "Age must be at least 18. Got {VALUE}."],
      max: [60, "Age must not exceed 60. Got {VALUE}."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      unique: [true, "Email must be unique. Email is already in use."],
      validate: [validator.isEmail, "Provided Email Is Not Valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      lowercase: true,
      minlength: [6, "Password must be at least 6 characters."],
    },
    role: {
      type: String,
      uppercase: true,
      enum: {
        values: ["USER", "ADMIN", "SUPERADMIN"],
        message: "'{VALUE}' is not a supported role.",
      },
      default: "USER",
    },
    address: {
      type: addressSchema,
    }, //using address sub schema here.
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// creating a custom instance method for hashing password.
userSchema.method("hashPassword", async function (plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  return password;
});

export const User = model<IUser, Model<IUser, {}, UserInstanceMethods>>(
  "User",
  userSchema
);
