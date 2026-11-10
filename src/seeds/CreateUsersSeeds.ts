// Importar a conexão com BD
import { DataSource } from "typeorm";

// Importar as entidades
import { User } from "../entity/users.js";
import { Situation } from "../entity/situations.js";

export default class CreateUsersSeed {
    public async run(dataSource: DataSource): Promise<void> {

        // Obter os repositórios
        const userRepository = dataSource.getRepository(User);
        const situationRepository = dataSource.getRepository(Situation);

        // Buscar a situação no BD
        const situation = await situationRepository.findOne({
            where: { id: 1 }
        });

        // Verificar se encontrou a situação
        if (!situation) {
            console.error("Erro: Nenhuma situação encontrada com ID 1!");
            return;
        }

        // Criar os usuários
        const users = [
            {
                name: "Adriano Baião",
                email: "baiao@BaseAudioContext.com",
                situation: situation,
            },
            {
                name: "Aurora",
                email: "aurora@BaseAudioContext.com",
                situation: situation,
            },
        ];

        // Verificar individualmente se os usuários já existem
        for (const user of users) {

            const existingUser = await userRepository.findOne({
                where: { email: user.email }
            });

            if (!existingUser) {
                await userRepository.save(user);
                console.log(`Usuário ${user.name} cadastrado com sucesso!`);
            } else {
                console.log(`Usuário ${user.name} já está cadastrado!`);
            }
        }
    }
}






