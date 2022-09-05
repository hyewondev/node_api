const mongoose = require("mongoose");
require("../config/db.connect")();
const Transaction = require("../models/transaction.model");
const TransactionData = require("./transactions.json");

const drop = () => {
    try {
        mongoose.connection.dropCollection('transactions', (err) => {
            if (err) throw err;
            else {
                console.log("transactions collection dropped");
                add();
            }
        });
    } catch (err) {
        console.log("err: ", err);
    } 
}

const add = () => {
    Transaction.create(TransactionData, function (err, transactions) {
        if (err)
            throw err;
        console.log(transactions + '\n transactions inserted successfully');
        process.exit(1);
    });
}

drop();