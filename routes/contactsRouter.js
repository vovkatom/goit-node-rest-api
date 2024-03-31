import express from "express";

import { ctrl } from "../controllers/contactsControllers.js";
import { schemas } from "../schemas/contactsSchemas.js";

import authenticate from "../middlewares/authenticate.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrl.getAllContacts);

contactsRouter.get("/:id", isValidId, ctrl.getOneContact);

contactsRouter.delete("/:id", isValidId, ctrl.deleteContact);

contactsRouter.post(
    "/",
    validateBody(schemas.createContactSchema),
    ctrl.createContact
);

contactsRouter.put(
    "/:id",
    isValidId,
    validateBody(schemas.updateContactSchema),
    ctrl.updateContact
);

contactsRouter.patch(
    "/:id/favorite",
    isValidId,
    validateBody(schemas.updateStatusSchema),
    ctrl.updateStatusContact
);

export default contactsRouter;
