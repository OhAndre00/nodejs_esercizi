import "dotenv/config";
import express from "express"; //Il framework principale per creare il server web
import "express-async-errors"; //Gestisce automaticamente gli errori nelle funzioni async
import morgan from "morgan"; //Per formattare le risposte in formato JSON
import {
  getRoute,
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());

app.get("/", getRoute);
app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage);

// Avvio server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
