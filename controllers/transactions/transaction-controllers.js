import transactionService from "../../services/transactions/transaction-service"
import userService from "../../services/users/user-service"
import { httpCodes, Messages } from "../../lib/constants"

class TransactionControllers {
  async postTransaction(req, res, next) {
    try {
      const { id: userId } = req.user
      if (Number(req.body.sum) < 0) {
        return res.status(httpCodes.CONFLICT).json({
          status: "error",
          code: httpCodes.CONFLICT,
          message: Messages.SUM_VALUE_POSITIVE[req.app.get("lang")],
        })
      }
      const newTransaction = await transactionService.add(userId, req.body)
      newTransaction
        ? res.status(httpCodes.CREATED).json({
            status: "success",
            code: httpCodes.CREATED,
            data: { newTransaction },
          })
        : res.status(httpCodes.CONFLICT).json({
            status: "error",
            code: httpCodes.CONFLICT,
            message: Messages.TOO_LITTLE_BALANCE[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }

  async getTransactions(req, res, next) {
    try {
      const { id: userId } = req.user
      const transactions = await transactionService.list(userId, req.query)
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...transactions },
      })
    } catch (error) {
      next(error)
    }
  }

  async delTransaction(req, res, next) {
    try {
      const { id } = req.params
      const { id: userId, balance } = req.user
      const transaction = await transactionService.getById(userId, id)
      const { sum, income } = transaction
      if (income && sum > balance) {
        return res.status(httpCodes.CONFLICT).json({
          status: "error",
          code: httpCodes.CONFLICT,
          message: Messages.AMOUNT_VS_BALANCE[req.app.get("lang")],
        })
      }
      let newBalance = null
      const deletedTransaction = await transactionService.remove(userId, id)

      income && deletedTransaction
        ? (newBalance = balance - sum)
        : (newBalance = balance + sum)

      let updatedUser = null
      if (deletedTransaction) {
        updatedUser = await userService.updateBalance(
          userId,
          newBalance.toFixed(2)
        )
      }
      deletedTransaction && updatedUser
        ? res.status(httpCodes.OK).json({
            status: "success",
            code: httpCodes.OK,
            data: { updatedBalance: updatedUser.balance, deletedTransaction },
          })
        : res.status(httpCodes.NOT_FOUND).json({
            status: "error",
            code: httpCodes.NOT_FOUND,
            message: Messages.NOT_FOUND_USER_TRANS[req.app.get("lang")],
          })
    } catch (error) {
      next(error)
    }
  }

  async getMonthTransactions(req, res, next) {
    try {
      const { id: userId } = req.user
      const { month, year, income } = req.body
      const transactions = await transactionService.listMonth(
        userId,
        year,
        month,
        income
      )
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...transactions },
      })
    } catch (error) {
      next(error)
    }
  }

  async transactionsSummary(req, res, next) {
    try {
      const { id: userId } = req.user
      const summaries = await transactionService.summary(userId)
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...summaries },
      })
    } catch (error) {
      next(error)
    }
  }

  async transactionsCategoryStats(req, res, next) {
    try {
      const { id: userId } = req.user
      // const { month, year } = req.body
      const { month, year } = req.params
      const stats = await transactionService.monthCategoryStats(
        userId,
        year,
        month
      )
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...stats },
      })
    } catch (error) {
      next(error)
    }
  }

  async transactionsDescriptionStats(req, res, next) {
    try {
      const { id: userId } = req.user
      // const { month, year, category } = req.body
      const { month, year, category } = req.params
      const stats = await transactionService.monthDescriptionStats(
        userId,
        year,
        month,
        category
      )
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { ...stats },
      })
    } catch (error) {
      next(error)
    }
  }
}

const transactionControllers = new TransactionControllers()

export default transactionControllers
