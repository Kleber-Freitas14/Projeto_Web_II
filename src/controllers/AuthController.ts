
// Importar a biblioteca Express
import express, { type Request, type Response } from "express";

// Importar conexão com o banco de dados
import { AppDataSource } from "../data-source.js";

// Importar entidade User
import { User } from "../entity/users.js";

// Importar bibliotecas de autenticação
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Criar a aplicação Express
const router = express.Router();


// ==========================================
// ROTA GET PRINCIPAL
// ==========================================

router.get("/", (req: Request, res: Response) => {
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
        const user = await userRepository.findOne({
            where: { email }
        });

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


// ==========================================
// EXPORTAR ROTAS
// ==========================================

export default router;
