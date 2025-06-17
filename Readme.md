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
      unique: [true, "Email must be unique. '{VALUE}' is already in use."],
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
    unique: [true, "Email must be unique. '{VALUE}' is already in use."],
    match: [/^\S+@\S+\.\S+$/, "Invalid email format. Got '{VALUE}'."],
  },
```

##### Validating Email using Custom Validator

```js
email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    unique: [true, "Email must be unique. '{VALUE}' is already in use."],
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
    unique: [true, "Email must be unique. '{VALUE}' is already in use."],
    validate: [validator.isEmail, "Provided Email Is Not Valid"],
  },
```
