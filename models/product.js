const products = [];

module.exports = class Product {
    constructor(t) {
        //this.title mengambil data dari title yang dikirim dari form name="title" pada views/add-product.ejs
        //jika this.title dirubah menjadi this.apapun, maka data yang dikirim dari form name="title" 
        //tidak muncul
        this.title = t;
    }

    save() {
        products.push(this);
    }

    static fetchAll() {
        return products;
    }
}