import express from "express"
import logger from "morgan"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
import { httpCodes, LIMIT_JSON } from "./lib/constants"
import authRouter from "./routes/authRouters"
import usersRouter from "./routes/usersRouter"
import transactionsRouter from "./routes/transactionsRouter"

const app = express()

const formatsLogger = app.get("env") === "development" ? "dev" : "short"

app.use(helmet())
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: LIMIT_JSON }))
app.use((req, res, next) => {
  app.set("lang", req.acceptsLanguages(["en", "ua"]))
  next()
})

app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use("/transactions", transactionsRouter)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use((err, req, res, next) => {
  const statusCode = err.status || httpCodes.INTERNAL_SERVER_ERROR
  const status =
    statusCode === httpCodes.INTERNAL_SERVER_ERROR ? "fail" : "error"
  res.status().json({
    status: status,
    code: statusCode,
    message: err.message,
  })
})

export default app
