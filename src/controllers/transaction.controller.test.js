jest.mock('../models/transaction.model');
const { findTransactions, findTransaction, updateTransaction } = require('./transaction.controller');
const Transaction = require('../models/transaction.model');
const transactionsData = require('../mock-data/transactionList.json');

describe('findTransactions', () => {
    const next = jest.fn();

    test('should retrieve one transactions data with start date and end date', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        const req = {
            query: {
                sdate: '01/12/2021',
                edate: '31/12/2021'
            }
        };
        const tData = transactionsData; 
        const data = { sort: jest.fn(() => Promise.resolve(tData)) };
        
        Transaction.find.mockReturnValue({ select: () => data })

        await findTransactions(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(tData);
    });

    test('should throw 400 error if date data is empty string', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        const req = {
            query: {
                sdate: '',
                edate: ''
            }
        };
        await findTransactions(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith({message: "Values of start and end date are required."});
    });

    test('should return next(error) if error occured', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };
        const req = {
            query: {
                sdate: '01/12/2021',
                edate: '31/12/2021'
            }
        };
        const error = 'Cannot find the transaction data';
        const data = { sort: jest.fn(() => Promise.reject(error)) };
        Transaction.find.mockReturnValue({ select : () => data });
        await findTransactions(req, res, next);
        expect(next).toBeCalledWith(error);
    });
})

describe('findTransaction', () => {
    const next = jest.fn();

    test('should retrieve one transaction by id and send response correctly', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        const req = {
            params: { id: 1 }
        };
        
        const data = transactionsData[0]; 
        const tData = { select: jest.fn(() => Promise.resolve(data)) }; 

        Transaction.findOne.mockReturnValue(tData);
        await findTransaction(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(data);
    });

    test('should retrieve no transaction data by wrong id', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        const req = {
            params: { id: 100 }
        };

        Transaction.findOne.mockReturnValue({ select: jest.fn(() => Promise.resolve(null) ) });
        await findTransaction(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith({ message: "Not found data with id "+ req.params.id });
    });

    test('should return next(error) if error occured', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        }; 

        const req = {
            params : { id: 1 }
        }
        const error = 'Cannot find the transaction data';
        Transaction.findOne.mockReturnValue({ select : () => Promise.reject(error)});
        await findTransaction(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});


describe('updateTransaction', () => {
    const next = jest.fn();

    test('should update one transaction by id and send response sucess message', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        };

        const req = {
            params: { id: 1 },
            body: { status: 'IN PROGRESS' }
        };
        
        Transaction.findOneAndUpdate.mockReturnValue(Promise.resolve(transactionsData[0]));

        await updateTransaction(req, res, next);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ message: "Data was updated successfully." });
    });

    test('should no transaction data to be updated by wrong id', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        }; 

        const req = {
            params: { id: 100 },
            body: { status: 'IN PROGRESS' }
        };
        
        Transaction.findOneAndUpdate.mockReturnValue(Promise.resolve(null));

        await updateTransaction(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith({ message: `Cannot update data with id=${req.params.id}, Maybe data was not found!` });
    });

    test('should throw 400 error if date data is empty string', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        }; 

        const req = {
            params: { id: 1 },
            body: {}
        };

        await updateTransaction(req, res, next);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith({ message: "Data to update cannot be empty!" });
    });

    test('should return next(error) if error occured', async () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res)
        }; 
        const req = {
            params : { id: 1 },
            body: { status: 'IN PROGRESS' }
        }
        const error = 'Cannot find the transaction data to be updated';
        Transaction.findOneAndUpdate.mockReturnValue(Promise.reject(error));
        await updateTransaction(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});