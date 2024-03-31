import express from "express";

import authSchemas from "../schemas/authSchemas.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

import authControllers from "../controllers/authControllers.js";

const { register, login, logout, getCurrent, updateSub } = authControllers;

const { subSchema, registerSchema, loginSchema } = authSchemas;

const authRouter = express.Router();

authRouter.patch("/", authenticate, validateBody(subSchema), updateSub);

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
