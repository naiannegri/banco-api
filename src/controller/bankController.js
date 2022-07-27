const Users = require("../models/usersModel");
const Banks = require("../assets/code_bank.json");
const { restart } = require("nodemon");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

//transactions
const doTransaction = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }
      const { userId, receiverId, amount } = req.body;
      const getCurrentUser = await Users.findById(userId);
      const findReceiver = await Users.findById(receiverId);

      if (Number(getCurrentUser.bankAccount.balance) >= amount) {
        console.log("current user", getCurrentUser);

        findReceiver.bankAccount.balance = Number(Number(
          findReceiver.bankAccount.balance + amount)
        )
          .toFixed(4)
;
        getCurrentUser.bankAccount.balance = Number(Number(
          getCurrentUser.bankAccount.balance - amount)
        )
          .toFixed(4);
        getCurrentUser.transactions.push({
          amount: amount,
          sendTo: receiverId,
          date: new Date(),
          transactionId: Math.random().toString(20).substr(2, 9),
        });
        findReceiver.transactions.push({
          amount: amount,
          from: userId,
          date: new Date(),
          transactionId: Math.random().toString(20).substr(2, 9),
        });
        getCurrentUser.markModified("bankAccount");
        findReceiver.markModified("bankAccount");
        getCurrentUser.markModified("transactions");
        findReceiver.markModified("transactions");
        const savedReceiver = await findReceiver.save();
        const savedSender = await getCurrentUser.save();
        res.status(200).json({ receiver: savedReceiver, user: savedSender });
      } else if (getCurrentUser.bankAccount.balance < amount) {
        res.status(500).json({ message: "amount not available" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }
      const { id } = req.params;
      const getCurrentUser = await Users.findById(id);
      if (getCurrentUser) {
        if (getCurrentUser.transactions) {
          res.status(200).json(getCurrentUser.transactions);
        } else {
          res.status(500).json({ message: "This user has no transactions" });
        }
      } else {
        res.status(500).json({ message: "No user with this ID was found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }

      const { id, idTransaction } = req.params;
      const getCurrentUser = await Users.findById(id);
      if (getCurrentUser) {
        if (getCurrentUser.transactions.length > 1) {
          let getAllTransactions = getCurrentUser.transactions;
          let getTransaction = getAllTransactions.find(
            (transaction) => transaction.transactionId === idTransaction
          );
          console.log("transaction", getTransaction);
          res.status(200).json(getTransaction);
        } else if (getCurrentUser.transactions.length === 1) {
          let getTransaction = getCurrentUser.transactions[0];
          res.status(200).json(getTransaction);
        } else if (getCurrentUser.transactions.length === 0) {
          res.status(500).json({ message: "This user has no transactions" });
        }
      } else {
        res.status(500).json({ message: "No user with this ID was found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFunds = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }
      const { id } = req.params;
      const getCurrentUser = await Users.findById(id);
      if (getCurrentUser) {
        if (getCurrentUser.bankAccount.balance) {
          res.status(200).json({"funds": getCurrentUser.bankAccount.balance});
        } else {
          res.status(500).json({ message: "This user has no balance" });
        }
      } else {
        res.status(500).json({ message: "No user with this ID was found" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const doTransfer = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }

      const { userId,bankCode, cpf, receiverCpf, contact, amount } = req.body;
      const getCurrentUser = await Users.findById(userId);
      if(getCurrentUser){
        const validateBank = Banks.find((bank) => bank.value === bankCode)
        if(validateBank){
          if(Number(getCurrentUser.bankAccount.balance) >= amount){
            getCurrentUser.bankAccount.balance = Number(getCurrentUser.bankAccount.balance) - amount;
            getCurrentUser.transactions.push({
              amount: amount,
              sendTo: bankCode,
              date: new Date(),
              transactionId: Math.random().toString(20).substr(2, 9),
            });
            getCurrentUser.markModified("bankAccount");
            getCurrentUser.markModified("transactions");
            const savedUser = await getCurrentUser.save();
            res.status(200).json({ message: "Transfer made with success!", status: savedUser });
          } else {
            res.status(500).json({ message: "Not enough funds"});
          }
        }else{
          res.status(500).json({ message: "Bank not found"});
        }
      }

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }
      const { id, idTransfer } = req.params;
      const getCurrentUser = await Users.findById(id);
      if (getCurrentUser) {
        if (getCurrentUser.transactions) {
          let getTransactionId =  getCurrentUser.transactions.findIndex(
            (transaction) => transaction.transactionId == idTransfer
          );
          console.log(getTransactionId)
          if(getTransactionId < 0){
            res.status(500).json({ message: "Transaction not found" });
          }
          getCurrentUser.transactions.splice(getTransactionId,1)
          getCurrentUser.markModified("transactions");
          const savedUser = await getCurrentUser.save();
          res.status(200).json({message: 'Transaction was deleted!', status: savedUser});
        } else {
          res.status(500).json({ message: "This user has no transactions" });
        }
      } else {
        res.status(500).json({ message: "No user with this ID was found" });
      }

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const doDeposit = async (req, res) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      return res.status(401).send({ message: "not authorized" });
    }
    const token = authHeader.split(" ")[1];
    await jwt.verify(token, SECRET, async (err) => {
      if (err) {
        return res.status(403).send({ message: err.message });
      }
      const { userId,amount } = req.body;
      const getCurrentUser = await Users.findById(userId);
      if (getCurrentUser) {
        console.log("current user", getCurrentUser);

 
        getCurrentUser.bankAccount.balance = Number(Number(
          getCurrentUser.bankAccount.balance + amount)
        )
          .toFixed(4);


        getCurrentUser.markModified("bankAccount");
        const savedReceiver = await findReceiver.save();
        res.status(200).json({ receiver: savedReceiver });
      } else if (getCurrentUser.bankAccount.balance < amount) {
        res.status(500).json({ message: "User not found" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  doTransaction,
  getAllTransactions,
  getTransactionById,
  getFunds,
  doTransfer,
  deleteTransfer,
  doDeposit
};
