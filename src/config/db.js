const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://connectgauravkaushik_db_user:73dYdp9vCbF73KMU@cluster0.hhnkub6.mongodb.net/")
};

module.exports = connectDB;