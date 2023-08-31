const mongoose = require("mongoose");


const connectionDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database Connected: ", connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit();
    }
}

module.exports = connectionDB
