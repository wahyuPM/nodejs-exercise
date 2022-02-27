const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productTitle, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex( // mencari data pada index ke berapa tedapat id ini outputnya adalah index dari id
                e => e.id === id
            );
            const existingProduct = cart.products[existingProductIndex];
            console.log(existingProductIndex, existingProduct);
            let updatedProduct;

            // Add new product/ increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct }; // (...) memasukan data object dari existingProduct ke dalam updatedProduct
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, title: productTitle, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }
}