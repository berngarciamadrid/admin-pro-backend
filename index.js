require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Crear el servidor de express

const app = express();

// Configurar CORS
app.use(cors());

// Lectura y Parser del body
app.use(express.json());

// Base de datos
dbConnection();

//Vt9cqkFf6SI5FT45
// mean_user_angular_curso

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));



app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto', process.env.PORT);
})
