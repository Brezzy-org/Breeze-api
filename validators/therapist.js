import Joi from "joi";

export const registerTherapistValidator = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'therapist'),
    phoneNumber: Joi.string().required(),
    bio: Joi.string(),
    qualifications: Joi.string().required(),
    expertise: Joi.string().required(),
    experiencedYears: Joi.string().required()
});

export const loginTherapistValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const updateTherapistProfileValidator = Joi.object({
    name: Joi.string(),
    bio: Joi.string(),
    phoneNumber: Joi.string(),
    qualifications: Joi.string(),
    expertise: Joi.string(),
    experiencedYears: Joi.string()
});