const listContacts = async () => {};

export default {
    listContacts,
};



const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const emptyBody = Object.keys(req.body).length === 0;

    if (emptyBody) throw HttpError(400, "Body must have at least one field");

    const contact = await contactsServices.updateById(id, req.body);

    if (!contact) throw HttpError(404);

    res.json(contact);
};
