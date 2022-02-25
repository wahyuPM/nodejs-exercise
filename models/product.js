const fs = require('fs');
const path = require('path');

//variabel p mengambil data dari folder data pada file products.json
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) { //jika terjadi error maka akan menampilkan array kosong
            cb([]); //cb adalah callback, jika menggunakan 'return' maka akan menampilkan undefined karena asyncrhonous
        }
        cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(t) {
        //this.title mengambil data dari title yang dikirim dari form name="title" pada views/add-product.ejs
        //jika this.title dirubah menjadi this.apapun, maka data yang dikirim dari form name="title" 
        //tidak muncul
        this.title = t;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    //static method berfungsi mengambil data dari file products.json tanpa instantiate class Product
    //(tanpa menggunakan keyword new Product())
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}