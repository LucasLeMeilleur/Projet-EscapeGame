if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        document.getElementById("spinner").style.display = "block";
        const formDataConfig = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
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



if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        document.getElementById("spinner").style.display = "block";
        const formDataConfig = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));

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

