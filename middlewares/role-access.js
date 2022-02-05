

import { httpCodes, Messages } from '../lib/constants';

const roleAccess = (role) => async (req, res, next) => {
    const currentUserRole = req.user.role;

    if (currentUserRole !== role) {
        return res.status(httpCodes.FORBIDDEN).json({ status: 'error', code: httpCodes.FORBIDDEN, message: Messages.FORBIDDEN[req.app.get('lang')]}); 
    }
    
    next();
};

export default roleAccess;