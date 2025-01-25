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


document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); 
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const publicKeyPem = await fetchPublicKey();

        const publicKey = await importPublicKey(publicKeyPem);

        const encryptedPassword = await encryptWithPublicKey(publicKey, password);

        console.log(username, encryptedPassword);

        if (!encryptedPassword) {
            alert('Erreur lors du chiffrement du mot de passe.');
            return;
        }

        
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password: encryptedPassword }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Inscription réussie !');
        } else {
            alert(`Erreur : ${result.error}`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
        
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
});
