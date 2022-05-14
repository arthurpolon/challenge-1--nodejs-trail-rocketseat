const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = new Map();

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if (!username) {
    return response.status(400).json({ error: 'Username is required in request headers' });
  }

  const userDoesNotExist = !users.has(username);

  if (userDoesNotExist) {
    return response.status(400).json({ error: 'User does not exists' });
  } 

  return next();
}

app.post('/users', (request, response) => {
  const { username } = request.body;

  const userAlreadyExists = users.has(username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User with same username already exists!' }); 
  }

  const { name } = request.body;

  const id = uuid();

  const newUserObject = {
    id,
    name,
    username,
    todos: [],
  }

  users.set(username, newUserObject);

  return response.status(200).json(newUserObject);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;