import fs from "fs/promises";

import path from "path";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";

import gravatar from "gravatar";

import Jimp from "jimp";

const posterPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const avatarURL = await gravatar.url(
        email,
        { s: "250", r: "x", d: "retro" },
        true
    );

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await authServices.register({
        ...req.body,
        avatarURL,
        password: hashPassword,
    });

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        },
    });
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
    const { email, subscription, _id } = req.user;
    res.json({ email, subscription, _id });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: "" });
    res.status(204).send();
};

const updateSub = async (req, res) => {
    const { _id } = req.user;
    const { subscription } = req.body;

    await authServices.updateSubscription(_id, { subscription });
    res.status(200).json({
        message: `Subscription changed to ${subscription}`,
    });
};

const udateAvt = async (req, res) => {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(posterPath, filename);

    const { _id } = req.user;

    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("public", "avatars", filename);

    Jimp.read(avatarURL)
        .then((foto) => {
            return foto
                .resize(250, 250) 
                .write(avatarURL);
        })
        .catch((err) => {
            console.error(err);
        });

    const newUser = await authServices.updateAvatar(_id, { avatarURL });

    res.status(201).json({ avatarURL: newUser.avatarURL });
};

export default {
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    register: ctrlWrapper(register),
    getCurrent: ctrlWrapper(getCurrent),
    updateSub: ctrlWrapper(updateSub),
    udateAvt: ctrlWrapper(udateAvt),
};
