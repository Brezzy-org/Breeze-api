import Joi from "joi";

export const createBlogValidator = Joi.object({
    title: Joi.string().required(),
    article: Joi.string().required(),
    image: Joi.string()
});


export const updateBlogValidator = Joi.object({
    title: Joi.string(),
    article: Joi.string(),
    image: Joi.string()
});