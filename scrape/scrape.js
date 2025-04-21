
const puppeteer = require('puppeteer');
const Product = require('../product/product');

const scrape = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();
    await page.goto('https://webscraper.io/test-sites/e-commerce/static/computers/laptops');

    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.thumbnail')); 
        return items.map(item => ({
            name: item.querySelector('.title')?.innerText || 'no name',
            price: item.querySelector('.price')?.innerText || 'no price',
            description: item.querySelector('.description')?.innerText || 'no desc',
            ratings: item.querySelectorAll('.ratings .glyphicon-star').length.toString(), // Corrected 'glphicon-start' to 'glyphicon-star'
        }));
    });

    for (const product of products) {
        
        await Product.updateOne(
            { name: product.name },
            { $set: { ...product, lastUpdated: new Date() } }, 
            { upsert: true } 
        );
    }
    console.log('Scrape done');
    await browser.close();
};

module.exports = scrape;
