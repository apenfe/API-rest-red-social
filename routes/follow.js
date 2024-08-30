//* Importaciones necesarias
const express = require("express");
const router = express.Router();
const FollowController = require("../controllers/follow"); //? Importacion de controlador/es

//* Deficnicion de rutas
router.get("/prueba-follow", FollowController.prueba_follow);

//* Exportacion del router para su uso posterior
module.exports = router;