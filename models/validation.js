const Joi = require("joi");

// SIGNUP VALIDATION
const signValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(40)
            .required(),

        email: Joi.string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', "in"] } }),

        password: Joi.string()
            .min(6)
            .required(),

        conf_password: Joi.string()
            .min(6)
            .required(),

        role: Joi.required()
    });
    return schema.validate(data);
}

// LOGIN VALIDATION
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', "in"] } }),

        password: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(data);
}

// ADD BLOG VALIDATION
const addBlogValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string()
            .required(),
        content: Joi.required()
    });
    return schema.validate(data);
}

// ADD REVIEW VALIDATION
const addReviewValidation = (data) => {
    const schema = Joi.object({
        rating: Joi.number()
            .required(),
        comment: Joi.string().required()
    });
    return schema.validate(data);
}


module.exports.signValidation = signValidation;
module.exports.loginValidation = loginValidation;
module.exports.addBlogValidation = addBlogValidation;
module.exports.addReviewValidation = addReviewValidation;

