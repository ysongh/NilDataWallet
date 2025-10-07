import { Keypair } from '@nillion/nuc';
import { SecretVaultUserClient } from '@nillion/secretvaults';

const NILLION_BASE_URLS = [
  "https://nildb-stg-n1.nillion.network",
  "https://nildb-stg-n2.nillion.network",
  "https://nildb-stg-n3.nillion.network"
];

export const createSecretVaultUserClient = async (apiKey: string) => {
  const userKeypair = Keypair.from(apiKey);
  
  return SecretVaultUserClient.from({
    baseUrls: NILLION_BASE_URLS,
    keypair: userKeypair,
  });
};
