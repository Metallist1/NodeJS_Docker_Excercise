let listener = require('./productListener.js');
let data = require('./productDB.js');

let productData = data.data;

const getAllProducts = function getAllProducts() {
    return productData;
}

const getSingleProduct = function getSingleProduct(id) {
    var productToReturn = productData.findIndex((obj => obj.id == id));
    return productData[productToReturn];
}

const createProduct = function createProduct(product) {
    var productToReturn = null;
    var doesProductExist = productData.findIndex((obj => obj.id == product.id));
    if(doesProductExist == -1){
        productData.push(product);
        productToReturn = product;
    }
    return productToReturn;
}

const editProduct = function editProduct(id, product) {
    var productIndex = productData.findIndex((obj => obj.id == id));

    productData[productIndex].name = product.name;
    productData[productIndex].price = product.price;
    productData[productIndex].itemsInStock = product.itemsInStock;
    productData[productIndex].itemsReserved = product.itemsReserved;
    return productData[productIndex];
}

const deleteProduct = function deleteProduct(id) {
    var productToReturn = null;
    var productIndex = productData.findIndex((obj => obj.id == id));
    if (productIndex != -1) {
        productToReturn = productData.splice(productIndex, 1);
      }
    return productToReturn;
}

exports.getAllProducts = getAllProducts;
exports.getSingleProduct = getSingleProduct;
exports.createProduct = createProduct;
exports.editProduct = editProduct;
exports.deleteProduct = deleteProduct;