const productForm = document.querySelector('#product-form')

if (productForm) {
    productForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nameInput = document.querySelector('#name');
        const priceInput = document.querySelector('#price');
        const quantityInput = document.querySelector('#quantity');
        const messageElement = document.querySelector('#success-create-product')

        const productData = {
            name: nameInput.value,
            price: priceInput.value,
            quantity: quantityInput.value
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            messageElement.textContent = result.message;

            if (!response.ok) {
                return;
            }
            productForm.reset();
        }catch (error) {
            messageElement.textContent = "Не вдалося з'єднатися із сервером";
        }
    })
}