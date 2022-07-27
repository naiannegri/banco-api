const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
    cpf: {
      type: String,
      required: true,
    },
    endereco: { type: String, required: false},
    telefone: { type: String, required: false},
    bankAccount: {
      type: {},
      required:true,
      ref: 'BankAccount'
  },
  transactions: {type: [{}], required:false}
 },
  {
    versionKey: false,
  }
);

const users = mongoose.model("users", usersSchema);

module.exports = users;
