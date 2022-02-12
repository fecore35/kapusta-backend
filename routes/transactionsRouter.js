import {
  validateCreate,
  validateQuery,
  validateId,
  validateDescriptionsQuery,
  validateStatsQuery,
} from "../middlewares/validation/transactionsValidation"
import transactionControllers from "../controllers/transactions/transaction-controllers"
import guard from "../middlewares/guard"
import wrapperError from "../middlewares/error-handler"
import { Router } from "express"

const router = new Router()
const {
  postTransaction,
  getTransactions,
  delTransaction,
  getMonthTransactions,
  transactionsSummary,
  transactionsCategoryStats,
  transactionsDescriptionStats,
} = transactionControllers

router.post("/", [guard, validateCreate], wrapperError(postTransaction))

router.get("/", [guard, validateQuery], wrapperError(getTransactions))

router.delete("/:id", [guard, validateId], wrapperError(delTransaction))

router.get("/month", [guard, validateQuery], wrapperError(getMonthTransactions))

router.get(
  "/summary",
  [guard, validateQuery],
  wrapperError(transactionsSummary)
)

router.get(
  "/stats/:month/:year",
  [guard, validateStatsQuery],
  wrapperError(transactionsCategoryStats)
)

router.get(
  "/description/:month/:year/:category",
  [guard, validateDescriptionsQuery],
  wrapperError(transactionsDescriptionStats)
)

export default router
