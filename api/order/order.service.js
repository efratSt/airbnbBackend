const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')




async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }

}


async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}



async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: id}, { $set: {...order} })
        console.log('FROM SERVICE',order);
        order._id = id
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}


async function remove(orderId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('order')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(orderId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const {deletedCount} = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}


async function add(order) {
    delete order._id
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        console.log('Order has been added succesfully');
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

function _buildCriteria(filterBy) {

    const criteria = {}
    if (filterBy.hostId) criteria.hostId = filterBy.hostId
    if (filterBy.buyerId) criteria.byUserId = filterBy.buyerId
    // if (filterBy.buyerId) criteria.buyer = {_id: buyerId}
    // if (filterBy.buyerId) criteria.buyerId = {_id: filterBy.buyerId}
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    getById,
    update
}


