let listener = require('./customerListener.js');
let data = require('./customerDB.js');

let customerData = data.data;

const getSingleCustomer = function getSingleCustomer(id) {
    var customerToReturn = customerData.findIndex((obj => obj.id == id));
    return customerData[customerToReturn];
}

const createCustomer = function createCustomer(customer) {
    var customerToReturn = null;
    var doesCustomerExist = customerData.findIndex((obj => obj.id == customer.id));
    if(doesCustomerExist == -1){
        customerData.push(customer);
        customerToReturn = customer;
    }
    return customerToReturn;
}

const editCustomer = function editCustomer(id, customer) {
    var customerIndex = customerData.findIndex((obj => obj.id == id));
    customerData[customerIndex].name = customer.name;
    customerData[customerIndex].email = customer.email;
    customerData[customerIndex].phone = customer.phone;
    customerData[customerIndex].shippingAddress = customer.shippingAddress;
    customerData[customerIndex].billingAddress = customer.billingAddress;
    customerData[customerIndex].creditStanding = customer.creditStanding;
    return customerData[customerIndex];
}

const deleteCustomer = function deleteCustomer(id) {
    var customerToReturn = null;
    var customerIndex = customerData.findIndex((obj => obj.id == id));
    if (customerIndex != -1) {
        customerToReturn = customerData.splice(customerIndex, 1);
      }
    return customerToReturn;
}

exports.getSingleCustomer = getSingleCustomer;
exports.createCustomer = createCustomer;
exports.editCustomer = editCustomer;
exports.deleteCustomer = deleteCustomer;