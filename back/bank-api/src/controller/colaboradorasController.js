const Colaboradoras = require("../models/colaboradorasModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);

  req.body.senha = senhaComHash;

  const colaboradora = new Colaboradoras(req.body);
  colaboradora.save(function (err) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    console.log(colaboradora);
    res.status(201).send(colaboradora);
  });
};

const getAll = (req, res) => {
  Colaboradoras.find((err, colaboradoras) => {
    if (err) {
      res.status(500).json({ message: error.message });
    }
    res.status(200).send(colaboradoras);
  });
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    await Colaboradoras.findByIdAndDelete(id);
    const message = "A colaboradora com ID foi deletada";
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const login = (req, res) => {
  Colaboradoras.findOne({ email: req.body.email }, (error, colaboradora) => {
    if (error) {
      return res.status(500).send({ message: "deu ruim" });
    }
    if (!colaboradora) {
      res.status(404).send("Não existe colaboradora com esse email");
    }
    const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);
   console.log( colaboradora.senha)
    if (!senhaValida) {
      return res.status(403).send("senha errada");
    }
    const token = jwt.sign({ email: req.body.email }, SECRET);
    return res.status(200).send(token);
  });
};

module.exports = {
  create,
  getAll,
  deleteById,
  login,
};
