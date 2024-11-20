import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

export const blogSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Therapist', required: true },
    // therapistName: {type: String, required: true},
    title: { type: String, required: true },
    article: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now } // Automatically adds creation date
},{
    timestamps: true
});

blogSchema.plugin(toJSON)

export const BlogModel = model('Blog', blogSchema);