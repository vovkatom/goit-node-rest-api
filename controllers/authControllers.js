import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as authServices from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const register = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (user) {
        throw HttpError(409, "Email in use");
    }

    const newUser = await authServices.register(req.body);
    if (!newUser) {
        throw HttpError(404, "Not found");
    }
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
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
