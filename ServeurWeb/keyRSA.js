const crypto = require('crypto');

class KeyRSA {
  constructor() {
    this.privateKey = null;
    this.publicKey = null;
  }

  generateKeys() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  getPublicKey() {
    return this.publicKey;
  }
  
  getPrivateKey() {
    return this.privateKey;
  }
}

// Créer une instance globale
global.keyRSA = new KeyRSA();
global.keyRSA.generateKeys();
