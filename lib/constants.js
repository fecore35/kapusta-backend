
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
};

export const Role = {
    ADMIN: 'administrator',
    USER: 'user'
};

export const Messages = {
    BAD_REQUEST: {
        en: 'Bad request. Invalid ObjectId',
        ua: 'Некорректний запит. Недійсний ObjectId'
    },
    UNAUTHORIZED: {
        en: 'Invalid credential',
        ua: 'Недійсні облікові дані'
    },
    CONFLICT: {
        en: 'Such email is registered already',
        ua: 'Така електронна адреса вже зареєстрована'
    },
    NOT_FOUND: {
        en: 'Not found',
        ua: 'Не знайдено'
    },
    NOT_AUTHORIZED: {
        en: 'Not authorized',
        ua: 'Не авторизовано'
    },
    FORBIDDEN: {
        en: 'Access is denied',
        ua: 'В доступі відмовлено'
    },
    TOO_MANY_REQUESTS: {
        en: 'Too many requests, please try again later.',
        ua: 'Забагато запитів, спробуйте пізніше'
    },
    MISSING_FIELDS: {
        en: 'Missing fields',
        ua: 'Відсутні поля'
    },
    TOO_LITTLE_BALANCE: {
        en: 'Insufficient balance',
        ua: 'Тобі це треба?! Недостатьньо коштів на балансі!'
    }

};

export const LIMIT_JSON = 5000;
export const REQUEST_LIMIT = 2; 
export const TIME_REQUEST_LIMIT = 15 * 60 * 1000; 