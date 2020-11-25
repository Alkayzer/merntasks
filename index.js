const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

//crear el servidor
const app = express();

//conectar a la db
conectarDB();

//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended:true}));

//importar rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

//arrancar la app
app.listen( process.env.PORT || 4000, '0.0.0.0', () => {
    console.log(`El server esta corriendo correctamente en el puerto ${port}`);
});