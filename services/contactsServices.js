// import Contact from "../models/contact.js";

// export const getAllMovies = () => Contact.find();


// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";
// import Contact from './../controllers/models/contact';

// const contactsPath = path.resolve("db", "contacts.json");

// const updateListContacts = (contacts) =>
//     fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

// export const getListContacts = async () => {
//     const data = await fs.readFile(contactsPath);

//     return JSON.parse(data);
// };

// export const getContactById = async (id) => {
//     const contacts = await getListContacts();
//     const result = contacts.find((item) => item.id === id);

//     return result || null;
// };

// export const addContact = async (data) => {
//     const contacts = await getListContacts();
//     const newContact = {
//         id: nanoid(),
//         ...data,
//     };
//     contacts.push(newContact);
//     await updateListContacts(contacts);

//     return newContact;
// };

// export const updateContactById = async (id, data) => {
//     const contacts = await getListContacts();
//     const index = contacts.findIndex((item) => item.id === id);
//     if (index === -1) {
//         return null;
//     }
//     contacts[index] = { ...contacts[index], ...data };
//     await updateListContacts(contacts);

//     return contacts[index];
// };

// export const deleteContactById = async (id) => {
//     const contacts = await getListContacts();
//     const index = contacts.findIndex((item) => item.id === id);
//     if (index === -1) {
//         return null;
//     }
//     const [result] = contacts.splice(index, 1);
//     await updateListContacts(contacts);

//     return result;
// };
