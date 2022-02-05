import transactionService from '../../services/transactions/transaction-service';
import { httpCodes, Role, Messages } from '../../lib/constants';

class TransactionControllers {
    async postTransaction(req, res, next) {
        const { id: userId } = req.user; 
        const newContact = await transactionService.add(userId, req.body);
        console.log('newContact==', newContact)
        newContact ?
            res.status(httpCodes.CREATED).json({ status: 'success', code: httpCodes.CREATED, data: { newContact } }) :
            res.status(httpCodes.CREATED).json({ status: 'success', code: httpCodes.CREATED, data: { newContact }, message: Messages.TOO_LITTLE_BALANCE[req.app.get('lang')] })
        ;
    };

    async getTransactions(req, res, next) {
        console.log('req.user.role=', req.user.role);
        const isAdmin = (req.user.role === Role.ADMIN);
        const { id: userId } = req.user; 
        const contacts = await transactionService.list(userId, req.query, isAdmin);
        res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: { ...contacts } });
    };
 };

const transactionControllers = new TransactionControllers;

export default transactionControllers;