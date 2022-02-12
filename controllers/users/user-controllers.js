import userService from "../../services/users/user-service"
import { CustomError } from "../../lib/custom-error"
import {
  httpCodes,
  Messages,
  Role,
  LIMIT_REBALANCING,
} from "../../lib/constants"

class UserControllers {
  async getUsers(req, res, next) {
    try {
      const users = await userService.list(req.query)
      res
        .status(httpCodes.OK)
        .json({ status: "success", code: httpCodes.OK, data: { ...users } })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req, res, next) {
    let { id } = req.params
    const { id: currentUserId } = req.user
    id === "current" && (id = currentUserId)
    const isAdmin = req.user.role === Role.ADMIN
    const soughtUser = await userService.getById(id, currentUserId, isAdmin)
    const { name, email, role, balance, rebalancing } = soughtUser
    let result = null
    isAdmin
      ? (result = soughtUser)
      : (result = { name, email, role, balance, rebalancing })
    if (soughtUser) {
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...result },
      })
    } else {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND[req.app.get("lang")]
      )
    }
  }

  async delUser(req, res, next) {
    const { id } = req.params
    const isAdmin = req.user.role === Role.ADMIN
    const deletedUser = await userService.remove(id, isAdmin)
    if (deletedUser) {
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { deletedUser },
      })
    } else {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND[req.app.get("lang")]
      )
    }
  }

  async putUser(req, res, next) {
    const { id } = req.params
    const updatedUser = await userService.update(id, req.body)
    if (updatedUser) {
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        message: req.body.balance,
      })
    } else {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND[req.app.get("lang")]
      )
    }
  }

  async putUserBalance(req, res, next) {
    const { id, balance } = req.body
    const { currentBalance, rebalancing } =
      await userService.getUserBalanceById(id)
    if (rebalancing) {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.REBALANCING_TRUE[req.app.get("lang")]
      )
    }
    if (Number(balance) < 0) {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.SUM_VALUE_POSITIVE[req.app.get("lang")]
      )
    }
    if (Number(balance) > LIMIT_REBALANCING) {
      throw new CustomError(
        httpCodes.CONFLICT,
        `Balance value maybe no more ${LIMIT_REBALANCING}`
      )
    }
    const newBalance = Number(currentBalance) + Number(balance)
    const newRebalancing = !rebalancing
    const updatedUser = await userService.updateBalance(
      id,
      newBalance.toFixed(2),
      newRebalancing
    )
    if (updatedUser) {
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        currentBalance: newBalance.toFixed(2),
      })
    } else {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND[req.app.get("lang")]
      )
    }
  }
}

const userControllers = new UserControllers()

export default userControllers
