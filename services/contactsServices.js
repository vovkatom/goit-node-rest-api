import Contact from "../models/contact.js";

export const getListContacts = (filter = {}, setting = {}) =>
    Contact.find(filter, "-createdAt -updatedAt", setting).populate(
        "owner",
        "username email"
    );

export const countContacts = (filter) => Contact.countDocuments(filter);

export const addContact = (data) => Contact.create(data);

export const getContactById = (filter) => Contact.findById(filter);

export const updateContactById = (filter, data) =>
    Contact.findByIdAndUpdate(filter, data);

export const deleteContactById = (filter) => Contact.findByIdAndDelete(filter);

export const updateStatus = (filter, data) =>
    Contact.findByIdAndUpdate(filter, data);
