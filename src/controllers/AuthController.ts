import express, { type Request, type Response } from "express";

import { AppDataSource } from "../data-source.js";
import { User } from "../entity/users.js";

import bcrypt from "bcryptjs";
import * as yup from "yup";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { verifyToken } from "../middlewares/authMiddleware.js";

dotenv.config();

const router = express.Router();

// ROTA POST - LOGIN

router.post("/login", async (req: Request, res: Response) => {
  try {
    const schema = yup.object({
      email: yup.string().trim().email().required(),
      password: yup.string().required(),
    });

    const data = await schema.validate(req.body);

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: data.email },
      relations: {
        situation: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos!",
      });
    }

    if (user.situation.nameSituation !== "Ativo") {
      return res.status(403).json({
        message: "Usuário inativo ou pendente. Procure o administrador!",
      });
    }

    const senhaValida = await bcrypt.compare(data.password, user.password);

    if (!senhaValida) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos!",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "Chave JWT não configurada!",
      });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        message: error.errors,
      });
    }

    console.error("Erro no login:", error);

    return res.status(500).json({
      message: "Erro ao realizar login!",
    });
  }
});

// Criar a rota para validar o token
// Endereço a para acessar a API através da aolicação externa com o verbo GET: http://localhost:8080/validate-token
// Enviar o Bearer Token do usuário logado, exmplo: Bearer <colocar o tojen gerado nom jwt?

router.get(
  "/validate-token",
  verifyToken,
  async (req: Request, res: Response) => {
    res.status(200).json({
      message: "Token válido!",
      userId: (req as any).user.id,
    });
  },
);

// ROTA POST - RECUPERAR SENHA
router.post("/recover-password", async (req: Request, res: Response) => {
  try {
    const schema = yup.object({
      urlRecoverPassword: yup
        .string()
        .trim()
        .url("Informe uma URL válida!")
        .required("A URL é obrigatória!"),

      email: yup
        .string()
        .trim()
        .email("E-mail inválido!")
        .required("O e-mail é obrigatório!"),
    });

    const data = await schema.validate(req.body);

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(200).json({
        message:
          "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação.",
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
        message: "As configurações do servidor de e-mail estão incompletas!",
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
        pass: process.env.EMAIL_PASS,
      },
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
                `,
    };

    // Enviar e-mail
    await transporter.sendMail(messageContent);

    // Salvar chave e prazo de validade de 30 minutos
    user.recoverPassword = chaveRecuperacao;

    user.recoverPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await userRepository.save(user);

    return res.status(200).json({
      message: "E-mail enviado! Verifique sua caixa de entrada!",
    });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        message: error.errors,
      });
    }

    console.error("Erro ao recuperar senha:", error);

    return res.status(500).json({
      message: "Erro ao gerar ou enviar o link de recuperação!",
    });
  }
});

// Criar a rota para validar a chave recuperar a senha
// Endereço para acessar a API através da aplicação externa com o verbo POST: htttp://localhost:8080/validate-recover-password
// A aplicação externa deve indicar que está enviando os dados em formato de objeyo: Content-Type: application/json
// Dados em formato de objeto
/*
    {
        "recoverPassword": "chave-recuperar-senha",
        "email": "baiao@BaseAudioContext.com"
    }
    */

// ROTA POST - VALIDAR CHAVE DE RECUPERAÇÃO DE SENHA
router.post(
  "/validate-recover-password",
  async (req: Request, res: Response) => {
    try {
      const schema = yup.object({
        recoverPassword: yup
          .string()
          .trim()
          .required("A chave de recuperação é obrigatória!"),

        email: yup
          .string()
          .trim()
          .email("E-mail inválido!")
          .required("O e-mail é obrigatório!"),
      });

      const data = await schema.validate(req.body);

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({
        where: {
          email: data.email,
          recoverPassword: data.recoverPassword,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "A chave de recuperação é inválida ou já foi utilizada!",
        });
      }

      if (
        !user.recoverPasswordExpiresAt ||
        user.recoverPasswordExpiresAt.getTime() < Date.now()
      ) {
        user.recoverPassword = null;
        user.recoverPasswordExpiresAt = null;

        await userRepository.save(user);

        return res.status(400).json({
          message: "A chave de recuperação expirou! Solicite uma nova.",
        });
      }

      return res.status(200).json({
        message: "A chave de recuperação é válida!",
      });
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({
          message: error.errors,
        });
      }

      console.error("Erro ao validar chave de recuperação:", error);

      return res.status(500).json({
        message: "Erro ao validar a chave de recuperação!",
      });
    }
  },
);

// Criar a rota para atualizar a senha
// Endereço para acessar a API através da aplicação externa com o verbo Post: http://localhost:8080/update-password
// A aplicação externa deve indicar que está enviando os dados em formato objeto: Content-Type: appcation/json
// Dados em formato de obejto
/*
{
    "recoverPassword": "chave-recuperar-senha",
    "email": "baiao@BaseAudioContext.com",
    "password": "12345"
}
*/

// ROTA POST - CADASTRAR NOVA SENHA
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const schema = yup.object({
      email: yup
        .string()
        .trim()
        .email("E-mail inválido!")
        .required("O e-mail é obrigatório!"),

      key: yup
        .string()
        .trim()
        .required("A chave de recuperação é obrigatória!"),

      password: yup
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres!")
        .required("A nova senha é obrigatória!"),
    });

    const data = await schema.validate(req.body);

    const userRepository = AppDataSource.getRepository(User);

    // Localizar usuário pelo e-mail e chave
    const user = await userRepository.findOne({
      where: {
        email: data.email,
        recoverPassword: data.key,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Link de recuperação inválido ou já utilizado!",
      });
    }

    // Verificar se a chave de recuperação expirou
    if (
      !user.recoverPasswordExpiresAt ||
      user.recoverPasswordExpiresAt.getTime() <= Date.now()
    ) {
      user.recoverPassword = null;
      user.recoverPasswordExpiresAt = null;

      await userRepository.save(user);

      return res.status(400).json({
        message: "Link de recuperação expirado! Solicite uma nova recuperação.",
      });
    }

    // Criptografar nova senha
    user.password = await bcrypt.hash(data.password, 10);

    // Invalidar chave após utilização
    user.recoverPassword = null;
    user.recoverPasswordExpiresAt = null;

    await userRepository.save(user);

    return res.status(200).json({
      message: "Senha alterada com sucesso!",
    });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        message: error.errors,
      });
    }

    console.error("Erro ao redefinir senha:", error);

    return res.status(500).json({
      message: "Erro ao alterar a senha!",
    });
  }
});

// EXPORTAR ROTAS
export default router;
