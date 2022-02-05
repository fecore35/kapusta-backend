import rateLimit from 'express-rate-limit';
import { httpCodes, Messages } from '../lib/constants';

const limiter = (duration, limit) => {
    return rateLimit({
        windowMs: duration, 
        max: limit, 
        standardHeaders: true, 
        legacyHeaders: false, 
        handler: (req, res, next) => {
            return res.status(httpCodes.TOO_MANY_REQUESTS).json({ status: 'error', code: httpCodes.TOO_MANY_REQUESTS, message: Messages.TOO_MANY_REQUESTS[req.app.get('lang')] });
        }
    });
};

export default limiter;