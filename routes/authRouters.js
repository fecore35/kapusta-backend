import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validation/authValidation"
import authControllers from "../controllers/auth/auth-controllers"
import guard from "../middlewares/guard"
import limiter from "../middlewares/rate-limit"
import wrapperError from "../middlewares/error-handler"
import { TIME_REQUEST_LIMIT, REQUEST_LIMIT } from "../lib/constants"
import { Router } from "express"

const router = new Router()
const { registration, login, logout } = authControllers

router.get("/google", wrapperError(authControllers.googleAuth))

router.get("/google-redirect", wrapperError(authControllers.googleRedirect))

router.post(
  "/registration",
  limiter(TIME_REQUEST_LIMIT, REQUEST_LIMIT),
  validateRegistration,
  wrapperError(registration)
)

router.post("/login", validateLogin, wrapperError(login))

router.post("/logout", guard, wrapperError(logout))

export default router
