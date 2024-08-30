//* Importaciones necesarias
const express = require("express");
const router = express.Router();
const PublicationController = require("../controllers/publication"); //? Importacion de controlador/es

//* Deficnicion de rutas
router.get("/prueba-publication", PublicationController.prueba_publication);

//* Exportacion del router para su uso posterior
module.exports = router;