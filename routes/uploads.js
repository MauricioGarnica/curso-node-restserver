import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db-validators.js';
import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

export {
    router
}