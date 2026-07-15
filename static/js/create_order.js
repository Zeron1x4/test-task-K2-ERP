const orderForm = document.querySelector('#order-form')

if (orderForm) {
    orderForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const clientInput = document.querySelector('#order-client');
        const productInput = document.querySelector('#order-product');
        const quantityInput = document.querySelector('#order-quantity');
        const messageElement = document.querySelector('#order-success');

        const orderData = {
            client_id: Number(clientInput.value),
            product_id: Number(productInput.value),
            quantity: Number(quantityInput.value)
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })

            const result = await response.json()

            messageElement.textContent = result.message;

            if (!response.ok) {
                return;
            }
            orderForm.reset();
        } catch (error) {
            messageElement.textContent = "Не вдалося з'єднатися із сервером";
        }

    })
}