const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart() // getCart() adalah method dari asosiasi model user & cart. mengambil data cart berdasarkan user
    .then(cart => {
      return cart.getProducts() // getProducts() adalah method dari asosiasi model product & cart. mengambil data product berdasarkan cart (tabel cartitems)
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
          // console.log(products);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user.getCart() //
    .then(cart => {
      fetchedCart = cart;
      // console.log(cart);
      return cart.getProducts({ where: { id: prodId } }) // cek apakah product sudah ada di cart
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0]; // jika product sudah ada di cart, maka ambil product tersebut
      }
      let newQuantity = 1;
      if (product) { // jika product sudah ada di cart, maka tambahkan quantity
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
      // jika product belum ada di cart, maka tambahkan product baru ke cart
      return Product.findByPk(prodId) // mengambil data product berdasarkan id pada tabel product
        .then(product => {
          return fetchedCart.addProduct(product, { // menambahkan product baru ke cart
            through: {
              quantity: newQuantity // menambahkan quantity default 1
            }
          });
        })
        .catch(err => console.log(err));
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart() // getCart() adalah method dari asosiasi model user & cart. mengambil data cart berdasarkan user
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } }) // getProducts() adalah method dari asosiasi model product & cart. mengambil data product berdasarkan cart (tabel cartitems)
        .then(products => {
          const product = products[0];
          product.cartItem.destroy(); // hapus product dari tabel cartitems
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
