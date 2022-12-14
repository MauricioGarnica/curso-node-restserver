import {router} from '../routes/usuarios.js'
import {router as RouterAuth} from '../routes/auth.js'
import {router as RouterCategorias} from '../routes/categorias.js'
import {router as RouterProductos} from '../routes/productos.js'
import {router as RouterBuscar} from '../routes/buscar.js';
import {router as RouterUploads} from '../routes/uploads.js';
import express from 'express';
import cors from 'cors';
import { dbConnection } from '../database/config.js';
import fileUpload from 'express-fileupload';

class Server{
    constructor(
        
    ){
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            auth:'/api/auth',
            categorias: '/api/categorias',
            usuarios:'/api/usuarios',
            productos: '/api/productos',
            buscar: '/api/buscar',
            uploads: '/api/uploads'
        }

        //Conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes(){
        this.app.use(this.paths.auth, RouterAuth);
        this.app.use(this.paths.usuarios, router);
        this.app.use(this.paths.categorias, RouterCategorias);
        this.app.use(this.paths.productos, RouterProductos);
        this.app.use(this.paths.buscar, RouterBuscar);
        this.app.use(this.paths.uploads, RouterUploads);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en: ', this.port);
        });
    }
}

export {
    Server
}