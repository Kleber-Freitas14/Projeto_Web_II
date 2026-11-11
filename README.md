README.md
100%
## Requisitos

* Node.js 22 ou superior - Conferir a versão: node -v
* MySQL 8 ou superior - Conferir a versão: mysql --version

## Como rodar o projeto baixado

Duplicar o arquivo ".env.example" e renomear para ".env".<br>
Alterar no arquivo .env as credenciais do banco de dados<br>

Instalar todas as dependencias indicada pelo package.json.
```
npm install
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.
```
npm run start:watch
```

Executar as migrations para criar as tabelas no banco de dados.
```
npx typeorm migration:run -d dist/data-source.js
```

Executar as seeds para cadastrar registro de teste nas tabelas no banco de dados.
```
node dist/run-seeds.js
```
## Sequencia para criar projeto

Criar o arquivo package
```
npm init
``` 

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidade.
``` 
npm i express 
``` 

Instalar os pacotes para suporte ao TypeScript
```
npm i --save-dev @types/express
```
```
npm i --save-dev @types/node@22.15.2
```

Instalar o compilador do projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado
```
npm i --save-dev ts-node
```

Gerar o arquivo de configuração para o TypeScript.
```
npx tsc --init
```

Compilar o arquivo TypeScript
```
npx tsc
```

Executar o arquivo gerado com o Node.js
```
node dist/index.js
```

Instalar a dependência para rodar processos simultâneo.
```
npm i --save-dev concurrently
```

Compilar o arquivo TypeScript. Executar o arquivo gerado.
```
npm run start:watch
```

Criar banse de dados no myqsl 
```
CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Instalar a dependência para conectar o Node.js (TS) com BD.
```
npm i typeorm --save
```

Biblioteca utilizada no TypeScript para adicionar metadados (informações adicionais) a classes.
```
npm i reflect-metadata --save
```

Instalar o drive do banco de dados MySQL.
```
npm i mysql2 --save
```

Manipular variáveis de ambiente.
```
npm i dotenv --save
```

Instalar os tipos de variáveis para o TypeScript

```
npm i --save-dev @types/dotenv
```

Criar a MIGRATION que será usada para criar a tabela no banco de dados

```
npx typeorm migration:create src/migration/CreateSituationsTable
``` 
```
npx typeorm migration:create src/migration/CreateUsersTable
```
```
npx typeorm migration:create src/migration/AddSlugToProducts
```
```
npx typeorm migration:create src/migration/AddPasswordToUsers
```
```
npx typeorm migration:create src/migration/AddRecoverPasswordToUsers
```


Executar as migrations para criar as tabelas no banco de dados.
```
npx typeorm migration:run -d dist/data-source.js
```

Validar formulário.
```
npm i yup
```

Permitir requisição externa.
```
npm i cors
```
```
npm install --save-dev @types/cors
```

Converter o slug automaticamente antes de salvar no banco de dados.
```
npm install slugify
```

Instalar o módulo para criptografar a senha.
```
npm install --save bcryptjs

```
Instalar os tipos do bcryptjs.
```
npm install --save-dev @types/bcryptjs
```

Instalar a dependencia JWT para manipular token de autenticação.
```
npm install jsonwebtoken
```
Instalar os tipos do jsonwebtoken.
```
npm i --save-dev @types/jsonwebtoken
```

Instalar o módulo para enviar e-mail.
```
npm install nodemailer
```
Instalar os tipos do nodemailer.
```
npm install --save-dev @types/nodemailer
```
Exibindo README.md…