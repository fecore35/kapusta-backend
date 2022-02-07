import { httpCodes } from "../lib/constants"

const wrapperError = (fn) => async (req, res, next) => {
  try {
    const result = await fn(req, res, next)
    return result
  } catch (error) {
    switch (error.name) {
      case "CustomError":
        return res.status(error.status).json({
          status: "error",
          code: error.status,
          message: error.message,
        })
      case "ValidationError":
        return res.status(httpCodes.BAD_REQUEST).json({
          status: "error",
          code: httpCodes.BAD_REQUEST,
          message: error.message,
        })

      default:
        next(error)
        break
    }
  }
}
export default wrapperError
