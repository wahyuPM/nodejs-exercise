const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//:productId adalah parameter yang dikirim dari url
// url dengan parameter harus berada dibawah url yang lebih sepsifik (contoh: /products/:productId harus berada dibawah url /products/delete)
router.get('/products/:productId', shopController.getProductByid);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
