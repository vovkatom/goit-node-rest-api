import {Schema, model} from "mongoose";

const contactSchema = new Schema({
    title: String,
    director: String,
})

const Contact = model("contact", contactSchema);
// category => categories
// mouse => mice

export default Contact;