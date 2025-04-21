const mong = require('mongoose');

const connectdb = async () => {
    try {
        await mong.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('database connect');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectdb;