import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("database.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL
  );
`);

// Seed Data if empty
const eventsCount = db.prepare("SELECT COUNT(*) as count FROM events").get() as { count: number };
if (eventsCount.count === 0) {
  const insertEvent = db.prepare("INSERT INTO events (title, date, description, type) VALUES (?, ?, ?, ?)");
  const initialEvents = [
    { title: "Volta as aulas", date: "2026-02-24", description: "Lembrando que teremos o rodízio ainda.", type: "evento" },
    { title: "Aula normal", date: "2026-02-25", description: "Dia de aula regular.", type: "evento" },
    { title: "Trote de Carnaval", date: "2026-02-26", description: "Primeiro trote oficial do Terceirão.", type: "evento" },
    { title: "Aula normal", date: "2026-02-27", description: "Dia de aula regular.", type: "evento" },
    { title: "Aula online", date: "2026-02-28", description: "Entre no sala do futuro para ver se temos lições upadas.", type: "evento" },
    { title: "Baile de Formatura", date: "2026-12-18", description: "A noite mais esperada do ano. (Data indefinida por enquanto)", type: "evento" }
  ];
  initialEvents.forEach(e => insertEvent.run(e.title, e.date, e.description, e.type));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/events", (req, res) => {
    const events = db.prepare("SELECT * FROM events ORDER BY date ASC").all();
    res.json(events);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
