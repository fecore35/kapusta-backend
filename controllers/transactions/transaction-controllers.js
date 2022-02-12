import transactionService from "../../services/transactions/transaction-service"
import userService from "../../services/users/user-service"
import { CustomError } from "../../lib/custom-error"
import { httpCodes, Messages } from "../../lib/constants"

class TransactionControllers {
  async postTransaction(req, res, next) {
    const { id: userId } = req.user
    if (Number(req.body.sum) < 0) {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.SUM_VALUE_POSITIVE[req.app.get("lang")]
      )
    }
    const newTransaction = await transactionService.add(userId, req.body)
    if (newTransaction) {
      res.status(httpCodes.CREATED).json({
        status: "success",
        code: httpCodes.CREATED,
        data: { newTransaction },
      })
    } else {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.TOO_LITTLE_BALANCE[req.app.get("lang")]
      )
    }
  }

  async getTransactions(req, res, next) {
    const { id: userId } = req.user
    const transactions = await transactionService.list(userId, req.query)
    res.status(httpCodes.OK).json({
      status: "success",
      code: httpCodes.OK,
      data: { ...transactions },
    })
  }

  async delTransaction(req, res, next) {
    const { id } = req.params
    const { id: userId, balance } = req.user
    const transaction = await transactionService.getById(userId, id)
    if (!transaction) {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND_TRANS[req.app.get("lang")]
      )
    }
    const { sum, income } = transaction
    if (income && sum > balance) {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.AMOUNT_VS_BALANCE[req.app.get("lang")]
      )
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
    if (deletedTransaction && updatedUser) {
      res.status(httpCodes.OK).json({
        status: "success",
        code: httpCodes.OK,
        data: { updatedBalance: updatedUser.balance, deletedTransaction },
      })
    } else {
      throw new CustomError(
        httpCodes.NOT_FOUND,
        Messages.NOT_FOUND[req.app.get("lang")]
      )
    }
  }

  async getMonthTransactions(req, res, next) {
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
  }

  async transactionsSummary(req, res, next) {
    const { id: userId } = req.user
    const summaries = await transactionService.summary(userId)
    res.status(httpCodes.OK).json({
      status: "success",
      code: httpCodes.OK,
      data: { ...summaries },
    })
  }

  async transactionsCategoryStats(req, res, next) {
    const { id: userId } = req.user
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
  }

  async transactionsDescriptionStats(req, res, next) {
    const { id: userId } = req.user
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
  }
}

const transactionControllers = new TransactionControllers()

export default transactionControllers
