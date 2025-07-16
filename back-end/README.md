# CrossFit Web - Backend

Backend do projeto CrossFit Web, construído com NestJS, um framework Node.js progressivo para a criação de aplicações server-side eficientes e escaláveis.

-----

## 📖 Sobre o Projeto

Este repositório contém o código-fonte do backend da aplicação **CrossFit Web**. O projeto utiliza o framework [NestJS](https://github.com/nestjs/nest) e foi estruturado para ser robusto, escalável e de fácil manutenção, seguindo as melhores práticas de desenvolvimento.

## 💻 Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

  - **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript.
  - **[NestJS](https://nestjs.com/)**: Framework principal para a construção da API.
  - **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
  - **[TypeORM](https://typeorm.io/)**: ORM para interação com o banco de dados.
  - **[SQLite](https://www.sqlite.org/index.html)**: Banco de dados padrão para desenvolvimento (facilmente adaptável para PostgreSQL, MySQL, etc.).
  - **[Jest](https://jestjs.io/)**: Framework para a execução de testes.
  - **[ESLint](https://eslint.org/)** e **[Prettier](https://prettier.io/)**: Ferramentas para padronização e formatação de código.

## 🚀 Começando

Siga as instruções abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

  - [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
  - [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Instalação e Execução

1.  **Clone o repositório:**

    ```bash
    $ git clone <url-do-repositorio>
    $ cd crossfit-web-backend
    ```

2.  **Instale as dependências:**

    ```bash
    $ npm install
    ```

3.  **Execute a aplicação:**

      - **Modo de Desenvolvimento** (com recarregamento automático):

        ```bash
        $ npm run start:dev
        ```

      - **Modo de Produção:**

        ```bash
        # Primeiro, compile o projeto
        $ npm run build
        # Depois, inicie o servidor
        $ npm run start:prod
        ```

      - **Modo Padrão:**

        ```bash
        $ npm run start
        ```

A aplicação estará disponível em `http://localhost:3000`.

## 🧪 Testes

O projeto conta com uma suíte de testes para garantir a qualidade e a estabilidade do código.

  - **Executar testes unitários:**
    ```bash
    $ npm run test
    ```
  - **Executar testes end-to-end (e2e):**
    ```bash
    $ npm run test:e2e
    ```
  - **Gerar relatório de cobertura de testes:**
    ```bash
    $ npm run test:cov
    ```

## ☁️ Deployment

Para fazer o deploy da sua aplicação NestJS em produção, consulte a [documentação oficial de deployment](https://docs.nestjs.com/deployment).

Se você procura uma plataforma em nuvem para deploy, considere o [Mau](https://mau.nestjs.com), a plataforma oficial para deploy de aplicações NestJS na AWS.

```bash
# Instale a CLI do Mau
$ npm install -g @nestjs/mau

# Faça o deploy com um único comando
$ mau deploy
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/nestjs/nest/blob/master/LICENSE) para mais detalhes.

-----

Feito com ❤️ por Gabriela Sena, com o apoio da comunidade NestJS.