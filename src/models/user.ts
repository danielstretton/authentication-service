import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { required } from "joi";
import jwt from "jsonwebtoken";
import config from "config";

export interface IUser extends Document {
    email: string;
    password: string;
    isAdmin: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
    },
});

UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.generateAuthToken = function (): string {
    return jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        config.get("jwtPrivateKey")
    );
};
UserSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
