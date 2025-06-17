import { Request, Response } from "express";
import bcrypt from "bcryptjs";
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
    const zodBody = await createUserZodSchema.parseAsync(req.body);
    const body = req.body;

    // console.log("Zod Body :", body);

    // const user = await User.create(body);

    const password = await bcrypt.hash(body.password, 10);

    console.log(password);

    body.password = password;

    // another method of creating a user
    const user = new User(body);

    await user.save(); // here .save() function is a instance method

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

usersRoutes.patch("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });

  res.status(201).json({
    success: true,
    message: "User Updated Successfully !",
    user,
  });
});

usersRoutes.get("/", async (req: Request, res: Response) => {
  const users = await User.find();

  res.status(201).json({
    success: true,
    message: "Users Retrieved Successfully !",
    users,
  });
});

usersRoutes.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  res.status(201).json({
    success: true,
    message: "User Retrieved Successfully !",
    user,
  });
});

usersRoutes.delete("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);

  res.status(201).json({
    success: true,
    message: "User Deleted Successfully !",
    user,
  });
});
