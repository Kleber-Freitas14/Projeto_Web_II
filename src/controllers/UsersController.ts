import express, { type Request, type Response } from "express";
import { AppDataSource } from "../data-source.js";
import { User } from "../entity/users.js";
import { PaginationService } from "../services/PaginationService.js";
import { Situation } from "../entity/situations.js";

const router = express.Router();

router.get("/Users", async (req: Request, res: Response) => {
    try {
        const userRepository =
            AppDataSource.getRepository(User);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(
            userRepository,
            page,
            limit,
            { id: "DESC" }
        );

        res.status(200).json(result);
        return;

    } catch (error) {
        console.error("Erro ao listar usuários:", error);

        res.status(500).json({
            mensagem: "Erro ao listar usuários!"
        });

        return;
    }
});

router.get("/Users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const userRepository =
            AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
            id: parseInt(id)
        });

        if (!user) {
            res.status(404).json({
                mensagem: "Usuário não encontrado!"
            });
            return;
        }

        res.status(200).json(user);
        return;

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);

        res.status(500).json({
            mensagem: "Erro ao visualizar usuário!"
        });

        return;
    }
});

router.post("/Users", async (req: Request, res: Response) => {
    try {
        console.log("Dados recebidos:", req.body);

        const {
            name,
            email,
            idSituation
        } = req.body ?? {};

        if (!name || !email || !idSituation) {
            res.status(400).json({
                mensagem:
                    "Os campos name, email e idSituation são obrigatórios!"
            });
            return;
        }

        const userRepository =
            AppDataSource.getRepository(User);

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const situation =
            await situationRepository.findOneBy({
                id: parseInt(idSituation)
            });

        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }

        const newUser = userRepository.create({
            name,
            email,
            situation
        });

        await userRepository.save(newUser);

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            user: newUser
        });

        return;

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar usuário!"
        });

        return;
    }
});

router.put("/Users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const {
            name,
            email,
            idSituation
        } = req.body ?? {};

        const userRepository =
            AppDataSource.getRepository(User);

        const situationRepository =
            AppDataSource.getRepository(Situation);

        const user = await userRepository.findOneBy({
            id: parseInt(id)
        });

        if (!user) {
            res.status(404).json({
                mensagem: "Usuário não encontrado!"
            });
            return;
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            user.email = email;
        }

        if (idSituation !== undefined) {
            const situation =
                await situationRepository.findOneBy({
                    id: parseInt(idSituation)
                });

            if (!situation) {
                res.status(404).json({
                    mensagem: "Situação não encontrada!"
                });
                return;
            }

            user.situation = situation;
        }

        const updatedUser =
            await userRepository.save(user);

        res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            user: updatedUser
        });

        return;

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);

        res.status(500).json({
            mensagem: "Erro ao atualizar usuário!"
        });

        return;
    }
});

router.delete("/Users/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const userRepository =
            AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
            id: parseInt(id)
        });

        if (!user) {
            res.status(404).json({
                mensagem: "Usuário não encontrado!"
            });
            return;
        }

        await userRepository.remove(user);

        res.status(200).json({
            mensagem: "Usuário removido com sucesso!"
        });

        return;

    } catch (error) {
        console.error("Erro ao remover usuário:", error);

        res.status(500).json({
            mensagem: "Erro ao remover usuário!"
        });

        return;
    }
});

export default router;

