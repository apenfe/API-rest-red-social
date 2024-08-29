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

//cargar conf de rutas

//TODO Borrar tras hacer la prueba -----------------------------------
// Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
    return res.status(200).json({
        id: 1,
        "nombre": "adrian",
    })
});
//TODO Borrar tras hacer la prueba -----------------------------------

// poner servidor en escucha
app.listen(puerto, () => {
    console.log('\tServidor de Node.js a la escucha en el puerto: ' + puerto);
});