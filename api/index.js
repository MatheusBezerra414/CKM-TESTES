import express from "express";
import cors from "cors";
import walletRoutes from "./src/routes/walletRoutes.js";
import { loggerMiddleware } from "./src/middlewares/loggerMiddleware.js";

const app = express();
const port = 3001;

app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(loggerMiddleware);

app.use("/wallets", walletRoutes);

app.get("/", (req, res) => {
  res.send("Blockchain CRUD API");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});