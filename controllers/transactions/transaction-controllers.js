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
    // async getTransactions(req, res, next) {
    //     console.log('req.user.role=', req.user.role);
    //     const isAdmin = (req.user.role === Role.ADMIN);
    //     const { id: userId } = req.user; 
    //     // const contacts = await listContacts(userId, req.query, isAdmin); //old variant
    //     const contacts = await contactService.list(userId, req.query, isAdmin);
    //     res.status(httpCodes.OK).json({ status: 'success', code: httpCodes.OK, data: { ...contacts } });
    // };

    // async getContact(req, res, next) {
    //     const { id } = req.params;
    //     const isAdmin = (req.user.role === Role.ADMIN); 
    //     const { id: userId } = req.user; 
    //     // const contact = await getContactById(userId, id, isAdmin); //old variant
    //     const contact = await contactService.getById(userId, id, isAdmin);
    //     contact ?
    //         res.status(httpCodes.OK).json( {status: 'success', code: httpCodes.OK, data: {contact}} ) : 
    //         res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')]});
    // };

    // async delContact(req, res, next) {
    //     const { id } = req.params;
    //     const isAdmin = (req.user.role === Role.ADMIN);
    //     const { id: userId } = req.user;  
    //     // const deletedContact = await removeContact(userId, id, isAdmin); //old variant
    //     const deletedContact = await contactService.remove(userId, id, isAdmin);
    //     deletedContact ?
    //         res.status(httpCodes.OK).json({status: 'success', code: httpCodes.OK, data: {deletedContact}}) :
    //         res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')] });
    // };

    // async postContact(req, res, next) {
    //     const { id: userId } = req.user; 
    //     // const newContact = await addContact(userId, req.body); //old variant
    //     const newContact = await contactService.add(userId, req.body);
    //     res.status(httpCodes.CREATED).json( {status: 'success', code: httpCodes.CREATED, data: {newContact}} );
    // };
    // async putContact(req, res, next) {
    //     const { id } = req.params;
    //     const isAdmin = (req.user.role === Role.ADMIN); 
    //     const { id: userId } = req.user; 
    //     // const contact = await updateContact(userId, id, req.body, isAdmin); //old variant
    //     const contact = await contactService.update(userId, id, req.body, isAdmin);
    //     contact ?
    //         res.status(httpCodes.OK).json( {status: 'success', code: httpCodes.OK, data: {contact}} ) :
    //         res.status(httpCodes.NOT_FOUND).json({ status: 'error', code: httpCodes.NOT_FOUND, message: Messages.NOT_FOUND[req.app.get('lang')]});
    // };
 };

const transactionControllers = new TransactionControllers;

export default transactionControllers;