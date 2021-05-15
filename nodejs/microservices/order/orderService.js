let listener = require('./orderListener.js');
let data = require('./orderDB.js');

let serviceGateway = require('./serviceGateway.js');

let orderData = data.data;
var datetime = new Date();

const getAllOrders = function getAllOrders() {
    return orderData;
}

const getSingleOrder = function getSingleOrder(id) {
    var orderToReturn = orderData.findIndex((obj => obj.id == id));
    return orderData[orderToReturn];
}

const getCustomerOrder = function getCustomerOrder(customerId) {
    var orderToReturn = orderData.findIndex((obj => obj.customerId == customerId));
    return orderData[orderToReturn];
}

const createOrder = async function createOrder(order) {
    var orderToReturn = null;
    let newOrd = await productItemsAvailable(order);
    if (newOrd != null)
    {
            if (isCustomerOkay(order))
            {
                var doesOrderExist = orderData.findIndex((obj => obj.id == newOrd.id));
                if(doesOrderExist == -1){
                    newOrd.date = datetime.toISOString().slice(0,10);
                    orderData.push(newOrd);
                    orderToReturn = newOrd;
                }
            }else{
                orderToReturn = 'Error. Customer order';
            }
    }else{
        orderToReturn = 'Error. Bad order';
    }
    return orderToReturn;
}
const editOrder = function editOrder(id, order) {
    var orderIndex = orderData.findIndex((obj => obj.id == id));

    orderData[orderIndex].date = order.date;
    orderData[orderIndex].orderLines = order.orderLines;
    orderData[orderIndex].customerId = order.customerId;
    orderData[orderIndex].status = order.status;
    orderData[orderIndex].totalPrice = order.totalPrice;
    return orderData[orderIndex];
}

const deleteOrder = function deleteOrder(id) {
    var orderToReturn = null;
    var orderIndex = orderData.findIndex((obj => obj.id == id));
    if (orderIndex != -1) {
        orderToReturn = orderData.splice(orderIndex, 1);
      }
    return orderToReturn;
}


async function productItemsAvailable(order) {
    var totalPrice = 0;
    var orderToPush = order;
    for (i = 0; i < order.orderLines.length; i++) {
        let orderLine = order.orderLines[i];
        console.log(orderLine);
        await serviceGateway.getProduct(orderLine.productId).then((orderedProduct) => {
            totalPrice += orderedProduct.price;
            if (orderLine.quantity > orderedProduct.itemsInStock - orderedProduct.itemsReserved)
            {
                orderToPush =  null;
            }
        });
    }
    if(orderToPush != null){
        orderToPush.totalPrice = totalPrice;
    }
    console.log( orderToPush);
    return orderToPush;
}

async function isCustomerOkay(order) {
    var orderCustomer =  await serviceGateway.getCustomer(order.customerId);
    console.log( orderCustomer);
    // Call product service to get the product ordered.
    if (orderCustomer.creditStanding <= 0 )
    {
        console.log( orderCustomer.creditStanding);
      return false;
    }
    return true;
}

exports.getAllOrders = getAllOrders;
exports.getSingleOrder = getSingleOrder;
exports.getCustomerOrder = getCustomerOrder;
exports.createOrder = createOrder;
exports.editOrder = editOrder;
exports.deleteOrder = deleteOrder;