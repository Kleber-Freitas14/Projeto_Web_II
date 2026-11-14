
import express, { type Request, type Response } from "express";

import { AppDataSource } from "../data-source.js";
import { User } from "../entity/users.js";

import bcrypt from "bcryptjs";
import * as yup from "yup";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

// ROTA POST - PRINCIPAL
router.post("/", (req: Request, res: Response) => {
    return res.status(200).send("Bem-Vindo Pessoal alterado");
});

// ROTA POST - LOGIN
router.post("/login", async (req: Request, res: Response) => {
    try {
        const schema = yup.object({
            email: yup.string().trim().email().required(),
            password: yup.string().required()
        });

        const data = await schema.validate(req.body);

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { email: data.email }
        });

        if (!user) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos!"
            });
        }

        const senhaValida = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!senhaValida) {
            return res.status(401).json({
                message: "E-mail ou senha inválidos!"
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message: "Chave JWT não configurada!"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            secret,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            token
        });

    } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                message: error.errors
            });
        }

        console.error("Erro no login:", error);

        return res.status(500).json({
            message: "Erro ao realizar login!"
        });
    }
});

// ROTA POST - RECUPERAR SENHA
router.post("/recover-password", async (req: Request, res: Response) => {
    try {
        const schema = yup.object({
            urlRecoverPassword: yup.string()
                .trim()
                .url("Informe uma URL válida!")
                .required("A URL é obrigatória!"),

            email: yup.string()
                .trim()
                .email("E-mail inválido!")
                .required("O e-mail é obrigatório!")
        });

        const data = await schema.validate(req.body);

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { email: data.email }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        // Verificar configurações do servidor de e-mail

        if (
            !process.env.EMAIL_HOST ||
            !process.env.EMAIL_PORT ||
            !process.env.EMAIL_USER ||
            !process.env.EMAIL_PASS ||
            !process.env.EMAIL_FROM 
        ) {
            return res.status(500).json({
                message: "As configurações do servidor de e-mail estão incompletas!"
            });
        }

        // Gerar chave de recuperação
        const chaveRecuperacao = crypto.randomBytes(32).toString("hex");

        // Criar link de recuperação
        const link = new URL(data.urlRecoverPassword);
        link.searchParams.set("email", data.email);
        link.searchParams.set("key", chaveRecuperacao);

        const linkRecuperacao = link.toString();

        // Configurar servidor de e-mail
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const messageContent = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperação de senha - Baião Software",
            text: `Prezado(a) ${user.name},

Recebemos sua solicitação de recuperação de senha.

Acesse o link abaixo para cadastrar uma nova senha:

${linkRecuperacao}

Atenciosamente,
${process.env.APP || "Baião Software"}`,
            html: `
                <p>Prezado(a) ${user.name},</p>
                <p>Recebemos sua solicitação de recuperação de senha.</p>
                <p>
                    <a href="${linkRecuperacao}">
                        Clique aqui para cadastrar uma nova senha
                    </a>
                </p>
                <p>Atenciosamente,<br>${process.env.APP || "Baião Software"}</p>
            `
        };

        // Enviar e-mail
        await transporter.sendMail(messageContent);

        // Salvar chave somente após o envio do e-mail
        user.recoverPassword = chaveRecuperacao;
        await userRepository.save(user);

        return res.status(200).json({
            message: "E-mail enviado! Verifique sua caixa de entrada!",
            urlRecoverPassword: linkRecuperacao
        });

    } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                message: error.errors
            });
        }

        console.error("Erro ao recuperar senha:", error);

        return res.status(500).json({
            message: "Erro ao gerar ou enviar o link de recuperação!"
        });
    }
});

// ROTA POST - CADASTRAR NOVA SENHA
router.post("/reset-password", async (req: Request, res: Response) => {
    try {
        const schema = yup.object({
            email: yup.string()
                .trim()
                .email("E-mail inválido!")
                .required("O e-mail é obrigatório!"),

            key: yup.string()
                .trim()
                .required("A chave de recuperação é obrigatória!"),

            password: yup.string()
                .min(6, "A senha deve ter pelo menos 6 caracteres!")
                .required("A nova senha é obrigatória!")
        });

        const data = await schema.validate(req.body);

        const userRepository = AppDataSource.getRepository(User);

        // Localizar usuário pelo e-mail e chave
        const user = await userRepository.findOne({
            where: {
                email: data.email,
                recoverPassword: data.key
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Link de recuperação inválido ou já utilizado!"
            });
        }

        // Criptografar nova senha
        user.password = await bcrypt.hash(data.password, 10);

        // Invalidar chave após utilização
        user.recoverPassword = null;

        await userRepository.save(user);

        return res.status(200).json({
            message: "Senha alterada com sucesso!"
        });

    } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                message: error.errors
            });
        }

        console.error("Erro ao redefinir senha:", error);

        return res.status(500).json({
            message: "Erro ao alterar a senha!"
        });
    }
});

// EXPORTAR ROTAS
export default router;
