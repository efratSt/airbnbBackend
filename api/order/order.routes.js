const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addOrder, getOrders, getOrderById, deleteOrder, updateOrder} = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOrders)

router.get('/:id', getOrderById)
router.put('/:id', updateOrder)
router.post('/',  addOrder)
router.delete('/:id', deleteOrder)
// router.get('/', log, getOrders)
// router.post('/',  log, requireAuth, addOrder)
// router.delete('/:id',  requireAuth, deleteOrder)

module.exports = router