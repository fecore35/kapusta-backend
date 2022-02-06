import express from "express"
import logger from "morgan"
import cors from "cors"
import helmet from "helmet"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { httpCodes, LIMIT_JSON } from "./lib/constants"
import authRouter from "./routes/authRouters"
import usersRouter from "./routes/usersRouter"
import transactionsRouter from "./routes/transactionsRouter"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/transactions", transactionsRouter)
app.use("/api/link", (req, res) => {
  res.sendFile(join(__dirname, "/public/link.html"))
})

app.use((req, res) => {
  res
    .status(httpCodes.NOT_FOUND)
    .json({ status: "error", code: httpCodes.NOT_FOUND, message: "Not found" })
})

app.use((err, req, res, next) => {
  res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
    status: "fail",
    code: httpCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
  })
})

export default app
