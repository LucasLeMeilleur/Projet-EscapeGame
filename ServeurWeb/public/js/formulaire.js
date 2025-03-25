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


///// Inscription
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        document.getElementById("spinner").style.display = "block";
        // Récupération et envoie des donnée du formulaire chiffré a l'API
        const formDataConfig = new FormData(this);
        // Chiffrement du formulaire
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
        // Envoie du formulaire
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData,
        });

        if (response.ok) {
            document.getElementById("spinner").style.display = "none";
            window.location.href = '/';
        } else {
            const errorDetails = JSON.parse(await response.text()).message;
            document.getElementById("montrer_erreur").innerText = errorDetails;
            document.getElementById("spinner").style.display = "none";
        }
    });
}



///// Connexion
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        document.getElementById("spinner").style.display = "block";

        // Récupération et envoie des donnée du formulaire chiffré a l'API
        const formDataConfig = new FormData(this);

        // Chiffrement du formulaire
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));


        console.log(jsonData)


        // Envoie du formulaire
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData,
        });
        if (response.ok) {
            document.getElementById("spinner").style.display = "none";
            window.location.href = '/';
        } else {
            document.getElementById("spinner").style.display = "none";
            const errorDetails = JSON.parse(await response.text()).message;
            document.getElementById("montrer_erreur").innerText = errorDetails;
        }

    });
}

