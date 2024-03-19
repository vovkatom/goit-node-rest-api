import express from "express";

import contactsControllers from "../controllers/contactsControllers.js";

import { contactAddSchema, contactUpdateSchema } from "../schemas/contactsSchemas.js";

import validateBody from "../decorators/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

// contactsRouter.get("/:id", contactsControllers.getById);

// contactsRouter.post("/", validateBody(contactAddSchema), contactsControllers.add);

// contactsRouter.put("/:id", validateBody(contactUpdateSchema), contactsControllers.updateById);

// contactsRouter.delete("/:id", contactsControllers.deleteById);

export default contactsRouter;