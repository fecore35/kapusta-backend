import transactionService from "../../services/transactions/transaction-service"
import { httpCodes, Messages } from "../../lib/constants"

class TransactionControllers {
  async postTransaction(req, res, next) {
    const { id: userId } = req.user
    if (req.body.sum < 0) {
      return res
        .status(httpCodes.OK)
        .json({ message: "Sum value must be positive" })
    }
    const newTransaction = await transactionService.add(userId, req.body)
    newTransaction
      ? res.status(httpCodes.CREATED).json({
          status: "success",
          code: httpCodes.CREATED,
          data: { newTransaction },
        })
      : res.status(httpCodes.CREATED).json({
          status: "success",
          code: httpCodes.CREATED,
          data: { newTransaction },
          message: Messages.TOO_LITTLE_BALANCE[req.app.get("lang")],
        })
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
    const { id: userId } = req.user
    const deletedContact = await transactionService.remove(userId, id)
    deletedContact
      ? res.status(httpCodes.OK).json({
          status: "success",
          code: httpCodes.OK,
          data: { deletedContact },
        })
      : res.status(httpCodes.NOT_FOUND).json({
          status: "error",
          code: httpCodes.NOT_FOUND,
          message: Messages.NOT_FOUND[req.app.get("lang")],
        })
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

  async transactionsStats(req, res, next) {
    const { id: userId } = req.user
    const { month, year } = req.body
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
}

const transactionControllers = new TransactionControllers()

export default transactionControllers
