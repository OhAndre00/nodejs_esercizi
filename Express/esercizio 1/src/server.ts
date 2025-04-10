import "dotenv/config";
import express from "express"; //Il framework principale per creare il server web
import "express-async-errors"; //Gestisce automaticamente gli errori nelle funzioni async
import morgan from "morgan"; //Per formattare le risposte in formato JSON
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planets.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Planets");
});

app.get("/api/planets", getAll);

app.get("/api/planets/:id", getOneById);

app.post("/api/planets", create);

app.put("/api/planets/:id", updateById);

app.delete("/api/planets/:id", deleteById);

// Avvio server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
