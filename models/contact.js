import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: String,
    email: String,
    phone: String,
});

const Contact = model("contact", contactSchema);

export default Contact;


// import { required } from "joi";
// import { Schema, model } from "mongoose";
// import { handleSaveError } from "./hooks.js";

// const contactSchema = new Schema({
//     name: {
//         type: String,
//         required: [true, "Set name for contact"],
//     },
//     email: {
//         type: String,
//     },
//     phone: {
//         type: String,
//     },
//     favorite: {
//         type: Boolean,
//         default: false,
//     },
// }, {versionKey: false, timestamps: true});

// contactSchema.post("save", handleSaveError);

// const Contact = model("contact", contactSchema);

// export default Contact;