import queryString from "query-string"
import axios from "axios"
import { httpCodes, Messages } from "../../lib/constants"
import userService from "../../services/users/user-service"
import authService from "../../services/auth/auth-service"
import { CustomError } from "../../lib/custom-error"
import { EmailService, SenderNodemailer } from "../../services/email"

class AuthControllers {
  async registration(req, res, next) {
    const { email } = req.body
    const isUserExist = await authService.isUserExist(email)
    if (isUserExist) {
      throw new CustomError(
        httpCodes.CONFLICT,
        Messages.CONFLICT[req.app.get("lang")]
      )
    }
    const data = await userService.create(req.body)
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderNodemailer()
    )
    const isSend = await emailService.sendVerifyEmail(
      email,
      data.name,
      data.verifyTokenEmail
    )
    delete data.verifyTokenEmail
    res.status(httpCodes.CREATED).json({
      status: "success",
      code: httpCodes.CREATED,
      data: { ...data, isSendEmailVerify: isSend },
    })
  }

  async login(req, res, next) {
    const { email, password } = req.body
    const user = await authService.getUser(email, password)

    if (!user) {
      throw new CustomError(
        httpCodes.UNAUTHORIZED,
        Messages.UNAUTHORIZED[req.app.get("lang")]
      )
    }
    const { name, id, balance, rebalancing } = user
    const token = authService.getToken(user)
    await authService.setToken(user.id, token)
    res.status(httpCodes.OK).json({
      status: "success",
      code: httpCodes.OK,
      data: { name, id, balance, rebalancing, token },
    })
  }

  async logout(req, res, next) {
    await authService.setToken(req.user.id, null)
    res
      .status(httpCodes.NO_CONTENT)
      .json({ status: "success", code: httpCodes.NO_CONTENT, data: {} })
  }

  async googleAuth(req, res) {
    const stringifiedParams = queryString.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    })
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    )
  }

  async googleRedirect(req, res) {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
    const urlObj = new URL(fullUrl)
    const urlParams = queryString.parse(urlObj.search)
    const code = urlParams.code

    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
        grant_type: "authorization_code",
        code,
      },
    })

    const userData = await axios({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    })

    const isUserExist = await userService.findByEmail(userData.data.email)
    if (!isUserExist) {
      const newUser = await userService.create(userData.data)
      const tokenForNewUser = authService.getToken(newUser)
      await authService.setToken(newUser.id, tokenForNewUser)
      const isNewUser = await userService.findByEmail(newUser.email)
      const sendUser = JSON.stringify({
        name: isNewUser.name,
        email: isNewUser.email,
        id: isNewUser.id,
        balance: isNewUser.balance,
        token: tokenForNewUser,
      })
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?user=${sendUser}`
      )
    }

    const newToken = await authService.getToken(isUserExist)
    await authService.updateToken(isUserExist.id, newToken)
    const sendUser = JSON.stringify({
      name: isUserExist.name,
      email: isUserExist.email,
      id: isUserExist.id,
      balance: isUserExist.balance,
      token: newToken,
    })
    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?user=${sendUser}`
    )
  }
}
const authControllers = new AuthControllers()

export default authControllers
