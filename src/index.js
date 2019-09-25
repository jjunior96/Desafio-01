const express = require('express');

const server = express();

server.use(express.json());

let numeroDeRequisicoes = 0;
const projetos = [];

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

server.use(logRequisicoes);

server.get('/projects', (req, res) => {
  return res.json(projetos);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const projeto = {
    id, 
    title,
    tasks: []
  };

  projetos.push(projeto);

  return res.json(projeto);

});

server.put('/projects/:id', verificaID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id); 

  projeto.title = title;

  return res.json(projeto);
});

server.get('/projects/:id', verificaID, (req, res) => {
  return res.json(req.projeto); 
});

server.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projetoIndex = projetos.findIndex(p => p.id == id);

  projetos.splice(projetoIndex, 1);

  return res.json(projetos);
});

// Tasks
server.post('/projects/:id/tasks', verificaID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);

  projeto.tasks.push(title);

  return res.json(projeto);
});



server.listen(3333);