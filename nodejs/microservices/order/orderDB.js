var datetime = new Date();

var data = [{
    id: 1,
    date: datetime.toISOString().slice(0,10),
    orderLines: [{   
        id: 1,
        orderId: 1,
        productId: 1,
        quantity: 2
    }],
    customerId: 1,
    status: "completed",
    totalPrice: 200.5
}];

exports.data = data; 