import Joi from "joi";

export const createBlogValidator = Joi.object({
    therapistName: Joi.string().required(),
    title: Joi.string().required(),
    article: Joi.string().required(),
    image: Joi.string()
});


export const updateBlogValidator = Joi.object({
    therapistName: Joi.string(),
    title: Joi.string(),
    article: Joi.string(),
    image: Joi.string()
});