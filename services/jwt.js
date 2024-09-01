//importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

//clave secreta
const secret = "CLAVE_SECRETA_DEL_CURSO_DE_LA_RED_SOCIAL_987987";

// crear funcion para generar tokebs
const createToken = (user) => {

    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        imagen: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }

    //devolver jwt token codificado
    return jwt.encode(payload, secret);

}

module.exports = {
    secret,
    createToken
}
