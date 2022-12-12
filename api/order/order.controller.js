const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const orderService = require('./order.service')

async function getOrders(req, res) {
  console.log('Getting Orders')
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function getOrderById(req, res) {
    try {
      const orderId = req.params.id
      const order = await orderService.getById(orderId)
      res.json(order)
    } catch (err) {
      logger.error('Failed to get order', err)
      res.status(500).send({ err: 'Failed to get order' })
    }
  }


async function deleteOrder(req, res) {
    try {
        const deletedCount = await orderService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove order' })
        }
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}


async function addOrder(req, res) {
    // console.log("order: ", req.body);
    // console.log('req: ', req);
    const {loginToken} = req.cookies
    
    const loggedinUser = authService.validateToken(loginToken)

    try {
        var order = req.body
        order.byUserId = loggedinUser._id
        order = await orderService.add(order)
        
        // prepare the updated order for sending out
        // order.aboutUser = await userService.getById(order.aboutUserId)
        
        // Give the user credit for adding a order
        // var user = await userService.getById(order.byUserId)
        // user.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // order.byUser = loggedinUser

        // User info is saved also in the login-token, update it
  


        // socketService.broadcast({type: 'order-added', data: order, userId: loggedinUser._id})
        // socketService.emitToUser({type: 'order-about-you', data: order, userId: order.aboutUser._id})
        
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(order)

    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}


async function updateOrder(req, res) {


    try {
      const order = req.body
      const updatedOrder = await orderService.update(order)
    //   console.log('order from orderController: ', updatedOrder);
      res.json(updatedOrder)
    } catch (err) {
      logger.error('Failed to update order', err)
      res.status(500).send({ err: 'Failed to update order' })
  
    }
  }

module.exports = {
    getOrders,
    deleteOrder,
    addOrder,
    getOrderById,
    updateOrder
}