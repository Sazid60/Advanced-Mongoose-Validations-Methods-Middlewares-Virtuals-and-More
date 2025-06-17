# Advanced-Mongoose-Validations-Methods-Middlewares-Virtuals-and-More

GitHub Link: https://github.com/Apollo-Level2-Web-Dev/advanced-note-app-with-mongoose/tree/module-7

## 18-1 Validations in Mongoose: Built-in and Custom validations [max/min]

[Validators](https://mongoosejs.com/docs/validation.html)

#### Builtin minLength and maxLength, min and max, lowercase, uppercase, unique validator

```js
import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema =
  new Schema() <
  IUser >
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 60,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      lowercase: true,
      required: true,
    },
    role: {
      type: String,
      uppercase: true,
      enum: ["USER", "ADMIN", "SUPERADMIN"],
      default: "USER",
    },
  };

export const User = model < IUser > ("User", userSchema);
```

#### Custom message validation error message.

```js
import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema =
  new Schema() <
  IUser >
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
      match: [/^\S+@\S+\.\S+$/, "Invalid email format. Got '{VALUE}'."],
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
  };

export const User = model < IUser > ("User", userSchema);
```

#### Validation is like a middleware. It validates and if any error it do not allow to push the data to next stage.

## 18-2 More About Built-in validation, Making Custom Validations & Third party Validator Package

#### For mutation types we do no need to write validation error message.

#### Custom Validations

##### Validating Email using Builtin validator `match`

```js
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    unique: [true, "Email must be unique. Email is already in use."],
    match: [/^\S+@\S+\.\S+$/, "Invalid email format. Got '{VALUE}'."],
  },
```

##### Validating Email using Custom Validator

```js
email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    unique: [true, "Email must be unique. Email is already in use."],
    validate: {
      validator: function (value) {
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: function (props) {
        return `Email ${props.value} Is Not a Valid Email`;
      },
    },
  },
```

##### Validating Email using Third Party Validator

[Validator Js](https://www.npmjs.com/package/validator)

1.  Install the validator

```
npm i validator
```

2. Install The Types Library

```
npm i --save-dev @types/validator
```

```js
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    unique: [true, "Email must be unique. Email is already in use."],
    validate: [validator.isEmail, "Provided Email Is Not Valid"],
  },
```

## 18-3 Validate using Zod

- In traditional validations, even if a type is specified, values of other types are often implicitly converted to the specified type. Zod solves this problem by enforcing strict type checking without automatic type coercion.
- Zod is a schema validation library. It validates only the schema.
- We have some data type. The way we are creating schema we will create zod validation schema.This validation layer will work over mongoose validation layer.

- When a use user sends a request It will be sent to zod. zod will validate the data inside body and then it will be send to mongoose validation layer. It increases safety and rush over mongoose as most of the validations will be done in ZOD.
- As Zod do not require to connect with database to validate so it will reduce the operation time.

- Zod do the validation ant the sanitization of the data first.

1. Install Zod

```
npm install zod
```

- user.controller.ts

```js
import { Request, Response } from "express";
import app from "../../app";
import express from "express";
import { User } from "../models/user.model";
import { z } from "zod";

export const usersRoutes = express.Router();

const createUserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string(),
  password: z.string(),
  role: z.string().optional(),
});
usersRoutes.post("/create-user", async (req: Request, res: Response) => {
  try {
    const body = await createUserZodSchema.parseAsync(req.body);

    console.log("Zod Body :", body);

    const user = await User.create(body);

    res.status(201).json({
      success: true,
      message: "Users Created Successfully !",
      user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});
```
