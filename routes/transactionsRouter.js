import {
  validateCreate,
  validateQuery,
  validateId,
} from "../middlewares/validation/transactionsValidation"
import transactionControllers from "../controllers/transactions/transaction-controllers"
import guard from "../middlewares/guard"
import { Router } from "express"
const router = new Router()

router.post(
  "/",
  [guard, validateCreate],
  transactionControllers.postTransaction
)

router.get("/", [guard, validateQuery], transactionControllers.getTransactions)

router.delete(
  "/:id",
  [guard, validateId],
  transactionControllers.delTransaction
)

router.get(
  "/month",
  [guard, validateQuery],
  transactionControllers.getMonthTransactions
)

router.get(
  "/summary",
  [guard, validateQuery],
  transactionControllers.transactionsSummary
)

router.get(
  "/stats",
  [guard, validateQuery],
  transactionControllers.transactionsStats
)

export default router
