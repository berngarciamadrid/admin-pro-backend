const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
require('dotenv').config();

// Recordar que en Network Access
// hay que incluir tu IP Address actual
// en Mongos Atlas

const dbConnection = async() => {
    try {
        // await mongoose.connect('mongodb://127.0.0.1:27017/test')
        await mongoose.connect(process.env.DB_CNN, {

        });
        console.log('DB online');
    }catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
                    
}

module.exports = {
    dbConnection
}