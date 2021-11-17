import Joi from "joi";

const loginSchema = {
    body: Joi.object()
        .keys({
            username: Joi.string().required(),
            password: Joi.string().required().max(128),
        })
        .required(),
};

const registerSchema = {
    body: Joi.object()
        .keys({
            username: Joi.string().required(),
            password: Joi.string().required().min(6).max(128),
        })
        .required(),
};

export default { loginSchema, registerSchema };
