// importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

// funcion de autenticacion
exports.auth = (req, res, next) => {

    // comprobar si me llega la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "La peticion no tiene la cabecera de autenticacion"
        })
    }

    // decodificar el token
    let token = req.headers.authorization.replace(/['"]+/g, "");

    try {

        let payload = jwt.decode(token, secret);

        // comprobar la expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                status: "error",
                message: "token expirado"
            })
        }

        // agrgar datos de usuario a la request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "token invalido",
            error
        })
    }

    // pasar a ejecucion de accion
    next();

}