import * as contactsServices from "../services/moviesServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const getAll = async (req, res) => {
    const result = await contactsServices.getListContacts();
    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
};

const add = async (req, res) => {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.updateContactById(id, req.body);
    const emptyBody = Object.keys(req.body).length === 0;

    if (emptyBody) throw HttpError(400, "Body must have at least one field");

    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
};

const deleteById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsServices.deleteContactById(id);
    if (!result) {
        throw HttpError(404, `Not found`);
    }

    // res.json({
    //     message: "Delete success",
    // });
    res.json(result);
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
};
