//* Importacion de dependencias y modulos
const User = require("../models/user"); //? Importacion del modelo usuario
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");

//* funcion de testeo
const testeo = async (req, res) => {

    return res.status(200).json({
        status: "mensaje prueba",
        message: "probando",
        usuario: req.user
    });

}

//* Registro de usuarios
const register = async (req, res) => {

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

    //* control de usuarios duplicados
    let consulta = await User.find({
        $or: [
            { email: params.email.toLowerCase() },
            { nick: params.nick.toLowerCase() },
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
    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    //* crear objeto de usuario
    let user_to_save = new User(params);

    //* guardar usuario en la base de datos
    user_to_save.save()
        .then(userStored => {

            if (userStored) {

                //* devolver resultado
                return res.status(200).json({
                    message: "registro de usuarios",
                    user_to_save
                });

            }

        })
        .catch(error => {
            return res.status(500).send({ status: "error", "message": "error al guardar" });
        })

}

//* Logueo de usuarios al sistema
const login = async (req, res) => {

    // recoger parametros del body
    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "faltan datos por enviar"
        })
    }

    // buscar en la bbdd si existe usuario
    let user = await User.findOne({ email: params.email })//.select({ password: 0 })

    if (!user) {
        return res.status(400).send({
            status: "error",
            message: "no existe el usuario"
        })
    } else {

        // comprobar su contrasña
        let pwd = bcrypt.compareSync(params.password, user.password);

        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "contraseña y/o usuario incorrectos"
            })
        }

        // conseguir el token
        const token = jwt.createToken(user);

        // datos del usuario

        return res.status(200).send({
            status: "success",
            message: "accion de login finalizada",
            user: {
                name: user.name,
                nick: user.nick,
                id: user._id
            },
            token
        })

    }

}

//* Exportar acciones
module.exports = {
    register,
    login,
    testeo
}