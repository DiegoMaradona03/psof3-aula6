const express = require('express');
const routes = express.Router();

const Login = require('./controllers/login.js');
const Professor = require('./controllers/professor');
const Turma = require('./controllers/turma');
const Atividade = require('./controllers/atividade');

routes.get('/', (req, res) => {
    res.json({ titulo: "Escola" });
})
routes.post('/login', Login.login);

routes.post('/professores', Professor.create);
routes.get('/professores', Professor.read);
routes.get('/professores/:id', Professor.readOne);
routes.patch('/professores/:id', Professor.update);
routes.delete('/professores/:id', Professor.remove);

routes.post('/turmas', Turma.create);
routes.get('/turmas', Turma.read);
routes.get('/turmas/:id', Turma.readOne);
routes.get('/turmas/professor/:professorId', Turma.readByProfessor);
routes.patch('/turmas/:id', Turma.update);
routes.delete('/turmas/:id', Turma.remove);

routes.post('/atividades', Atividade.create);
routes.get('/atividades', Atividade.read);
routes.get('/atividades/:id', Atividade.readOne);
routes.get('/atividades/turma/:turmaId', Atividade.readByTurma);
routes.patch('/atividades/:id', Atividade.update);
routes.delete('/atividades/:id', Atividade.remove);

module.exports = routes;