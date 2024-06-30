import { Request, Response } from "express";
import { register, login } from "../services/authService";
import jwt from "jsonwebtoken";
import IUser from "../models/user";
import bcrypt from "bcryptjs";
import _ = require("lodash");

export const registerUser = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { email, password } = req.body;

    let user = await IUser.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");

    user = new IUser(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    try {
        return res
            .header("x-auth-token", token)
            .status(201)
            .send(_.pick(user, ["_id", "email"]));
    } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
    }
};
