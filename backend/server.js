const express = require("express");
const app = express();
const db = require("./db");

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

let todos = [];

app.get("/todos", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/todos", async (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid Todo ID" });
  }

  try {
    const result = await db.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3
       RETURNING *`,
      [title ?? null, completed ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid Todo ID" });
  }

  try {
    const result = await db.query(
      "DELETE FROM todos WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

let shopping = [];

app.get("/shopping", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM shopping ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/shopping", async (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO shopping (title) VALUES ($1) RETURNING *",
      [title.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.patch("/shopping/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const result = await db.query(
      "UPDATE shopping SET completed = TRUE WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/shopping/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  try {
    const result = await db.query(
      "DELETE FROM shopping WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/version", (req, res) => {
  res.json({ version: "v3" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});