
import type { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/users.js";

export async function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const usuarioAutenticado = (req as any).user;

    if (!usuarioAutenticado || !Number.isInteger(usuarioAutenticado.id)) {
      return res.status(401).json({
        message: "Usuário não autenticado!",
      });
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: usuarioAutenticado.id },
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado!",
      });
    }

    if (user.tipoUsuario !== "ADMIN") {
      return res.status(403).json({
        message: "Acesso permitido somente para administradores!",
      });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar administrador:", error);

    return res.status(500).json({
      message: "Erro ao verificar permissões!",
    });
  }
}
