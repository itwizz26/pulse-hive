import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(4000),
    ALLOWED_ORIGINS: Joi.string().default('*'),
    AUTH_SERVICE_URL: Joi.string().uri().required(),
    ORDER_SERVICE_URL: Joi.string().uri().required(),
    PAYMENT_SERVICE_URL: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().required(),
});
