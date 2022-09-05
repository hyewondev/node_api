
module.exports = (app) => {

  const router = require("express").Router();
  const TransactionController = require('../controllers/transaction.controller');

  router.get('/', TransactionController.findTransactions);
  router.get('/:id', TransactionController.findTransaction);
  router.put('/:id', TransactionController.updateTransaction);

  app.use('/api/transactions', router);
  
}