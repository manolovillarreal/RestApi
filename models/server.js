const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {


    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.paths = {
            auth: '/api/auth',
            users: '/api/usuarios',
        }

        //Conectarme a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();

        //Rutas de la aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }
    middlewares() {

        // CORS
        this.app.use(cors());

        //lectura y el parse del body
        this.app.use(express.json());


        //Directorio publico
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/usuarios'));
        this.app.use('/quiz/question', require('../routes/question'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port);
        })
    }


}

module.exports = Server;