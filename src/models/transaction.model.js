const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true, index: true},
    date: { type: Date, required: true },
    sender: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }, 
        dateOfBirth: { type: Date, required: true }, 
        IDNumber: { type: String, required: true }
    },
    recipient: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }, 
        email: { type: String, required: true }, 
        accountNumber: { type: String, required: true }, 
        bank: { type: String, required: true }
    },
    Amount: { type: Number },
    CurrencyCd: { type: String, required: true }, 
    Comments: { type: String },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Transaction', TransactionSchema);