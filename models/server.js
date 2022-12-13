import {router} from '../routes/usuarios.js'
import {router as RouterAuth} from '../routes/auth.js'
import express from 'express';
import cors from 'cors';
import { dbConnection } from '../database/config.js';

class Server{
    constructor(
        
    ){
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios';
        this.autPath = '/api/auth';

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
    }

    routes(){
        this.app.use(this.autPath, RouterAuth);
        this.app.use(this.usuariosPath, router);
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