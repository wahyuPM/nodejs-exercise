const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware cek apakah data user sudah ada atau belum
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user; // mengisi data user ke dalam req.user
            next();
        })
        .catch(err => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
    // .sync({ force: true })
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1)

    }).then(user => {
        //jika user tidak ditemukan, maka akan dibuatkan user baru
        if (!user) {
            return User.create({ name: 'Wahyu', email: 'wahyupratama191@gmail.com' });
        }
        //jika user ditemukan, maka akan dikembalikan
        return user;
    }).then(user => {
        // console.log(user);
        return user.createCart();

    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
