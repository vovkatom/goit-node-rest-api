import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;

    const filter = favorite ? { $and: [{ owner }, { favorite }] } : { owner };
    const contacts = await contactsService.listContacts(filter, {
        skip,
        limit,
    });

    const total = await contactsService.countContacts({ owner });

    if (!contacts) throw HttpError(404);

    res.json({
        contacts,
        total,
    });
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await contactsService.getContactById({ _id: id, owner });
    if (!contact) throw HttpError(404);
    res.json(contact);
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await contactsService.removeContact({ _id: id, owner });
    if (!result) throw HttpError(404);
    res.json(result);
};

export const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { name, email, phone } = req.body;

    const existingContact = await contactsService.getContactByDetails({
        name,
        email,
        phone,
        owner,
    });

    if (existingContact) {
        return res.status(400).json({ message: "Contact already exists" });
    }

    const newContact = await contactsService.addContact({ ...req.body, owner });
    if (!newContact) {
        throw HttpError(400);
    }
    res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const updatedContact = await contactsService.updateById(
        { _id: id, owner },
        req.body,
        {
            new: true,
        }
    );
    if (!updatedContact) {
        throw HttpError(404);
    }
    res.status(200).json(updatedContact);
};

export const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const favoredContact = await contactsService.updateStatusById(
        { _id: id, owner },
        req.body,
        {
            new: true,
        }
    );
    if (!favoredContact) {
        throw HttpError(404, `contact ${id} Not found`);
    }
    res.status(200).json(favoredContact);
};

export const ctrl = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
};
