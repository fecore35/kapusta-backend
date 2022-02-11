import userService from "../../services/users/user-service"
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
    try {
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
      soughtUser
        ? res.status(httpCodes.OK).json({
            status: "success",
            code: httpCodes.OK,
            data: { ...result },
          })
        : res.status(httpCodes.NOT_FOUND).json({
            status: "error",
            code: httpCodes.NOT_FOUND,
            message: Messages.NOT_FOUND[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }

  async delUser(req, res, next) {
    try {
      const { id } = req.params
      const isAdmin = req.user.role === Role.ADMIN
      const deletedUser = await userService.remove(id, isAdmin)
      deletedUser
        ? res.status(httpCodes.OK).json({
            status: "success",
            code: httpCodes.OK,
            data: { deletedUser },
          })
        : res.status(httpCodes.NOT_FOUND).json({
            status: "error",
            code: httpCodes.NOT_FOUND,
            message: Messages.NOT_FOUND[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }

  async putUser(req, res, next) {
    try {
      const { id } = req.params
      const updatedUser = await userService.update(id, req.body)
      updatedUser
        ? res.status(httpCodes.OK).json({
            status: "success",
            code: httpCodes.OK,
            message: req.body.balance,
          })
        : res.status(httpCodes.NOT_FOUND).json({
            status: "error",
            code: httpCodes.NOT_FOUND,
            message: Messages.NOT_FOUND[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }

  async putUserBalance(req, res, next) {
    try {
      const { id, balance } = req.body
      const { currentBalance, rebalancing } =
        await userService.getUserBalanceById(id)
      if (rebalancing) {
        return res.status(httpCodes.CONFLICT).json({
          status: "error",
          code: httpCodes.CONFLICT,
          currentBalance: currentBalance,
          message: Messages.REBALANCING_TRUE[req.app.get("lang")],
        })
      }
      if (Number(balance) < 0) {
        return res.status(httpCodes.CONFLICT).json({
          status: "error",
          code: httpCodes.CONFLICT,
          currentBalance: currentBalance,
          message: Messages.SUM_VALUE_POSITIVE[req.app.get("lang")],
        })
      }
      if (Number(balance) > LIMIT_REBALANCING) {
        return res.status(httpCodes.CONFLICT).json({
          status: "error",
          code: httpCodes.CONFLICT,
          currentBalance: currentBalance,
          message: `Balance value maybe no more ${LIMIT_REBALANCING}`,
        })
      }
      const newBalance = Number(currentBalance) + Number(balance)
      const newRebalancing = !rebalancing
      const updatedUser = await userService.updateBalance(
        id,
        newBalance.toFixed(2),
        newRebalancing
      )
      updatedUser
        ? res.status(httpCodes.OK).json({
            status: "success",
            code: httpCodes.OK,
            currentBalance: newBalance.toFixed(2),
          })
        : res.status(httpCodes.NOT_FOUND).json({
            status: "error",
            code: httpCodes.NOT_FOUND,
            message: Messages.NOT_FOUND[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }
}

const userControllers = new UserControllers()

export default userControllers
