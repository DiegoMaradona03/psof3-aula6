# API Escola

## Tecnologias
- VsCode
- Node.js
- Prisma
- XAMPP MySQL
- JavaScript

## Teste remotamente através da Vercel

## Para testar localmente
- 1 Clone este repositorio
- 2 Crie um arquivo .env na raiz contendo o conteúdo a seguir:
```js
DATABASE_URL="mysql://root@localhost:3306/turmas_db"
PORT=3765
```
- 3 Abra com o VsCode e abra um terminal **CMD** ou **bash** e instale as dependências
```
npm install
```
- 4 Abra o XAMPP de start em MySQL e faça a migração do BD
```bash
npx prisma migrate dev --name init
```
- 5 Execute a API
```
npm run dev
```