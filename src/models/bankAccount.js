const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: ['credit', 'debit'],
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        min: 0,
        required: true,
    }
}, {
    timestamps: true
})

const BankAccount = mongoose.model('BankAccount', bankAccountSchema)