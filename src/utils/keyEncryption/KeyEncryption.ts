// Encryption configuration (similar to MetaMask)
const PBKDF2_ITERATIONS = 600000; // High iteration count for security
const SALT_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits for AES-GCM
const KEY_LENGTH = 256; // 256-bit key

interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
}

/**
 * Derives a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordBuffer = enc.encode(password);

  // Import password as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive a key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      // @ts-ignore
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a private key with a password
 */
export async function encryptPrivateKey(
  privateKey: string,
  password: string
): Promise<EncryptedData> {
  if (!password) {
    throw new Error('Password is required');
  }

  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Derive encryption key from password
  const key = await deriveKey(password, salt);

  // Encrypt the private key
  const enc = new TextEncoder();
  const privateKeyBuffer = enc.encode(privateKey);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    privateKeyBuffer
  );

  // Convert to base64 for storage
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
  };
}

/**
 * Decrypts an encrypted private key with a password
 */
export async function decryptPrivateKey(
  encryptedData: EncryptedData,
  password: string
): Promise<string> {
  if (!password) {
    throw new Error('Password is required');
  }

  if (!encryptedData.ciphertext || !encryptedData.iv || !encryptedData.salt) {
    throw new Error('Invalid encrypted data: missing required fields');
  }

  try {
    // Convert from base64
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const iv = base64ToArrayBuffer(encryptedData.iv);
    const salt = base64ToArrayBuffer(encryptedData.salt);

    // Derive the same key from password and salt
    const key = await deriveKey(password, new Uint8Array(salt));

    // Decrypt the private key
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
      },
      key,
      ciphertext
    );

    // Convert back to string
    const dec = new TextDecoder();
    const result = dec.decode(decrypted);
    
    if (!result) {
      throw new Error('Decryption produced empty result');
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'Decryption produced empty result') {
      throw error;
    }
    throw new Error('Decryption failed. Invalid password or corrupted data.');
  }
}

// Utility functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
