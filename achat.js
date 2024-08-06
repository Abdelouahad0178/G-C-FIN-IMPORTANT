document.addEventListener('DOMContentLoaded', loadPurchases);
const form = document.getElementById('purchaseForm');
const itemList = document.getElementById('itemList');
const submitBtn = document.getElementById('submitBtn');
let isEditing = false;

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('itemQuantity').value;
    const price = document.getElementById('itemPrice').value;
    const id = document.getElementById('itemId').value;

    if (isEditing) {
        updatePurchase(id, name, quantity, price);
    } else {
        addPurchase(name, quantity, price);
    }

    form.reset();
    submitBtn.textContent = 'Ajouter à la liste';
    isEditing = false;
}

function addPurchase(name, quantity, price) {
    const purchase = {
        name,
        quantity,
        price,
        id: Date.now()
    };

    const purchases = getPurchases();
    purchases.push(purchase);
    savePurchases(purchases);
    updateStock(name, quantity, 'add');
    renderPurchases(purchases);
}

function updatePurchase(id, name, quantity, price) {
    const purchases = getPurchases();
    const index = purchases.findIndex(purchase => purchase.id == id);
    if (index !== -1) {
        purchases[index] = { id: Number(id), name, quantity, price };
        savePurchases(purchases);
        renderPurchases(purchases);
    }
}

function renderPurchases(purchases) {
    itemList.innerHTML = '';
    purchases.forEach(purchase => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${purchase.name}</td>
            <td>${purchase.quantity}</td>
            <td>${purchase.price}</td>
            <td>
                <button onclick="editPurchase(${purchase.id})">Modifier</button>
                <button onclick="removePurchase(${purchase.id})">Supprimer</button>
            </td>
        `;
        itemList.appendChild(tr);
    });
}

function getPurchases() {
    const purchases = localStorage.getItem('purchases');
    return purchases ? JSON.parse(purchases) : [];
}

function savePurchases(purchases) {
    localStorage.setItem('purchases', JSON.stringify(purchases));
}

function loadPurchases() {
    const purchases = getPurchases();
    renderPurchases(purchases);
}

function editPurchase(id) {
    const purchases = getPurchases();
    const purchase = purchases.find(purchase => purchase.id == id);
    if (purchase) {
        document.getElementById('itemId').value = purchase.id;
        document.getElementById('itemName').value = purchase.name;
        document.getElementById('itemQuantity').value = purchase.quantity;
        document.getElementById('itemPrice').value = purchase.price;
        submitBtn.textContent = 'Modifier l\'article';
        isEditing = true;
    }
}

function removePurchase(id) {
    const purchases = getPurchases();
    const purchase = purchases.find(purchase => purchase.id == id);
    if (purchase) {
        updateStock(purchase.name, purchase.quantity, 'subtract');
    }
    const newPurchases = purchases.filter(purchase => purchase.id !== id);
    savePurchases(newPurchases);
    renderPurchases(newPurchases);
}

function updateStock(name, quantity, action) {
    const stocks = getStocks();
    const stockItem = stocks.find(stock => stock.name === name);
    if (stockItem) {
        if (action === 'add') {
            stockItem.quantity += parseInt(quantity);
        } else if (action === 'subtract') {
            stockItem.quantity -= parseInt(quantity);
        }
    } else if (action === 'add') {
        stocks.push({ name, quantity: parseInt(quantity) });
    }
    saveStocks(stocks);
}

function getStocks() {
    const stocks = localStorage.getItem('stocks');
    return stocks ? JSON.parse(stocks) : [];
}

function saveStocks(stocks) {
    localStorage.setItem('stocks', JSON.stringify(stocks));
}
