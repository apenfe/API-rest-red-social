//* Importacion de dependencias y modulos
const User = require("../models/user"); //? Importacion del modelo usuario

//* Registro de usuarios
const register = (req, res) => {

    //* recoger datos de la peticion
    let params = req.body;

    //* comprobar que llegan bien
    if (!params.name || !params.email || !params.password || !params.nick) {

        console.log('Validacion minima de nuevo usuario: FAIL');

        return res.status(400).json({
            status: "error",
            message: "registro de usuario FALLIDO: Faltan datos",
        });

    }

    //todo validacion 

    //* crear objeto de usuario
    let user_to_save = new User(params);

    //* control de usuarios duplicados
    let consulta = User.find({
        $or: [
            { email: user_to_save.email.toLowerCase() },
            { nick: user_to_save.nick.toLowerCase() },
        ]
    })

    if (consulta) {

        if (consulta.length >= 1) {
            return res.status(400).json({
                status: "error",
                menssage: "ya existe un usuario con esos datos"
            });
        }

    } else {
        return res.status(500).json({
            status: "error",
            menssage: "error al acceder a base de datos"
        });
    }

    //* cifrar la contraseña

    //* guardar usuario en la base de datos

    //* devolver resultado

    return res.status(200).json({
        message: "registro de usuarios",
        user_to_save
    });
}

//* Exportar acciones
module.exports = {
    register
}