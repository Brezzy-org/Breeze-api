import Joi from "joi";

export const addMoodValidator = Joi.object({
    moodType: Joi.string().required(),
    moodLevel: Joi.string().required(),
    energyLevel: Joi.string().required(),
    stressLevel: Joi.string().required(),
    sleepQuality: Joi.string().required(),
    description: Joi.string().required()
});

export const updateMoodValidator = Joi.object({
    moodType: Joi.string(),
    moodLevel: Joi.string(),
    energyLevel: Joi.string(),
    stressLevel: Joi.string(),
    sleepQuality: Joi.string(),
    description: Joi.string()
});
