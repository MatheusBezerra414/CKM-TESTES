import { Mnemonic } from 'ethers';
import { Wallet } from 'ethers'

export default class WalletService {
  createWallet() {
    try {

      console.log('chamou a wallet');
      
      // Gera uma nova carteira Ethereum
      const wallet = Wallet.createRandom();

      // Retorna os detalhes da carteira criada
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
      };
    } catch (error) {
      throw new Error(`Error creating Ethereum wallet: ${error.message}`);
    }
  }
  connectWallet(privateKey){
    return new Wallet(privateKey);
  }
}