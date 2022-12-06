import {router} from '../routes/usuarios.js'
import express from 'express';
import cors from 'cors';

class Server{
    constructor(
        
    ){
        this.app = express()
        this.port = process.env.PORT || 3000
        this.usuariosPath = '/api/usuarios'

        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
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
        this.app.use('/api/usuarios', router);
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
