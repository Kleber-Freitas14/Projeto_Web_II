// Importar a biblioteca Express

import express from "express";


// Criar a aplicação Express
const app = express()

//Incluir os Controllers

import login from"./controllers/login.js";

//Criar as rota
app.use('/', login)



// Iniciar o servidor na porta 8080
app.listen(8080, ()=>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});