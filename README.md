# NilData Wallet

<img src="https://raw.githubusercontent.com/ysongh/NilDataWallet/refs/heads/dev/images/s1.png" alt="NilData Wallet" width="300"/>

NilData Wallet is a browser extension that helps users manage private data and control permissions in Nillion's User Owned Collections. DIDs/keypairs are generated via @nillion/nuc keypairs, securely stored in the browser’s local storage, and encrypted with AES-GCM using PBKDF2-derived keys

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
- Data transmission to the extension

**[📚 Example Implementation](https://github.com/ysongh/AirTagAlong/tree/master/client2)** - See a real-world example of using `nildata-wallet-connector`

---

## How DID generation and storage are handled?

**NilDataWallet** generates and securely stores Decentralized Identifiers (DIDs) as follows:

- **Generation**: DIDs are created using keypairs from the `@nillion/nuc` library
- **Storage**: The generated keypair is stored locally in the browser extension's local storage
- **Encryption**: The keypair is encrypted using **AES-GCM**, with keys derived using **PBKDF2** for secure key derivation.

---

# How data is created, listed, viewed, and deleted?

### 🔒 **Create Data**
- Applications send data through the `nildata-wallet-connector` package using `sendDataToExtension()`
- Extension popup opens for user confirmation
- User approves the data storage request
- Data is encrypted and stored securely in the Nillion Network

<img src="https://raw.githubusercontent.com/ysongh/NilDataWallet/refs/heads/dev/images/s2.png" alt="NilData Wallet" width="300"/>

### 📋 **List Data**
- Extension displays all stored collections in the dashboard
- Collections are organized by name and timestamp
- Users can see which apps have access to which data

<img src="https://raw.githubusercontent.com/ysongh/NilDataWallet/refs/heads/dev/images/s3.png" alt="NilData Wallet" width="300"/>

### 👁️ **View Data**
- Click on any collection to view details
- See collection name, ID, and metadata
- View associated permissions and access history

<img src="https://raw.githubusercontent.com/ysongh/NilDataWallet/refs/heads/dev/images/s4.png" alt="NilData Wallet" width="300"/>

### 🗑️ **Delete Data**
- Users can delete collections from the extension dashboard

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
