import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
// import { KeyManagementServiceClient } from "@google-cloud/kms";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { log } from "console";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3001;
app.use(cors())
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
// const client = new KeyManagementServiceClient();
const location = "global";
const keyRing = "wallet-keyring";
const keyId = "user-wallet-key";
const projectId = "YOUR_PROJECT_ID";

// const keyName = client.cryptoKeyPath(projectId, location, keyRing, keyId);

// Caminho do arquivo JSON
const jsonFilePath = path.join(__dirname, "wallets.json");

// Middleware
app.use(bodyParser.json());

// Função auxiliar para carregar o arquivo JSON
const loadWallets = () => {
  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify({ wallets: [] }));
  }
  const data = fs.readFileSync(jsonFilePath, "utf8");
  return JSON.parse(data);
};

// Função auxiliar para salvar dados no arquivo JSON
const saveWallets = (wallets) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify({ ...wallets }, null, 1));
};

// Create: Criar uma nova carteira
app.post("/wallets", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const wallets = loadWallets();
  
  // Verifica se o usuário já possui uma carteira
  if (wallets.wallets.some((w) => w.userId === userId)) {
    return res.status(400).json({ error: "Wallet already exists for user" });
  }

  // Gerar assinatura
  // const message = Buffer.from(`Create wallet for user: ${userId}`);
  // const [signResponse] = await client.asymmetricSign({
  //   name: keyName,
  //   digest: { sha256: message.toString("hex") },
  // });

  const newWallet = {
    userId,
    walletPublicKey: "signResponse.name",
    signature: `signResponse.signature.toString("base64")`,
  };

  wallets.wallets.push(newWallet);
  saveWallets(wallets);

  res.status(201).json(newWallet);
});

// Read: Listar todas as carteiras
app.get("/wallets", (req, res) => {
  const wallets = loadWallets();
  res.status(200).json(wallets.wallets);
});

// Read: Obter uma carteira específica por userId
app.get("/wallets/:userId", (req, res) => {
  const { userId } = req.params;
  const wallets = loadWallets();

  const wallet = wallets.wallets.find((w) => w.userId === userId);

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  res.status(200).json(wallet);
});

app.get("/", (req, res) => {
  res.send("Blockchain CRUD API");
})

// Update: Atualizar dados da carteira
app.put("/wallets/:userId", (req, res) => {
  const { userId } = req.params;
  const { walletPublicKey } = req.body;

  const wallets = loadWallets();
  const walletIndex = wallets.wallets.findIndex((w) => w.userId === userId);

  if (walletIndex === -1) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  wallets.wallets[walletIndex].walletPublicKey = walletPublicKey || wallets.wallets[walletIndex].walletPublicKey;
  saveWallets(wallets);

  res.status(200).json(wallets.wallets[walletIndex]);
});

// Delete: Remover uma carteira
app.delete("/wallets/:userId", (req, res) => {
  const { userId } = req.params;

  const wallets = loadWallets();
  const updatedWallets = wallets.wallets.filter((w) => w.userId !== userId);

  if (updatedWallets.length === wallets.wallets.length) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  saveWallets({ wallets: updatedWallets });
  res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Blockchain CRUD running on port ${port}`);
});