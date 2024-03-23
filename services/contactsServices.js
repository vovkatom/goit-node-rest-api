//import Contact from "../models/Ccontact.js";
import Contact from "../models/contact.js";

export const getListContacts = () => Contact.find();

export const addContact = (data) => Contact.create(data);

export const getContactById = async (id) => {
    const data = await Contact.findById(id);
    return data;
};

export const updateContactById = (id, data) =>
    Contact.findByIdAndUpdate(id, data);

export const deleteContactById = (id) => Contact.findByIdAndDelete(id);

export const updateStatus = (id, data) =>
    Contact.findByIdAndUpdate(id, data);
