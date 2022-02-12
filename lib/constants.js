export const httpCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
}

export const Role = {
  ADMIN: "administrator",
  USER: "user",
}

export const Messages = {
  BAD_REQUEST: {
    en: "Bad request. Invalid ObjectId",
    ua: "Некорректний запит. Недійсний ObjectId",
  },
  UNAUTHORIZED: {
    en: "Invalid credential",
    ua: "Недійсні облікові дані",
  },
  CONFLICT: {
    en: "Such email is registered already",
    ua: "Така електронна адреса вже зареєстрована",
  },
  NOT_FOUND: {
    en: "Not found",
    ua: "Не знайдено",
  },
  NOT_FOUND_TRANS: {
    en: "Not found transaction",
    ua: "Не знайдено трансакцію",
  },
  NOT_AUTHORIZED: {
    en: "Not authorized",
    ua: "Не авторизовано",
  },
  FORBIDDEN: {
    en: "Access is denied",
    ua: "В доступі відмовлено",
  },
  TOO_MANY_REQUESTS: {
    en: "Too many requests, please try again later.",
    ua: "Забагато запитів, спробуйте пізніше",
  },
  MISSING_FIELDS: {
    en: "Missing fields",
    ua: "Відсутні поля",
  },
  TOO_LITTLE_BALANCE: {
    en: "Insufficient balance",
    ua: "Недостатьньо коштів на балансі!",
  },

  AMOUNT_VS_BALANCE: {
    en: "Conflict. The transaction cannot be deleted. The transaction amount exceeds your balance.",
    ua: "Конфлікт. Трансакцію не можна видалити. Сума трансакції перевищує ваш баланс.",
  },

  SUM_VALUE_POSITIVE: {
    en: "Conflict. Sum value must be positive.",
    ua: "Конфлікт. Значення суми повинно бути додатнім.",
  },

  REBALANCING_TRUE: {
    en: "Conflict. You have already used the recharge option.",
    ua: "Конфлікт. Опція поповнення балансу використана.",
  },
}

export const LIMIT_REBALANCING = 100000
export const LIMIT_JSON = 5000
export const REQUEST_LIMIT = 4
export const TIME_REQUEST_LIMIT = 10 * 60 * 1000
export const CATEGORIES = [
  {
    name: "ТРАНСПОРТ",
    slug: "transport",
  },
  {
    name: "ПРДУКТЫ",
    slug: "foods",
  },
  {
    name: "ЗДОРОВЬЕ",
    slug: "health",
  },
  {
    name: "АЛКОГОЛЬ",
    slug: "alco",
  },
  {
    name: "РАЗВЛЕЧЕНИЯ",
    slug: "fun",
  },
  {
    name: "ВСЕ ДЛЯ ДОМА",
    slug: "house",
  },
  {
    name: "ТЕХНИКА",
    slug: "tech",
  },
  {
    name: "КОМУНАЛКА, СВЯЗЬ",
    slug: "utilities",
  },
  {
    name: "СПОРТ, ХОББИ",
    slug: "sport",
  },
  {
    name: "ОБРАЗОВАНИЕ",
    slug: "education",
  },
  {
    name: "ПРОЧЕЕ",
    slug: "other",
  },
  {
    name: "ЗП",
    slug: "salary",
  },
  {
    name: "ДОП ДОХОД",
    slug: "addition",
  },
]
