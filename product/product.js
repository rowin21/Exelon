const mong = require('mongoose');

const productSchema = new mong.Schema({
    name: String,
    price: String,
    discription: String,
    rating: String,
    url: String,
    lastupdate: {
        type: Date,
        default: Date.now
    }
});

const Product = mong.model('Product', productSchema);
module.exports = Product;