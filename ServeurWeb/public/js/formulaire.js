async function fetchPublicKey() {
    const response = await fetch('/api/key/publickey');
    const publicKey = await response.json();
    return publicKey.key;
}

async function importPublicKey(pemKey) {

    const binaryDer = decodeBase64(
        pemKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, '')
    );

    return await window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt']
    );
}

function decodeBase64(base64) {
    const binaryString = atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function encodeBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
}


async function encryptWithPublicKey(publicKey, data) {
    const encodedData = new TextEncoder().encode(data);
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        publicKey,
        encodedData
    );
    return encodeBase64(encrypted);
}

if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Récupération et envoie des donnée du formulaire chiffré a l'API
        const formDataConfig = new FormData(this);

        try {

            // Chiffrement du formulaire
            const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
            const publicKeyPem = await fetchPublicKey();
            const publicKey = await importPublicKey(publicKeyPem);
            const encryptedForm = await encryptWithPublicKey(publicKey, jsonData);
            if (!encryptedForm) {
                alert('Erreur lors du chiffrement du mot de passe.');
                return;
            }

            // Envoie du formulaire
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedForm }),
            });

            if (response.ok) {
                console.log('Inscription réussie !');
            } else {
                const errorDetails = await response.text();
                throw new Error(`Erreur serveur (${response.status}): ${errorDetails}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
        }
    });
}


if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Récupération et envoie des donnée du formulaire chiffré a l'API
        const formDataConfig = new FormData(this);

        try {

            // Chiffrement du formulaire
            const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
            const publicKeyPem = await fetchPublicKey();
            const publicKey = await importPublicKey(publicKeyPem);
            const encryptedForm = await encryptWithPublicKey(publicKey, jsonData);
            if (!encryptedForm) {
                alert('Erreur lors du chiffrement du mot de passe.');
                return;
            }

            // Envoie du formulaire
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedForm }),
            });

            if (response.ok) {
                console.log('Connexion réussie !');
            } else {
                const errorDetails = await response.text();
                throw new Error(`Erreur serveur (${response.status}): ${errorDetails}`);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
        }
    });
}