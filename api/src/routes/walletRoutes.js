import express from "express";
import {
  createWallet,
  getWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  decryptKeyByUserId,
} from "../controllers/walletController.js";

const router = express.Router();

router.post("/", createWallet);
router.post("/decrypt/:userId", decryptKeyByUserId);
router.get("/", getWallets);
router.get("/:userId", getWalletById);
router.put("/:userId", updateWallet);
router.delete("/:userId", deleteWallet);

export default router;