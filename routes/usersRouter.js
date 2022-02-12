import {
  validateUpdate,
  validateUsersQuery,
  validateId,
} from "../middlewares/validation/usersValidation"
import roleAccess from "../middlewares/role-access"
import userControllers from "../controllers/users/user-controllers"
import guard from "../middlewares/guard"
import wrapperError from "../middlewares/error-handler"
import { Router } from "express"
import { Role } from "../lib/constants"
const router = new Router()
const {
  getUsers,
  getUser,
  putUser,
  delUser,
  putUserBalance,
  verifyUser,
  repeatEmailForVerifyUser,
} = userControllers

router.get(
  "/",
  [guard, roleAccess(Role.ADMIN), validateUsersQuery],
  wrapperError(getUsers)
)

router.get("/:id", [guard, validateId], wrapperError(getUser))

router.put(
  "/:id/update",
  [guard, roleAccess(Role.ADMIN), validateId, validateUpdate],
  wrapperError(putUser)
)

router.delete(
  "/:id",
  [guard, roleAccess(Role.ADMIN), validateId],
  wrapperError(delUser)
)

router.put("/balance", guard, wrapperError(putUserBalance))
router.get("/verify/:token", wrapperError(verifyUser))
router.post("/verify", wrapperError(repeatEmailForVerifyUser))

export default router
