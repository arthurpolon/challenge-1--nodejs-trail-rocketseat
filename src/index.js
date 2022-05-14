const express = require('express');
const cors = require('cors');

const { v4: uuid } = require('uuid');
const arrayFromMap = require('./utils/arrayFromMap');

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
  const id = uuid();
  const { username, name } = request.body;

  const userAlreadyExists = users.has(username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User with same username already exists!' }); 
  }

  const newUserObject = {
    id,
    name,
    username,
    todos: new Map(),
  }

  users.set(username, newUserObject);

  const responseObject = {
    ...newUserObject,
    todos: arrayFromMap(newUserObject.todos),
  }

  return response.status(200).json(responseObject);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const userTodos = users.get(username).todos

  const todosArray = arrayFromMap(userTodos);

  return response.status(200).json(todosArray);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const id = uuid();

  const newTodoObject = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  const userTodos = users.get(username).todos;
  userTodos.set(id, newTodoObject);

  return response.status(201).json(newTodoObject)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const userTodos = users.get(username).todos;
  const selectedTodo = userTodos.get(id);

  if (!selectedTodo) {
    return response.status(400).json({ error: 'Todo does not exists' });
  }

  const updatedTodoObject = {
    ...selectedTodo,
    title,
    deadline: new Date(deadline),
  }

  userTodos.set(id, updatedTodoObject);

  return response.status(200).json(updatedTodoObject);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;