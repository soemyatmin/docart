const express = require("express");
const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

let todos = [];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const todo = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.patch("/todos/:id", (req, res) => {
  const todo = todos.find(
    t => t.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todo.completed = true;
  res.json(todo);
});

app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex(
    t => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

let shopping = [];

app.get("/shopping", (req, res) => {
  res.json(shopping);
});

app.post("/shopping", (req, res) => {
  const item = {
    id: Date.now(),
    title: req.body.title,
    completed: false
  };

  shopping.push(item);
  res.status(201).json(item);
});

app.patch("/shopping/:id", (req, res) => {
  const item = shopping.find(
    i => i.id === Number(req.params.id)
  );

  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }

  item.completed = true;
  res.json(item);
});

app.delete("/shopping/:id", (req, res) => {
  const index = shopping.findIndex(
    item => item.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  shopping.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});