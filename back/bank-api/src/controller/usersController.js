const Users = require("../models/usersModel");
const BankAccount = require("../models/bankAccount");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);

  req.body.senha = senhaComHash;

  const newUser = new Users(req.body);
  newUser.save(function (err) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    res.status(201).send(newUser);
  });
};

const getAll = (req, res) => {
  Users.find((err, users) => {
    if (err) {
      res.status(500).json({ message: error.message });
    }
    res.status(200).send(users);
  });
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.findByIdAndDelete(id);
    const message = "User deleted";
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const login = (req, res) => {
  Users.findOne({ email: req.body.email }, (error, users) => {
    if (error) {
      return res.status(500).send({ message: "Server error" });
    }
    if (!users) {
      res.status(404).send("No user with this email was found");
    }
    const senhaValida = bcrypt.compareSync(req.body.senha, users.senha);
   console.log( users.senha)
    if (!senhaValida) {
      return res.status(403).send("Wrong password");
    }
    const token = jwt.sign({ email: req.body.email }, SECRET);
    return res.status(200).send(token);
  });
};




const updateUser = async(req, res) => {
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
      const { nome, email, cpf, endereco, telefone } = req.body;
      const findUser = await Users.findById(id);
      if (findUser == null) {
        return res.status(404).json({ message: "User not found" });
      }

      Users.name = name || Users.npme;
      Users.email = email || Users.email;
      Users.cpf = cpf || Users.cpf;
      Users.endereco = endereco || Users.endereco;
      Users.telefone = telefone || Users.telefone;

      const savedUser = await Users.save();
      res.status(200).json(savedUser);
    });
  } catch (error) {
    return res.status(500).send({ message: error});
  }
}

module.exports = {
  create,
  getAll,
  deleteById,
  login,
  updateUser
};
