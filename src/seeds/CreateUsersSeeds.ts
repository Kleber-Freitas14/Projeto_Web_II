import { DataSource } from "typeorm";
import { User } from "../entity/users.js";

export default class CreateUsersSeeds {

    public async run(datasource: DataSource): Promise<void> {

        console.log("Iniciando o seed para a tabela 'users'...");

        const userRepository = datasource.getRepository(User);

        const existingCount = await userRepository.count();

        if (existingCount > 0) {
            console.log(
                "A tabela 'users' já possui dados. Nenhuma alteração foi realizada!"
            );
            return;
        }

        const users = [
            {
                name: "João Silva",
                email: "joao.silva@email.com",
                situation: { id: 1 }
            },
            {
                name: "Maria Souza",
                email: "maria.souza@email.com",
                situation: { id: 1 }
            },
            {
                name: "Carlos Lima",
                email: "carlos.lima@email.com",
                situation: { id: 3 }
            }
        ];

        await userRepository.save(users);

        console.log(
            "Seed concluído com sucesso: Usuários cadastrados!"
        );
    }
}