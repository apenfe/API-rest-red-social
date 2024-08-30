//? acciones de prueba para configuracion inicial de rutas
const prueba_publication = (req, res) => {
    return res.status(200).send({
        message: "mensaje enviado desde: controllers/publication.js"
    });
}

//* Exportar acciones
module.exports = {
    prueba_publication,
}