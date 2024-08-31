//* Importaciones necesarias
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user"); //? Importacion de controlador/es

//* Deficnicion de rutas
router.post("/register", UserController.register);
router.post("/login", UserController.login);

//* Exportacion del router para su uso posterior
module.exports = router;