
import type { Request, Response, NextFunction } from "express";

// Importar a biblioteca JWT
import jwt from "jsonwebtoken";

// Importar variáveis de ambiente
import dotenv from "dotenv";

dotenv.config();

// Criar interface Request para receber o ID do usuário
interface AuthRequest extends Request {
    user?: { id: number };
}

export function verifyToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {

    // Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    // Verificar se o cabeçalho contém um token
    if (!authHeader) {
        res.status(401).json({
            message: "Token inválido ou expirado!",
        });
        return;
    }

    // Separar o token do prefixo Bearer
    const parts = authHeader.split(" ");

    // Verificar se o token foi fornecido corretamente
    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
        res.status(401).json({
            message: "Formato do token inválido! Utilize Bearer TOKEN.",
        });
        return;
    }

    const token = parts[1];

    // Obter a chave secreta das variáveis de ambiente
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({
            message: "Chave secreta JWT não configurada!",
        });
        return;
    }

    try {

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, secret);

        // Verificar se o token possui um ID de usuário válido
        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "number"
        ) {
            res.status(401).json({
                message: "Token inválido ou expirado!",
            });
            return;
        }

        // Atribuir o ID do usuário autenticado à requisição
        // para o uso posterior
        req.user = {
            id: decoded.id
        };

        // Passar o controle para a próxima função na rota
        next();

    } catch (error) {

        res.status(401).json({
            message: "Token inválido ou expirado!",
        });
        return;

    }

}
