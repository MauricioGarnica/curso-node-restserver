import { response } from 'express'
import Usuario from '../models/usuario.js'
import bcrypt from 'bcryptjs'

const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const { total, usuarios } = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).limit(Number(limite)).skip(Number(desde))
    ]);

    res.json({ total, usuarios });
};
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar el password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar en la BD
    await usuario.save();

    res.json(usuario);
};
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
};
const usuariosPatch = (req, res = response) => {
    res.json({
        "msg": 'patch API - controlador'
    });
};
const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    //Fisicamente se borra el documento
    // const usuario = await Usuario.findByIdAndDelete(id)

    //Se elimina de forma logica
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json(usuario)
};



export {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}