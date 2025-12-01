#Calculadora de Maturidade (NITRL)

Este projeto é uma aplicação web para avaliação de maturidade de projetos (baseado em TRL/NITRL), composta por um **Backend (API Node.js)** e um **Frontend (React.js)**.

#Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* Node.js
* PostgreSQL

---

#Configuração do Banco de Dados

1. Certifique-se de que o serviço do PostgreSQL está rodando.
2. Crie um banco de dados chamado **`CalculadoraMat`**.
3. Verifique as credenciais no arquivo `BACKEND/index.js`:
   * Abra o arquivo e procure por `const pool = new Pool(...)`.
   * Atualize os campos `user` e `password` com o seu usuário e senha do Postgres local.

---

#Como Rodar o Projeto

Você precisará de **dois terminais** abertos simultaneamente: um para o Servidor (Backend) e outro para a Interface (Frontend).
Nos dois terminais precisa rodar `npm install` e depois `npm start`.
