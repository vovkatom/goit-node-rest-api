import express from "express";

import contactsControllers from "../controllers/contactsControllers.js";

import {
    contactAddSchema,
    contactUpdateSchema,
    updateStatusSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../decorators/validateBody.js";

import isValidId from "../middlewares/isValidid.js";

import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", isValidId, contactsControllers.getById);

contactsRouter.post(
    "/",
    validateBody(contactAddSchema),
    contactsControllers.add
);

contactsRouter.put(
    "/:id",
    isValidId,
    validateBody(contactUpdateSchema),
    contactsControllers.updateById
);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteById);

contactsRouter.patch(
    "/:id/favorite",
    isValidId,
    validateBody(updateStatusSchema),
    contactsControllers.updateStatusContact
);

export default contactsRouter;
