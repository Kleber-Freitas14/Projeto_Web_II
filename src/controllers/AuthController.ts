
// Importar a biblioteca Express
import express, { type Request, type Response } from "express";

// Importar conexão com o banco de dados
import { AppDataSource } from "../data-source.js";

// Importar entidade User
import { User } from "../entity/users.js";

// Importar bibliotecas de autenticação
import bcrypt from "bcryptjs";

//Importa a biblioteca para validar os dados para cadastrar e editar
import *as yup from 'yup';

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Importar a biblioteca para gerar a chave recuperar senha
import crypto from "crypto";
import { Situation } from "../entity/situations.js";

// Carregar variáveis de ambiente
dotenv.config();

// Criar a aplicação Express
const router = express.Router();


// Criar a rota para realizar o login
// Endereço para acessar a API da aplicação externa com o verbo POST: http://localhost:8080/
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "email": "baiao@baiao.com",
    "password": "12345"
}
*/


// ==========================================
// ROTA GET PRINCIPAL
// ==========================================

router.post("/", async (req: Request, res: Response) => {
    res.send("Bem-Vindo Pessoal alterado");
});


// ==========================================
// ROTA POST - LOGIN
// ==========================================

router.post("/login", async (req: Request, res: Response) => {
    try {

        // Receber e-mail e senha
        const { email, password } = req.body;

        // Validar os campos
        if (!email || !password) {
            return res.status(400).json({
                message: "Informe o e-mail e a senha!"
            });
        }

        // Obter repositório de usuários
        const userRepository = AppDataSource.getRepository(User);

        // Buscar usuário pelo e-mail
        console.log("BANCO CONECTADO:", AppDataSource.options.database);
        console.log("EMAIL PESQUISADO:", data.email);

        const todosUsuarios = await userRepository.find();

        console.log("USUÁRIOS NO TYPEORM:", todosUsuarios);

        const user = await userRepository.findOneBy({
            email: data.email
        });

        console.log("USUÁRIO ENCONTRADO:", user);

        console.log("USUÁRIO ENCONTRADO:", user);

        // Verificar se o usuário existe
        if (!user) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos!"
            });
        }

        // Comparar a senha informada com a senha criptografada
        const senhaValida = await bcrypt.compare(
            password,
            user.password
        );

        if (!senhaValida) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos!"
            });
        }

        // Obter chave secreta do JWT
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message: "Chave JWT não configurada!"
            });
        }

        // Gerar token de autenticação
        const token = jwt.sign(
            { id: user.id },
            secret,
            { expiresIn: "1d" }
        );

        // Retornar resposta com o token
        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token
        });

    } catch (error) {

        console.error("Erro no login:", error);

        return res.status(500).json({
            message: "Erro ao realizar login!"
        });
    }
});

// Criar a rota para recupeara a senha
// Endereço para cessar a PAI através da aplicação externa com o verbo POST:localhost:8080/recover-password
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-type: application/lson
// Dados em formato de obejto
/*

{
    "urlRecoverPassword": "http://localhost",
    "email": "baiao@BaseAudioContext.com.br"
}

*/
router.post("/recover-password", async (req: Request, res: Response ) =>{

    console.log("========== RECUPERAR SENHA ==========");
    console.log("URL:", req.originalUrl);
    console.log("BODY:", req.body);
    console.log("EMAIL:", req.body?.email);
    console.log("=====================================");
    try{
        // Receber os dados enviados no corpo da requisição
        const data = req.body;

        console.log("DADOS RECEBIDOS:", data);

        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().trim().required("A URL é obrigatório!"),
            email: yup.string().email("email Inválido!").required("O campo e-mail é obrigatório!"),
        });

        // verificar se os dados passaram pela validação
        await schema.validate(data, {abortEarly: false});
        console.log("VALIDAÇÃO APROVADA:", data);

         //Criar uma instância do repositório de user
        const userRepository = AppDataSource.getRepository(User);

         //Recuparar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({email: data.email});

        //Verificar se já existe um usuário com o memso e-mail
        if(!user){
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }

        // Gerar um token seguro de 64 caracteres
        user.recoverPassword = crypto.randomBytes(32).toString("hex");

        // Salvar as alterações no BD
        await userRepository.save(user);    
        
        // Retornar resposta de sucesso
        return res.status(200).json({
            message: "Gerado o link para recuperar a senha!",
            urlRecoverPassword:`${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
            key: user.recoverPassword, 

            
        });


    }catch(error: any){
        //Retorna erro em caso de falha
        if(error instanceof yup.ValidationError){
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        res.status(500).json({
            message: "erro ao editar a senha do usuário!",
        });
        return;
}

});

// EXPORTAR ROTAS


export default router;
