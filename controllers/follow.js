//? acciones de prueba para configuracion inicial de rutas
const prueba_follow = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/follow.js"
    });
}

//* Exportar acciones
module.exports = {
    prueba_follow,
}