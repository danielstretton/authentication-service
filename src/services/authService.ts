import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

const generateToken = (user: IUser): string => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });
};

const register = async (email: string, password: string): Promise<IUser> => {
    const user = new User({ email, password });
    await user.save();
    return user;
};

const login = async (
    email: string,
    password: string
): Promise<{ user: IUser; token: string }> => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);
    return { user, token };
};

export { register, login, generateToken };
