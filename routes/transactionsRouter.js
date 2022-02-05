import { validateCreate, validateQuery} from '../middlewares/validation/transactionsValidation';
import transactionControllers from '../controllers/transactions/transaction-controllers';
import guard from '../middlewares/guard';
import {Router} from 'express';
const router = new Router();

router.post('/', [guard, validateCreate], transactionControllers.postTransaction); // to do [guard, validateCreate]

router.get('/', [guard, validateQuery], transactionControllers.getTransactions); // to do [guard, validateQuery]

// router.get('/:id', [guard, validateId], contactControllers.getContact);

// router.post('/', [guard, validateCreate], contactControllers.postContact);

// router.delete('/:id', [guard, validateId], contactControllers.delContact);

// router.put('/:id', [guard, validateId, validateUpdate], contactControllers.putContact);

// router.patch('/:id/favorite', [guard, validateId, validateUpdateFavorite], contactControllers.putContact);

export default router;