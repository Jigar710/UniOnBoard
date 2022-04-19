const mongoose = require("mongoose");

const connectWithDB = () => {

    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ignoreUndefined: true
    })
        .then(console.log('DATABASE CONNECTED SUCCESSFULLY'))
        .catch(error => {
            console.log('ISSUE ENCOUNTERED IN DATABASE CONNECTION');
            console.log(error);
            process.exit(1)

        })

};

module.exports = connectWithDB;