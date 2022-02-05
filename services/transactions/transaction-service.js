import Transaction from '../../models/transaction';

import User from '../../models/user';
import userService from '../../services/users/user-service';

class TransactionService {

    async add(userId, body) { 
        const user = await User.findById(userId);
        const currentBalance = user.balance;
        if (!body.income && Number(body.sum) > Number(currentBalance)) {
            return 
        };
        
        let newBalance = null;
        body.income ?
            newBalance = Number(currentBalance) + Number(body.sum) :
            newBalance = Number(currentBalance) - Number(body.sum);
        
        await userService.updateBalance(userId, newBalance);
        const result = await Transaction.create({...body, owner: userId}); 
        return result;
    };

     async list(userId, {sortBy, sortByDesc,  page = 1, filter, limit = 120, favorite}, isAdmin) {
        let sortCriteria = null;
        let total = await Transaction.find({ owner: userId }).countDocuments();
        isAdmin && (total = await Transaction.find().countDocuments());
        let result = null;
        isAdmin ?
            result = Transaction.find().populate({ path: 'owner', select: 'name email  role subscription' }) :
            result = Transaction.find({ owner: userId }).populate({ path: 'owner', select: 'name email  role subscription' }); 

        sortBy && (sortCriteria = { [`${sortBy}`]: 1 }); 
        sortByDesc && (sortCriteria = { [`${sortByDesc}`]: -1 }); 
        filter && (result = result.select(filter.split('|').join(' ')));
        (page < 0) && (page = 1); 
        ((Number(page) - 1) * Number(limit) > total) && ( page = Math.ceil(total / Number(limit)));

        result = await result.skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).sort(sortCriteria); 

        (favorite === 'false') && (result = result.filter(item => item.favorite === false));
        (favorite === 'true') && (result = result.filter(item => item.favorite === true));
        return {total, page, transaction: result}; 
    };
};
 
const transactionService = new TransactionService;

export default transactionService;
