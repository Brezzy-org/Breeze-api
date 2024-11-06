import Joi from "joi";
import mongoose from "mongoose";

// Custom validation for ObjectId
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

export const addMoodValidator = Joi.object({
    userId: Joi.string().custom(objectIdValidator, "ObjectId validation").required(),
    moodType: Joi.string().required(),
    moodLevel: Joi.string().required(),
    energyLevel: Joi.string().required(),
    stressLevel: Joi.string().required(),
    sleepQuality: Joi.string().required(),
    description: Joi.string().required()
});

export const updateMoodValidator = Joi.object({
    userId: Joi.string().custom(objectIdValidator, "ObjectId validation"),
    moodType: Joi.string(),
    moodLevel: Joi.string(),
    energyLevel: Joi.string(),
    stressLevel: Joi.string(),
    sleepQuality: Joi.string(),
    description: Joi.string()
});
