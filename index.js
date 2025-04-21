require('dotenv').config();
const express = require('express');
const mongo = require('mongoose');
const scproducts = require('./scrape/scrape');
const productroutes = require('./route/route');

const app = express();

app.use(express.json());
app.use('/api/products', productroutes);

mongo.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('database connected');

    scproducts();

    setInterval(scproducts, 60 * 60 * 1000);

    app.get('/scrape', async(req, res) => {
        try {
            const scrapedProducts = await scproducts();
            res.status(200).json(scrapedProducts);
            
        } catch (err) {
            res.status(500).json({error: err.message})
        }
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server runing on port ${process.env.PORT}`);

    });
}).catch(err => {
    console.error('not connected database',err);
});