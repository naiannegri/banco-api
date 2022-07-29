
const controller = require('../controller/bankController')
const express = require('express')

const router = express.Router()

router.post("/transactions", controller.doTransaction)
router.get("/transactions/:id", controller.getAllTransactions)
router.get("/transactions/:id/:idTransaction", controller.getTransactionById)
router.get("/:id/funds", controller.getFunds)
router.post("/transfer", controller.doTransfer)
router.delete("/transfer/:id/:idTransfer", controller.deleteTransfer)
router.update("/deposit/:id", controller.doDeposit)


module.exports = router