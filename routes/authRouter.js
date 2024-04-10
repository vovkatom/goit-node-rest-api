import express from "express";

import authSchemas from "../schemas/authSchemas.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import upload from "../middlewares/upload.js";

const { register, verify, resendVerify, login, logout, getCurrent, updateSub, udateAvt } =
    authControllers;

const { subSchema, registerSchema, loginSchema, emailSchema } = authSchemas;

const authRouter = express.Router();

authRouter.patch("/", authenticate, validateBody(subSchema), updateSub);

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.get("/verify/:verificationToken", verify);

authRouter.post("/verify", validateBody(emailSchema), resendVerify);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

//upload.fields([{name: "poster", maxCount: 1}])
//upload.array("avatar", 8);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), udateAvt);

export default authRouter;
