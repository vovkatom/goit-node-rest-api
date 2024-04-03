import fs from "fs/promises";

import path from "path";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";
import { token } from "morgan";

const { JWT_SECRET } = process.env;

const posterPath = path.resolve("public", "avatars");

const register = async (req, res) => {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(posterPath, filename);
    
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        await fs.unlink(req.file.path);
        throw HttpError(409, "Email already in use");
    }

    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("public", "avatars", filename);

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.register({ ...req.body, avatarURL, password: hashPassword });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        },
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const comparePassword = await authServices.validatePassword(
        password,
        user.password
    );
    if (!comparePassword) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser(user._id, { token });
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: "" });
    res.status(204).send();
};

const updateSub = async (req, res) => {
    const { _id, subscription } = req.body;
    await authServices.updateSubscription(_id, { subscription });
    res.status(200).json({
        message: `Subscription changed to ${subscription}`,
    });
};

export default {
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    register: ctrlWrapper(register),
    getCurrent: ctrlWrapper(getCurrent),
    updateSub: ctrlWrapper(updateSub),
};
