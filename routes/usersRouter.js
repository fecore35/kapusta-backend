import {
  validateUpdate,
  validateUsersQuery,
  validateId,
  validateUpdateBalance,
} from "../middlewares/validation/usersValidation"
import roleAccess from "../middlewares/role-access"
import userControllers from "../controllers/users/user-controllers"
import guard from "../middlewares/guard"
import { Router } from "express"
import { Role } from "../lib/constants"
const router = new Router()

router.get(
  "/",
  [guard, roleAccess(Role.ADMIN), validateUsersQuery],
  userControllers.getUsers
)

router.get("/:id", [guard, validateId], userControllers.getUser)

router.put(
  "/:id/update",
  [guard, roleAccess(Role.ADMIN), validateId, validateUpdate],
  userControllers.putUser
)

router.delete(
  "/:id",
  [guard, roleAccess(Role.ADMIN), validateId],
  userControllers.delUser
)

router.put(
  "/balance",
  [guard, validateUpdateBalance],
  userControllers.putUserBalance
)

export default router
