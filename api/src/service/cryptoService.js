import { KeyManagementServiceClient } from "@google-cloud/kms";

const projectId = "testnet-api-432421" // Substitua pelo ID do seu projeto GCP
const locationId = "global" // Local do KMS (geralmente "global")
const keyRingId = "keyring-test-1" // Nome do KeyRing
const cryptoKeyId = "hsm-key-project-test" // Nome da CryptoKey

const client = new KeyManagementServiceClient()

const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, cryptoKeyId)

const locationName = client.locationPath(projectId, locationId)

export const listKeyRings = async () => {
  const [keyRings] = await client.listKeyRings({ 
    parent: locationName 
  })
  for (const keyRing of keyRings) {
    console.log(keyRing.name)
  }
  return keyRings
}
/**
 * Criptografa um texto usando o KMS.
 * @param {string} plaintext - O texto a ser criptografado.
 * @returns {Promise<string>} - O texto criptografado em base64.
 */
export const encrypt = async (plaintext) => {
  const [result] = await client.encrypt({
    name: keyName,
    plaintext: Buffer.from(plaintext),
  })
  return result.ciphertext.toString("base64");
}

/**
 * Descriptografa um texto usando o KMS.
 * @param {string} ciphertext - O texto criptografado em base64.
 * @returns {Promise<string>} - O texto descriptografado.
 */
export const decrypt = async (ciphertext) => {
  const [result] = await client.decrypt({
    name: keyName,
    ciphertext: Buffer.from(ciphertext, "base64"),
  })
  return result.plaintext.toString("utf8")
};