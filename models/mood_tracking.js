import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

export const moodschema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    moodType: {type: String, required: true},
    moodLevel: {type: String, required: true},
    energyLevel: {type: String, required: true},
    stressLevel: {type: String, required: true},
    sleepQuality: {type: String, required: true},
    description: {type: String, required: true}
}, {
    timestamps: true
});

moodschema.plugin(toJSON)

export const MoodModel = model('Mood', moodschema);