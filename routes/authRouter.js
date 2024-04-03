import express from "express";

import authSchemas from "../schemas/authSchemas.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

import upload from "../middlewares/upload.js";

const { register, login, logout, getCurrent, updateSub } = authControllers;

const { subSchema, registerSchema, loginSchema } = authSchemas;

const authRouter = express.Router();

authRouter.patch("/", authenticate, validateBody(subSchema), updateSub);

// upload.fields([{name: "poster", maxCount: 1}])
//upload.array("avatar", 8);
authRouter.post("/register", upload.single("avatar"), validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
