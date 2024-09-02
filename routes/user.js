//* Importaciones necesarias
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user"); //? Importacion de controlador/es
const check = require("../middlewares/auth");

//* ruta de prueba
router.get("/prueba-usuario", check.auth, UserController.testeo);

//* Deficnicion de rutas
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.get("/list/:page?", check.auth, UserController.list);

//* Exportacion del router para su uso posterior
module.exports = router;