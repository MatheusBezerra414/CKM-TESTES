import { loadWallets, saveWallets } from "../utils/fileUtils.js";
import WalletService from "../service/walletservice.js";
import { Mnemonic } from "ethers";
import { encrypt, decrypt } from "../service/cryptoService.js";

export const createWallet = async (req, res) => {
  const { userId } = req.body;

  // Validação do ID do usuário
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const wallets = loadWallets();

  // Verifica se o usuário já possui uma carteira
  if (wallets.wallets.some((w) => w.userId === userId)) {
    return res.status(400).json({ error: "Wallet already exists for user" });
  }

  try {
    const walletService = new WalletService();
    const wallet = await walletService.createWallet();
    const encryptedKey = await encrypt(wallet.privateKey);
    const newWallet = {
      userId,
      walletAddress: wallet.address,
      privateKey: encryptedKey,
      mnemonic: wallet.mnemonic,
    };
    wallets.wallets.push(newWallet);
    saveWallets(wallets);

    // Retorna a nova carteira criada
    res.status(201).json(newWallet);
  } catch (error) {
    console.error(`Error creating wallet: ${error.message}`);
    res.status(500).json({ error: "Failed to create wallet" });
  }
};

export const getWallets = (req, res) => {
  const wallets = loadWallets();
  res.status(200).json(wallets.wallets);
};

export const getWalletById = (req, res) => {
  const { userId } = req.params;
  const wallets = loadWallets();
  const wallet = wallets.wallets.find((w) => w.userId === userId);

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  res.status(200).json(wallet);
};

export const updateWallet = (req, res) => {
  const { userId } = req.params;
  const { walletPublicKey } = req.body;

  const wallets = loadWallets();
  const walletIndex = wallets.wallets.findIndex((w) => w.userId === userId);

  if (walletIndex === -1) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  wallets.wallets[walletIndex].walletPublicKey =
    walletPublicKey || wallets.wallets[walletIndex].walletPublicKey;
  saveWallets(wallets);

  res.status(200).json(wallets.wallets[walletIndex]);
};

export const deleteWallet = (req, res) => {
  const { userId } = req.params;

  const wallets = loadWallets();
  const updatedWallets = wallets.wallets.filter((w) => w.userId !== userId);

  if (updatedWallets.length === wallets.wallets.length) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  saveWallets({ wallets: updatedWallets });
  res.status(204).send();
};

export const decryptKeyByUserId = async (req, res) => {
  const { userId } = req.params;
  // Carrega as carteiras
  const wallets = loadWallets();
  // Verifica se o formato do JSON está correto
  if (!wallets || !Array.isArray(wallets.wallets)) {
    return res.status(500).json({ error: "Invalid wallets data" });
  }
  // Busca a carteira pelo userId
  const wallet = wallets.wallets.find((w) => w.userId === userId);
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }
  // Verifica se a privateKey existe
  if (!wallet.privateKey) {
    return res.status(400).json({ error: "Private key is missing" });
  }
  try {
    // Tenta descriptografar a chave
    const decryptKey = await decrypt(wallet.privateKey);
    console.log("Chave descryptografada", decryptKey);
    res.status(200).json({ decryptKey });
  } catch (error) {
    console.error(`Error decrypting key: ${error.message}`);
    res.status(500).json({ error: "Failed to decrypt key" });
  }
};
