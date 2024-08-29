const mongoose = require("mongoose");

const connection = async () => {

    console.log("Estableciendo conexión con la BBDD...");

    try {

        const server = "mongodb://";
        const port = "27017/";
        const ip = "localhost:";
        const bbdd = "red-social";

        await mongoose.connect(server + ip + port + bbdd);
        console.log("\tConexion exitosa a la BBDD: " + bbdd + " en -> " + server + ip + port + bbdd);

    } catch (error) {

        console.log(error);
        throw new Error("\tNo se ha podidodo conectar a la BBDD.");

    }

}

module.exports = connection;

