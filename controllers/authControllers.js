import fs from "fs/promises";

import path from "path";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";

import gravatar from "gravatar";

import Jimp from "jimp";

import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const posterPath = path.resolve("public", "avatars");

const { JWT_SECRET, PROJECT_URL } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const avatarURL = await gravatar.url(
        email,
        { s: "250", r: "x", d: "monsterid" },
        true
    );

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await authServices.register({
        ...req.body,
        avatarURL,
        password: hashPassword,
        verificationToken,
    });

    const veryfyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(veryfyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        },
    });
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await authServices.updateUser(
        { _id: user._id },
        { verify: true, verificationToken: null }
    );

    res.json({
        message: "Verification successful",
    });
};

const resendVerify = async (req, res) => {
    const { email } = req.body;

    const user = await authServices.findUser({ email });

    if (!user) {
        throw HttpError(404, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const veryfyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(veryfyEmail);

    res.json({
        message: "Verify email send again",
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
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
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { path: oldPath, filename } = req.file;
    const newPath = path.join(posterPath, filename);

    const { _id } = req.user;

    await Jimp.read(oldPath)
        .then((foto) => {
            return foto.resize(250, 250).write(oldPath);
        })
        .catch((err) => {
            console.error(err);
        });

    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);

    const newUser = await authServices.updateAvatar(_id, { avatarURL });

    res.status(201).json({ avatarURL: newUser.avatarURL });
};

export default {
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerify: ctrlWrapper(resendVerify),
    getCurrent: ctrlWrapper(getCurrent),
    updateSub: ctrlWrapper(updateSub),
    udateAvt: ctrlWrapper(udateAvt),
};
