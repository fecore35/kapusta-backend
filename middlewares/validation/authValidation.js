import Joi from 'joi';
import { httpCodes } from '../../lib/constants';

const registrationSchema = Joi.object({
    name: Joi.string().min(3).max(30), 
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('administrator', 'user'),
    subscription: Joi.string().valid('starter', 'pro', 'business'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validateRegistration = async (req, res, next) => {
    try {
        await registrationSchema.validateAsync(req.body);
    }
    catch (err) {
        return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: `Field ${err.message.replace(/"/g, '')}`});
    };
    next();
};

export const validateLogin = async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body);
    }
    catch (err) {
        return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: `Field ${err.message.replace(/"/g, '')}`});
    };
    next();
};