## Requisito
* Node.js 22 ou superior
Verificar se tem o node: node -v

* Criando o arquivo package
npm init

* instalar o "Express" para gerenciar as requisições, rotas e URLs, entre outras funcionalidades.
npm i express

* Instalar pacotores de suporte para TypeScript (1 para Expresse, 1 para Node)
npm i --save-dev @types/express
npm i --save-dev @types/node

* Instalar o compilador do projeto
npm i --save-dev ts-node

* Gerando o arquido de configuração do TypeScript
npx tsc --init

* Compilar o arquivo TypeScript
npx tsc

* Para executar o arquivo node.js
node  dist/index.js

* Instalando as dependências type orm para rodar o mysql
 npm i typeorm --save
 npm i reflect-metadata --save
 npm i mysql2 --save

* Manipular as variáveis de ambiente
npm i dotenv --save

* Instalar os tipos de variáveiss para o TypeScript
npm i --save-dev @types/dotenv

Criar Migração no BD
npx typeorm migration:create src/migration/CreateSituationsTable

npx typeorm migration:create src/migration/CreateUsersTable
