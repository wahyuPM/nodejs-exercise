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
    constructor(title, imageUrl, description, price) {
        //this.title mengambil data dari title yang dikirim dari form name="title" pada views/add-product.ejs
        //jika this.title dirubah menjadi this.apapun, maka data yang dikirim dari form name="title" 
        //tidak muncul
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getProductsFromFile(products => { //products hanya nama parameter bisa diubah menjadi apapun
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

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(e => e.id === id);
            cb(product);
        });
    }
}