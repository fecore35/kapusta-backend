import transactionService from '../../services/transactions/transaction-service';
import { httpCodes, Role, Messages } from '../../lib/constants';

class TransactionControllers {
    async postTransaction(req, res, next) {
        const { id: userId } = req.user; 
        if (req.body.sum < 0) {
            return res.status(httpCodes.OK).json({ message: 'Sum value must be positive'})
        };
        const newTransaction = await transactionService.add(userId, req.body);
        newTransaction ?
            res.status(httpCodes.CREATED).json({ status: 'success', code: httpCodes.CREATED, data: { newTransaction } }) :
            res.status(httpCodes.CREATED).json({ status: 'success', code: httpCodes.CREATED, data: { newTransaction }, message: Messages.TOO_LITTLE_BALANCE[req.app.get('lang')] })
        ;
    };

    async getTransactions(req, res, next) {
        const isAdmin = (req.user.role === Role.ADMIN);
        const { id: userId } = req.user; 
        const contacts = await transactionService.list(userId, req.query, isAdmin);
        res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: { ...contacts } });
    };

    async delTransaction(req, res, next) {
        const { id } = req.params;
        const { id: userId } = req.user;  
        const deletedContact = await transactionService.remove(userId, id);
        deletedContact ?
            res.status(httpCodes.OK).json({status: 'success', code: httpCodes.OK, data: {deletedContact}}) :
            res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')] });
    };
 };

const transactionControllers = new TransactionControllers;

export default transactionControllers;