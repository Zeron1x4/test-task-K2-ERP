const clientForm = document.querySelector('#client-form')

if (clientForm) {
    clientForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const messageElement = document.querySelector('#completed');

        const clientData = {
            name: nameInput.value,
            email: emailInput.value
        };

        try {
            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clientData)
            });

            const result = await response.json();

            messageElement.textContent = result.message;

            if (!response.ok) {
                return;
            }
            clientForm.reset();
        } catch (error) {
            messageElement.textContent = "Не вдалося з'єднатися із сервером";
        }
    })
}