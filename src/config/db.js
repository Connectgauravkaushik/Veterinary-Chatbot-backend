const mongoose = require("mongoose");

const connectDB = async () => {
<<<<<<< HEAD
    await mongoose.connect(process.env.MONGO_URI);
 
};
=======
    await mongoose.connect(process.env.MONOGO_URI)
>>>>>>> 78ba8cc59c5a15040807b43239e8707e056e34a2

module.exports = connectDB;
