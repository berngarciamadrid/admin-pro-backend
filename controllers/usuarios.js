const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res)=> {

    const usuarios = await Usuario.find({}, 'nombre email role');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    })
}

const crearUsuario = async(req, res = response)=> {

    const { nombre, email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({email});

        if ( existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
                
        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);
        console.log(usuario.password);
        console.log(email);


        // Prueba con
        // "nombre": "Alberto",
        // "email": "albertoppppp@gmail.com",
        // "password": 436357647568578
        // 436357647568578

        
        // Guardar usuario
        await usuario.save();
        
        // Generar el TOKEN -JWT
        const token = await generarJWT( usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs'
        })
    }

}

const actualizarUsuario = async(req, res=response) => {
    // TODO : Validar token y comprobar si el usuario es correcto

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos} = req.body;

        if (usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({email});
            if( existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true});
        res.json({
            ok: true,
            uid
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async(req, res=response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );
        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha borrado'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}