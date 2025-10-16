# NilData Wallet

NilData Wallet is a browser extension that helps users manage private data and control permissions in Nillion's User Owned Collections

---

## ✨ Features

- 🔑 **Private Data Management** – Store and organize sensitive information locally.  
- 🛡 **Permission Control** – Grant or revoke data access per app/service.  
- 🌐 **Browser Extension** – Runs directly in the browser for easy access.  
- ⚡ **User-Centric** – Puts the user in control of their data at all times.  

---

## 🔗 Integration

### For Developers

Want to integrate NilData Wallet into your React application?

**[📦 nildata-wallet-connector](https://www.npmjs.com/package/nildata-wallet-connector)** - NPM package for easy integration

This package provides:
- React Provider/Hook pattern for wallet connection
- TypeScript support
- Secure data transmission to the extension
- Auto-connect functionality

**[📚 Example Implementation](https://github.com/ysongh/AirTagAlong/tree/master/client2)** - See a real-world example of using `nildata-wallet-connector`

---

## How DID generation and storage are handled?

**NilDataWallet** generates and securely stores Decentralized Identifiers (DIDs) as follows:

- **Generation**: DIDs are created using keypairs from the `@nillion/nuc` library
- **Storage**: The generated keypair is stored locally in the browser extension's local storage
- **Encryption**: The keypair is encrypted using **AES-GCM**, with keys derived using **PBKDF2** for secure key derivation.

---

## 🧠 Tech Stack

- TypeScript
- React (for UI)
- Vite (for build system)
- Secretvaults SDK

---

## 📚 Resources

- [NPM Package for Integration](https://www.npmjs.com/package/nildata-wallet-connector)
- [Integration Example](https://github.com/ysongh/AirTagAlong/tree/master/client2)