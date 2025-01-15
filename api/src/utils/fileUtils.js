import fs from "fs";

const jsonFilePath = "./src/data/wallets.json";

export const loadWallets = () => {
  if (!fs.existsSync(jsonFilePath)) {
    fs.writeFileSync(jsonFilePath, JSON.stringify({ wallets: [] }));
  }
  const data = fs.readFileSync(jsonFilePath, "utf8");
  return JSON.parse(data);
};

export const saveWallets = (wallets) => {
  fs.writeFileSync(jsonFilePath, JSON.stringify({ ...wallets }, null, 2));
};