import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSetting } from "./hooks.js";
import { emailRegexp, phoneRegexp } from "../constants/contact-constants.js";
// import { required } from "joi";

const contactSchema = new Schema(
    {
        name: { type: String, required: [true, "Set name for contact"] },
        email: { type: String, match: emailRegexp },
        phone: { type: String, match: phoneRegexp },
        favorite: { type: Boolean, default: false },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSetting);

contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
