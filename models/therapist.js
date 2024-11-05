import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

// define the therapist schema
const therapistSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'therapist',] },
    phoneNumber: { type: String, required: true },
    bio: { type: String },
    qualifications: { type: String, required: true },
    expertise: { type: String, required: true },
    experiencedYears: { type: String, required: true }

}, {
    timestamps: true
});

therapistSchema.plugin(toJSON);

export const TherapistModel = model('Therapist', therapistSchema);