import userService from '../../services/users/user-service';
import transactionService from '../../services/transactions/transaction-service';
import {httpCodes, Messages, Role} from '../../lib/constants';

class UserControllers {
    async getUsers(req, res, next) {
        const users = await userService.list(req.query); 
        res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: { ...users } });
    };
    
    async getUser(req, res, next) {
        let { id } = req.params;
        const { id: currentUserId } = req.user;
        (id === 'current') && (id = currentUserId);
        const isAdmin = (req.user.role === Role.ADMIN);
        const soughtUser = await userService.getById(id, currentUserId, isAdmin);
        const { name, email, role, subscription } = soughtUser;
        let result = null;
        isAdmin ?
            result = soughtUser :
            result = {name, email, role, subscription};
        soughtUser ?
            res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: {result}} ) : 
            res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')]});
    };

    async delUser(req, res, next) {
        const { id } = req.params;
        const isAdmin = (req.user.role === Role.ADMIN); 
        const deletedUser = await userService.remove(id, isAdmin);
        deletedUser ?
            res.status(httpCodes.OK).json({status: 'success', code: httpCodes.OK, data: {deletedUser}}) :
            res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')] });
    };
    
    async putUser(req, res, next) {
        const { id } = req.params;  
        const updatedUser = await userService.update(id, req.body);
        updatedUser ?
            res.status(httpCodes.OK).json( {status: 'success', code: httpCodes.OK, message: req.body} ) :
            res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')]});
    };

    async aggregation (req, res, next) {
        const { id, month, year } = req.params;
        const data = await transactionService.getStatisticsTransactions(id, month, year)
        if (data) {
            return res
            .status(httpCodes.OK)
            .json({ status: 'success', code: httpCodes.OK, data })
        }
        res
            .status(httpCodes.NOT_FOUND)
            .json({ status: 'error', code: httpCodes.NOT_FOUND, message: 'Not found' })
    };
};

const userControllers = new UserControllers;

export default userControllers;