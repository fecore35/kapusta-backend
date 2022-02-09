import queryString from "query-string"
import axios from "axios"
import { httpCodes, Messages } from "../../lib/constants"
import userService from "../../services/users/user-service"
import authService from "../../services/auth/auth-service"

class AuthControllers {
  async registration(req, res, next) {
    const { email } = req.body
    const isUserExist = await authService.isUserExist(email)
    if (isUserExist) {
      return res.status(httpCodes.CONFLICT).json({
        status: "error",
        code: httpCodes.CONFLICT,
        message: Messages.CONFLICT[req.app.get("lang")],
      })
    }
    const data = await userService.create(req.body)
    res
      .status(httpCodes.OK)
      .json({ status: "success", code: httpCodes.OK, data })
  }

  async login(req, res, next) {
    const { email, password } = req.body
    const user = await authService.getUser(email, password)

    if (!user) {
      return res.status(httpCodes.UNAUTHORIZED).json({
        status: "error",
        code: httpCodes.UNAUTHORIZED,
        message: Messages.UNAUTHORIZED[req.app.get("lang")],
      })
    }
    const { id } = user
    const token = authService.getToken(user)
    await authService.setToken(user.id, token)
    res
      .status(httpCodes.OK)
      .json({ status: "success", code: httpCodes.OK, data: { id, token } })
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

      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard?${isNewUser}&newToken=${tokenForNewUser}`
      )
    }
    const newToken = await authService.getToken(isUserExist)
    await authService.updateToken(isUserExist.id, newToken)

    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?${isUserExist}&newToken=${newToken}`
    )
  }
}
const authControllers = new AuthControllers()

export default authControllers
