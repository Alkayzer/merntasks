const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticasUsuario = async (req, res) => {
    //revisamos si hay errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer el email y password

    const { email, password } = req.body;

    try {
        //revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({
            email
        });

        if (!usuario) {
            return res.status(400).json({
                msg: "El usuario no existe"
            });
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if (!passCorrecto) {
            return res.status(400).json({
                msg: "El password es incorrecto.    "
            });
        }
        
        //Crear y firmar el JWT
         const payload = {
            usuario: {
                id: usuario.id
            }
        };
        
        //firmar el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 360000 //1 hora
        }, (error, token) => {
            if(error) throw error;

            res.json({
                token
            });  

        });

    } catch (error) {
        console.log(error);
    }
}

//obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password -registro');
        res.json({usuario});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}