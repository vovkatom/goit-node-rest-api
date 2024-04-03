import bcrypt from "bcrypt";

import User from "../models/User.js";

export const findUser = (filter) => User.findOne(filter);

export const register = data => User.create(data);

export const validatePassword = (password, hashPassword) =>
    bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateSubscription = (filter, data) => User.findOneAndUpdate(filter, data);

export const updateAvatar = (filter, data) => User.findOneAndUpdate(filter, data);
