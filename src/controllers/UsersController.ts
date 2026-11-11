//Importa a biblioteca Express
import express, {type Request, type Response} from "express";

//Importar a conexão com BD
import { AppDataSource } from "../data-source.js";

// importar a entidade
import { User } from "../entity/users.js";

//Importa serviço de paginação
import { PaginationService } from "../services/PaginationService.js";

//Importa a biblioteca para validar os dados para cadastrar e editar
import *as yup from 'yup';

//Importar o NOt para utilizar como restrição para ignorar o próprio ID na consulta
import { Not } from "typeorm";
import { parse } from "node:path";
import { Situation } from "../entity/situations.js";

import {verifyToken} from "../middlewares/authMiddleware.js";
import bcrypt from "bcryptjs";


// Criar a aplicação Express
const router = express.Router();

// Criar a  rora para listatr os usuários
//Endedeço para acessar a API através da aplicaçãoo externa com o o verbo GET: http://localhost:8080/users?page=1&limit=10
router.get("/users", verifyToken, async (req: Request, res: Response) => {
    try {
        //Obter o respositório da entidade user
        const userRepository = AppDataSource.getRepository(User);

        //Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        //Definir o limite de registro por página
        const limit = Number (req.query.limit) || 10;

        //Usar serviço de paginação 
        const result = await PaginationService.paginate(userRepository, page, limit, {id: "DESC"});

        //Retornar a resposta com os dados e informações da paginação
        res.status(200).json(result);
        return;

    } catch (error){
        //Retornar erro e caso de falha
        res.status(500).json({
            message: "Erros ao listar os usuários!",
        });
        return;
    }
    
});

//Rota para visualizar um usiário específico
//Endereço para casar a API através da aplicação com o vervo GET: http://localhost:8080/users/:id

router.get("/users/:id", async (req: Request, res: Response) => {
    try{
        //Obter o ID do usuário a partir dos parâmetro da requisição
        const {id}= req.params;

        //Obter o respositório da entidade User
        const userRepository = AppDataSource.getRepository(User)

        //Buscar o ususário no banco de dados pelo ID
        const userId = Number(id);

        const user = await userRepository.findOneBy({ id: userId });

        //Verificar se o usuário foi encontrado
        if(!user){
            res.status(404).json({
                message: "Ususário não encontrado!"
            });
            return;
        }

        //Retornar ao usuário encontrado
        res.status(200).json(user);
        return;
        
    } catch(error){
        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao visualizar o usuário!"
        });
    }
});


// Criar a rota para cadastrar usuário
// Endereço para cassar a API através da aplicação externa com o verbo POST: http://localhost:8080/users
// A aplicação externa deve indicar que está enviando os dados em formato de obejto Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name": "Adriano Baião",
    "email": "baiao@baiao.com",
    "password": "123456",
    "situation": 1
}
*/

router.post("/users", async (req: Request, res: Response) => {
    console.log(">>> POST USERS ATUAL EXECUTADO <<<");
    try{
        //Receber os dados enviados no corpo da requisição
        var data = req.body;

        //Validar os ddos utiliando o yup
        const schema = yup.object().shape({
            name: yup.string().trim().required("O campo nome é obrigatório!").min(3, "O campo dever ter no mínimo 3 caracteres!"),
            email: yup.string().email("email Inválido!").required("O campo e-mail é obrigatório!"),
            password: yup.string().required("O campo de senha é obrigatório!").min(6, "O campo senha dever ter no mínimo 6 caracteres!" ),
            situation: yup.number().required("O campo situação é obrigatório!")
        });

        console.log("DADOS RECEBIDOS:", data);

        //Verificar  se os dados passaram pela validação
        await schema.validate(data, {abortEarly: false});

        //Criar uma instância do repositório de user
        const userRepository = AppDataSource.getRepository(User);

        //Recuparar o registro do banco de dados com o valor da coluna email
        const existingUser = await userRepository.findOne({
            where:{email: data.email}
        });

        //Verificar se já existe um usuário com o memso e-mail
        if(existingUser){
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse e-mail!",
            });
            return;
        }

        // Criptografar a senha antes de salvar
        data.password = await bcrypt.hash(data.password, 10)

        //Criar um no registro
        const newUser =  userRepository.create(data);

        //Salvar o registro no BD
        await userRepository.save(newUser);

        //Retornar resposta com sucesso
        res.status(201).json({
            message: "Usuário carastrado com sucesso!",
            situation: newUser,
        });
    } catch (error){
        if (error instanceof yup.ValidationError){
            // Retornar erros de validação
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        //Retornar erro em caso de falha
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({
            message: "Erro ao cadastrar usuário!",
        });
    }
});

// Criar a rota para editra senha do usuário
//Endereçio para cassar a API através da aplicação externa com o verbo PUT http://localhost:8080/users-password/:id
// A aplicação externa deve indicar que está enviando os dado em formato de obejto: Content-Type: application/json
//Dados em formato de obejto


router.put("/users-password/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "ID de usuário inválido!"
            });
        }

        const schema = yup.object().shape({
            password: yup.string()
                .required("O campo senha é obrigatório!")
                .min(8, "A senha deve ter no mínimo 8 caracteres!")
        });

        const data = await schema.validate(req.body, {
            abortEarly: false
        });

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id });

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        user.password = await bcrypt.hash(data.password, 10);

        await userRepository.save(user);

        return res.status(200).json({
            message: "Senha atualizada com sucesso!"
        });

    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                messagem: error.errors
            });
        }

        return res.status(500).json({
            message: "Erro ao atualizar senha!"
        });
    }
});


// Criar a rota para editar o usuário
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/users/:id
// A aplicação externa deve indicar que está enviando os dados em formato de objeto: Content-Type: application/json 
// Dados em formato de objeto
/*
{
    "name": "Kelly,
    "email": "kelly@baiao,com",
    "situation": 1
}
*/

router.put("/users/:id", async (req: Request, res: Response) =>{
    try{
        //Obter i ID da situação a partir dos parâmetros da requisição
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({
            message: "ID inválido!"
        });
        return;
        }
        

        //Receber sos dados enviados no corpod a requisição
        const data = req.body;

        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório!").min(3, "O campo deve ter no mínimo 3 caracteres!"),
            email: yup.string().email("E-mail inválido!").required("O campo é obrigatório!"),
            situation: yup.number().required("O campo situação é obrigatório!"),
        });

        //Verificar se os dados passara pela validação
        await schema.validate(data, {abortEarly: false});

        //Obeter o reposiório da entidae User
        const userRepository = AppDataSource.getRepository(User);

        // Buscar o usuário no banco de dados pelo ID
        const user = await userRepository.findOneBy({id: id});

        // Verificar se o usuário foi encontrado
        if(!user){
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }
        // Verificar se já existe  outro usuário com o mesmo  e-mail, mas que não seja o registro atual
        const existingUser = await userRepository.findOne({
            where:{
                email: data.email,
                id: Not(id), // Exclui  o próprio registro da busca
            },
        });

        if(existingUser){
            res.status(400).json({
                message: "Já existe um usuário cadastrado com esse nome!",
            });
            return;
        }

        //Atualizar os dados do usuário
        userRepository.merge(user, data);

        //Salvar as alterações no BD
        const updateUser = await userRepository.save(user);


        // Retornar resposta de sucesso
        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updateUser
        });
       
    } catch (error) {
        if(error instanceof yup.ValidationError){
            // Retornar erros de validação
            res.status(400).json({
                messagem: error.errors
            });
            return;
        }

        //Retornar erro em caso de falha
        res.status(500).json({
            message: "Erro ao editar usuário!",
        });
    }
});


// Criar a rota para apagar um usuário
//Endereço para acessar a API através da aplicação externa com o verbo delete: http://localhost:8080/users/:id
// Criar a rota para apagar um usuário
router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        // Obter o ID do usuário
        const id = Number(req.params.id);

        // Validar o ID
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                message: "ID inválido!"
            });
        }

        // Obter o repositório
        const userRepository = AppDataSource.getRepository(User);

        // Excluir o usuário pelo ID
        const resultado = await userRepository.delete(id);

        // Verificar se algum registro foi excluído
        if (resultado.affected === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado!"
            });
        }

        // Retornar sucesso
        return res.status(200).json({
            message: "Usuário apagado com sucesso!",
            registrosExcluidos: resultado.affected
        });

    } catch (error) {
        console.error("Erro ao apagar usuário:", error);

        return res.status(500).json({
            message: "Erro ao apagar o usuário!"
        });
    }
});


//Exportar a instrução que está dentro da constante router
export default router;