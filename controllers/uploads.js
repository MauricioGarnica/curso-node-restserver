
import { response } from "express";
import fs from 'fs';
import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from '../models/index.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cloudinary_ = cloudinary.v2;

cloudinary_.config({
    cloud_name: 'dkketqxwg',
    api_key: '997898312581528',
    api_secret: 'ws7YbRFXO__bVVMWjyZHuYw3cpQ'
});

const cargarArchivo = async (req, res = response) => {
    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({ nombre });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            //hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {

    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
};

const actualizarImagenCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.');
            cloudinary_.uploader.destroy(public_id);
        }
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary_.uploader.upload(tempFilePath);

        modelo.img = secure_url;
        await modelo.save();

        res.json(modelo);
    } catch (error) {
        return res.json(error);
    }

};

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    //Limpiar imagenes previas
    try {
        if (modelo.img) {
            //hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }
    } catch (error) {

    }

    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathNoImage);
};

export {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}