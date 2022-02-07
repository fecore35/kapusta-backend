import { httpCodes, Messages } from '../../lib/constants';
import userService from '../../services/users/user-service';
import authService from '../../services/auth/auth-service';

class AuthControllers {

    async registration(req, res, next) {
        const { email } = req.body;
        const isUserExist = await authService.isUserExist(email);
        if (isUserExist) {
            return res.status(httpCodes.CONFLICT).json({ status: 'error', code: httpCodes.CONFLICT, message: Messages.CONFLICT[req.app.get('lang')] });
        };
        const data = await userService.create(req.body);
        res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data });
    };

    async login(req, res, next) {
        const { email, password } = req.body; 
        const user = await authService.getUser(email, password); 

        if (!user) {
            return res.status(httpCodes.UNAUTHORIZED).json({ status: 'error', code: httpCodes.UNAUTHORIZED, message: Messages.UNAUTHORIZED[req.app.get('lang')] });
        };
        const { id } = user; 
        const token = authService.getToken(user); 
        await authService.setToken(user.id, token); 
        res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: { id, token } });
    };

    async logout(req, res, next) {
        await authService.setToken(req.user.id, null);
        res.status(httpCodes.NO_CONTENT).json({ status: 'success', code: httpCodes.NO_CONTENT, data: {} });
    };
};

const authControllers = new AuthControllers;

export default authControllers;
