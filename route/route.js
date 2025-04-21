const express = require('express');
const router = express.Router();
const Product = require('../product/product');

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});


router.get('/', async (req, res) => {
    try {
        const filter = {};
        const sort = {};

        // Filtering
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = req.query.minPrice;
            if (req.query.maxPrice) filter.price.$lte = req.query.maxPrice;
        }
        if (req.query.rating) filter.rating = req.query.rating;

        // Sorting
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        } else {
            sort.lastUpdated = -1;
        }

        const products = await Product.find(filter).sort(sort);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        product ? res.json(product) : res.status(404).send('Not found');

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        product ? res.json(product) : res.status(404).send('not found');

    } catch (err) {
        res.status(400).json({error: err.message});
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        result ? res.send('Deletyd') : res.status(404).send('not found');
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;