//* Importacion de dependencias y modulos
const User = require("../models/user"); //? Importacion del modelo usuario
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");

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

//* Nostarr info perfil de usuario concreto
const profile = async (req, res) => {

    // recibir el parametro de id del usuario por la url
    const id = req.params.id;

    // consulta pra sacar datos del usuario
    let userProfile = await User.findById(id).select({ password: 0, role: 0 }).exec();

    if (!userProfile) {
        return res.status(404).send({
            status: "error",
            message: "no existe el usuario o hay un error"
        });
    }

    // devolver el resultado
    // posteriorente enviar informacoion de follows para mostarr en perfil
    return res.status(200).send({
        status: "success",
        user: userProfile
    });

}

//* Mostarr listado completo de usuarios en la red social
const list = (req, res) => {

    // controlar en que pagina estamos
    let page = 1;

    if (req.params.page) {
        page = parseInt(req.params.page);
    }

    // consulta con mongoose paginate
    let itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage).then(async (users) => {
        // Get total users
        const totalUsers = await User.countDocuments({}).exec();
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        if (!users) {
            return res.status(404).send({
                status: "Error",
                message: "No users avaliable...",
                error: error
            });
        }

        // Return response
        return res.status(200).send
            ({
                status: 'Success',
                users,
                page,
                itemsPerPage,
                total: totalUsers,
                pages: totalPages
            });

    }).catch((error) => {
        return res.status(500).send({
            status: "Error",
            error: error,
            message: "Query error..."

        });
    });

}

//* actualizar datos de usuario
const update = async (req, res) => {

    // Recoger info del usuario a actualizar
    const userIdentity = req.user;

    // UserTouPDATE son los que nos envia el cliente y los de arriba los que tenemos
    const userToUpdate = req.body;

    //Eliminar campos sobrantes que no se deban actualizar
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;
    console.log(userToUpdate);

    // Comprobar si el usuario ya existe
    const duplicated_user = await User.find({
        $or: [
            { email: userToUpdate.email },
            { nick: userToUpdate.nick }
        ]
    }).exec()
    let userIsset = false;
    duplicated_user.forEach(user => {
        if (user && user._id != userIdentity.id) userIsset = true;
    });

    if (userIsset) {
        return res.status(200).send({
            status: "success",
            message: "There is already a registered user with that name or email"
        })
    }

    // Si llega la contrasena 
    if (userToUpdate.password) {
        let pwd = await bcrypt.hash(userToUpdate.password, 10)
        userToUpdate.password = pwd;
        // Si me llega la passw cifrarlo    
    }

    // Buscar y actualizar 
    let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true })
    if (!userUpdated) {
        return res.tatus(400).send({
            status: 'error',
            message: 'Update user method has failed',
        })
    }

    return res.status(200).send({
        status: 'success',
        message: 'Update user method',
        user: userUpdated
    })
}

//* Exportar acciones
module.exports = {
    register,
    login,
    testeo,
    profile,
    list,
    update
}