const http = require('http');

/*const getProduct = function getProduct(id) {
    var str = null;
    const option = createOption ('' , 'GET', '/product/' + id, 3003);
    const req = https.request(option, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            str = d;
        });
    });

    req.on('error', error => {
        return null;
    });
    req.end();
}*/

const getProduct = function getProduct(id) {
 return new Promise((resolve, reject) => {
    const option = createOption ('' , 'GET', '/product/' + id, 3003, 'product');
    const req = http.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error('statusCode=' + res.statusCode));
        }
        var body = [];
        res.on('data', function(chunk) {
            body.push(chunk);
        });
        res.on('end', function() {
            try {
                body = JSON.parse(Buffer.concat(body).toString());
            } catch(e) {
                reject(e);
            }
            resolve(body);
        });
    });
    req.on('error', (e) => {
      reject(e.message);
    });
    // send the request
   req.end();
}).catch(err => console.log(err));;
}

const getCustomer = function getCustomer(id) {
    return new Promise((resolve, reject) => {
       const option = createOption ('' , 'GET', '/customer/' + id, 3001, 'customer');
       const req = http.request(options, (res) => {
         if (res.statusCode < 200 || res.statusCode >= 300) {
               return reject(new Error('statusCode=' + res.statusCode));
           }
           var body = [];
           res.on('data', function(chunk) {
               body.push(chunk);
           });
           res.on('end', function() {
               try {
                   body = JSON.parse(Buffer.concat(body).toString());
               } catch(e) {
                   reject(e);
               }
               resolve(body);
           });
       });
       req.on('error', (e) => {
         reject(e.message);
       });
       // send the request
      req.end();
   }).catch(err => console.log(err));
}

/*const getCustomer = function getCustomer(id) {
    const option = createOption ('' , 'GET', '/customer/' + id, 3001);
    const req = https.request(option, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            return d;
        });
    });

    req.on('error', error => {
        return null;
    });
    req.end();
}*/

function createOption(data, type, path, port, hostname){
    if(type === 'GET'){
        return options = {
          hostname: hostname,
          port: port,
          path: path,
          method: type,
              headers: {
                'Content-Type': 'application/json'
              }
        }
    }
    
    return options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }
} 

exports.getProduct = getProduct;
exports.getCustomer = getCustomer;

