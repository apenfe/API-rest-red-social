// IMPORTACION DE DEPENDENCIAS
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

// conexion a bbdd
connection();

// crear servidor node
const app = express();
const puerto = 3900;    //? Cambiar por puerto necesario

// configurar cors
app.use(cors());

// convertir datos body a objetos js
app.use(express.json());    //* Todo lo que se recibe como body se transforma a json
app.use(express.urlencoded({ extended: true }));    //* Todo lo que se recibe como form normal lo codifica a json

//cargar configuracion de rutas
//* Importacion de las diferentes rutas existentes
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

//* Carga de las rutas en la app
const prefix = "/api";
app.use(prefix + "/user", UserRoutes);
app.use(prefix + "/publication", PublicationRoutes);
app.use(prefix + "/follow", FollowRoutes);

// poner servidor en escucha
app.listen(puerto, () => {
    console.log('\tServidor de Node.js a la escucha en el puerto: ' + puerto);
});