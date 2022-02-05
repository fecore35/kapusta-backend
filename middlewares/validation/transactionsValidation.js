import Joi from 'joi';
// import mongoose from 'mongoose';
import { httpCodes } from '../../lib/constants';
  
// const { Types } = mongoose;

const createSchema = Joi.object({
    day: Joi.number().required(), 
    month: Joi.number().required(), 
    year: Joi.number().required(), 
    sum: Joi.number().required(),
    income: Joi.boolean().required(),
    description: Joi.string().required(),
    category: Joi.string().required().valid('transport', 'foods', 'health', 'alco', 'fun', 'house', 'tech', 'utilities', 'sport', 'education', 'other', 'salary', 'addition')
}); 

const regLimit = /\d+/; 

const querySchema = Joi.object({
    limit: Joi.string().pattern(regLimit).optional(),
    skip: Joi.string().pattern(regLimit).optional(),
    page: Joi.string().pattern(regLimit).optional(),
    sortBy: Joi.string().optional().valid('month', 'year', 'category', 'description'),
    sortByDesc: Joi.string().optional().valid('month', 'year', 'category', 'description'),
    // filter: Joi.string().optional().pattern(new RegExp(`(name|email|phone)\\|?(name|email|phone)+`)), //gives an error (line below does not give an error)
    filter: Joi.string().optional().pattern(/month|month|category|description/),  
}); 


export const validateCreate = async (req, res, next) => {
    try {
        await createSchema.validateAsync(req.body);
    }
    catch (err) {
        return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: `Field ${err.message.replace(/"/g, '')}`});
    };
    next();
};

// export const validateUpdate = async (req, res, next) => {
//     try {
//         await updateSchema.validateAsync(req.body);
//     }
//     catch (err) {
//         const [{ type }] = err.details;
//         if (type === 'object.missing') {
//             return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: Messages.MISSING_FIELDS[req.app.get('lang')] });
//         };
//         return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: err.message.replace(/"/g, '')});
//     };
//     next(); 
// };

// export const validateUpdateFavorite = async (req, res, next) => {
//     try {
//         await updateFavoriteSchema.validateAsync(req.body);
//     }
//     catch (err) {
//         const [{ type }] = err.details;
//         if (type === 'object.missing') {
//             return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: Messages.MISSING_FIELDS[req.app.get('lang')] });
//         };
//         return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: err.message.replace(/"/g, '')});
//     };
//     next(); 
//  };

// export const validateId = async (req, res, next) => {
//     if (!Types.ObjectId.isValid(req.params.id)) {
//         return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: Messages.BAD_REQUEST[req.app.get('lang')] });
//     };
//     next();
// };

export const validateQuery = async (req, res, next) => {
    try {
        await querySchema.validateAsync(req.query);
    }
    catch (err) {
        return res.status(httpCodes.BAD_REQUEST).json({ status: 'error', code: httpCodes.BAD_REQUEST, message: `Field ${err.message.replace(/"/g, '')}`});
    };
    next();
};





