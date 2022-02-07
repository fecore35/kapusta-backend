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

router.get("/google", wrapperError(authControllers.googleAuth))
router.get("/google-redirect", wrapperError(authControllers.googleRedirect))

router.post(
  "/registration",
  limiter(TIME_REQUEST_LIMIT, REQUEST_LIMIT),
  validateRegistration,
  authControllers.registration
)

router.post("/login", validateLogin, authControllers.login)

router.post("/logout", guard, authControllers.logout)

export default router
