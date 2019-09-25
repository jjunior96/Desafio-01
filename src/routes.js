const { Router } = require('express');

const routes = new Router();

let numeroDeRequisicoes = 0;
const projetos = [];

// ****** Middlewares Globais ******
function verificaID (req, res, next) {
  const { id } = req.params;
  const projeto = projetos.find(projetoId => projetoId.id == id);

  if (!projeto) {
    return res.status(400).json({ error: 'Projeto não encontrado' });
  }

  req.projeto = projeto;

  return next();
}

function logRequisicoes (req, res, next) {
  numeroDeRequisicoes++;

  console.log(`Numero de requisiçoes: ${numeroDeRequisicoes}`);

  return next();
}

routes.use(logRequisicoes);

// ****** Routes ******
routes.get('/projects', (req, res) => {
  return res.json(projetos);
});

routes.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const projeto = {
    id, 
    title,
    tasks: []
  };

  projetos.push(projeto);

  return res.json(projeto);

});

routes.put('/projects/:id', verificaID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id); 

  projeto.title = title;

  return res.json(projeto);
});

routes.get('/projects/:id', verificaID, (req, res) => {
  return res.json(req.projeto); 
});

routes.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projetoIndex = projetos.findIndex(p => p.id == id);

  projetos.splice(projetoIndex, 1);

  return res.json(projetos);
});

// Tasks
routes.post('/projects/:id/tasks', verificaID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);

  projeto.tasks.push(title);

  return res.json(projeto);
});

module.exports = routes;