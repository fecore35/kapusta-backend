import Joi from "joi"
import mongoose from "mongoose"
import { httpCodes, Messages } from "../../lib/constants"

const { Types } = mongoose

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  role: Joi.string().valid("administrator", "user"),
  subscription: Joi.string().valid("starter", "pro", "business"),
})

const querySchema = Joi.object({
  sortBy: Joi.string()
    .optional()
    .valid("name", "role", "email", "subscription"),
  sortByDesc: Joi.string()
    .optional()
    .valid("name", "role", "email", "subscription"),
})

export const validateUpdate = async (req, res, next) => {
  try {
    await updateSchema.validateAsync(req.body)
  } catch (err) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    })
  }
  next()
}

export const validateUsersQuery = async (req, res, next) => {
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
  if (req.params.id !== "current" && !Types.ObjectId.isValid(req.params.id)) {
    return res.status(httpCodes.BAD_REQUEST).json({
      status: "error",
      code: httpCodes.BAD_REQUEST,
      message: Messages.BAD_REQUEST[req.app.get("lang")],
    })
  }
  next()
}
