const tabButton = document.querySelectorAll('[data-tab]')
const section = document.querySelectorAll('.ria-section')

tabButton.forEach(function(button){
    button.addEventListener('click', function() {
        const targetId = button.dataset.tab;

        section.forEach(function (section) {
            section.hidden = section.id !== targetId;
        })
    })
})

const clientForm = document.querySelector("#client-form");
const clientMessage = document.querySelector("#client-message");
const clientsTableBody = document.querySelector("#clients-table-body");
const orderClientSelect = document.querySelector("#order-client");

clientForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.querySelector("#client-name");
    const emailInput = document.querySelector("#client-email");

    const clientData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };

    clientMessage.textContent = "";

    try {
        const response = await fetch("/api/clients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clientData)
        });

        const result = await response.json();

        clientMessage.textContent = result.message;

        if (!response.ok) {
            return;
        }

        addClientToTable(result.client);
        addClientToOrderSelect(result.client);

        clientForm.reset();
    } catch (error) {
        console.error(error);
        clientMessage.textContent = error.message;
    }
});


function addClientToTable(client) {
    const row = document.createElement("tr");

    row.dataset.clientId = client.id;

    row.innerHTML = `
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.email}</td>
    `;

    clientsTableBody.prepend(row);
}

function addClientToOrderSelect(client) {
    const orderClientSelect = document.querySelector("#order-client");

    const option = document.createElement("option");

    option.value = client.id;
    option.textContent = client.name;

    orderClientSelect.append(option);
}

const productForm = document.querySelector("#product-form");
const productMessage = document.querySelector("#product-message");
const productsTableBody = document.querySelector("#products-table-body");
const orderProductSelect = document.querySelector("#order-product");

productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.querySelector("#product-name");
    const priceInput = document.querySelector("#product-price");
    const quantityInput = document.querySelector("#product-quantity");

    const productData = {
        name: nameInput.value.trim(),
        price: Number(priceInput.value),
        quantity: Number(quantityInput.value)
    };

    productMessage.textContent = "";

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        productMessage.textContent = result.message;

        if (!response.ok) {
            return;
        }

        addProductToTable(result.product);
        addProductToOrderSelect(result.product);

        productForm.reset();
    } catch (error) {
        productMessage.textContent =
            "Не вдалося з’єднатися із сервером";
    }
});

function addProductToTable(product) {
    const row = document.createElement("tr");

    row.dataset.productId = product.id;

    row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price} грн</td>
        <td class="product-stock">${product.quantity}</td>
    `;

    productsTableBody.prepend(row);
}

function addProductToOrderSelect(product) {
    const option = document.createElement("option");

    option.value = product.id;
    option.dataset.stock = product.quantity;

    option.textContent =
        `${product.name} — ${product.price} грн, ` +
        `залишок: ${product.quantity}`;

    orderProductSelect.append(option);
}

const orderForm = document.querySelector("#order-form");
const orderMessage = document.querySelector("#order-message");
const ordersTableBody = document.querySelector("#orders-table-body");

orderForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const clientInput = document.querySelector("#order-client");
    const productInput = document.querySelector("#order-product");
    const quantityInput = document.querySelector("#order-quantity");

    const orderData = {
        client_id: Number(clientInput.value),
        product_id: Number(productInput.value),
        quantity: Number(quantityInput.value)
    };

    orderMessage.textContent = "";

    try {
        const response = await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        orderMessage.textContent = result.message;

        if (!response.ok) {
            return;
        }

        addOrderToTable(result.order);
        updateProductStock(result.order);

        orderForm.reset();
    } catch (error) {
        orderMessage.textContent =
            "Не вдалося з’єднатися із сервером";
    }
});

function addOrderToTable(order) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.client_name}</td>
        <td>${order.product_name}</td>
        <td>${order.quantity}</td>
        <td>${order.total_price} грн</td>
    `;

    ordersTableBody.prepend(row);
}

function updateProductStock(order) {
    const productRow = document.querySelector(
        `[data-product-id="${order.product_id}"]`
    );

    if (productRow) {
        const stockCell = productRow.querySelector(".product-stock");

        stockCell.textContent = order.product_stock;
    }

    const productOption = orderProductSelect.querySelector(
        `option[value="${order.product_id}"]`
    );

    if (productOption) {
        productOption.dataset.stock = order.product_stock;

        productOption.textContent =
            `${order.product_name} — ${order.price} грн, ` +
            `залишок: ${order.product_stock}`;
    }
}
