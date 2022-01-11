import Joi from "joi";

const joinGameValidation = Joi.object()
    .keys({
        roomId: Joi.string().required(),
    })
    .required();

export default { joinGameValidation };
