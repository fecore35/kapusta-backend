import Joi from "joi"
import { httpCodes, Messages } from "../../lib/constants"
import mongoose from "mongoose"
const { Types } = mongoose

const createSchema = Joi.object({
  day: Joi.number().required(),
  month: Joi.number().required(),
  year: Joi.number().required(),
  sum: Joi.number().required(),
  income: Joi.boolean().required(),
  description: Joi.string().required(),
  category: Joi.string()
    .required()
    .valid(
      "transport",
      "foods",
      "health",
      "alco",
      "fun",
      "house",
      "tech",
      "utilities",
      "sport",
      "education",
      "other",
      "salary",
      "addition"
    ),
})

const descriptionQuerySchema = Joi.object({
  month: Joi.number().required(),
  year: Joi.number().required(),
  category: Joi.string()
    .required()
    .valid(
      "transport",
      "foods",
      "health",
      "alco",
      "fun",
      "house",
      "tech",
      "utilities",
      "sport",
      "education",
      "other",
      "salary",
      "addition"
    ),
})

const statsQuerySchema = Joi.object({
  month: Joi.number().required(),
  year: Joi.number().required(),
})

const regLimit = /\d+/

const querySchema = Joi.object({
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.string().pattern(regLimit).optional(),
  page: Joi.string().pattern(regLimit).optional(),
  sortBy: Joi.string()
    .optional()
    .valid("month", "year", "category", "description"),
  sortByDesc: Joi.string()
    .optional()
    .valid("month", "year", "category", "description"),
  filter: Joi.string()
    .optional()
    .pattern(/month|month|category|description/),
})

export const validateCreate = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body)
  } catch (err) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    })
  }
  next()
}

export const validateDescriptionsQuery = async (req, res, next) => {
  try {
    await descriptionQuerySchema.validateAsync(req.params)
  } catch (err) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    })
  }
  next()
}

export const validateStatsQuery = async (req, res, next) => {
  try {
    await statsQuerySchema.validateAsync(req.params)
  } catch (err) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    })
  }
  next()
}

export const validateQuery = async (req, res, next) => {
  try {
    await querySchema.validateAsync(req.query)
  } catch (err) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    })
  }
  next()
}

export const validateId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: Messages.BAD_REQUEST[req.app.get("lang")],
    })
  }
  next()
}
