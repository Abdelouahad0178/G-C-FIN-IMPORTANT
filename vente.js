document.addEventListener('DOMContentLoaded', loadSales);
const form = document.getElementById('saleForm');
const saleList = document.getElementById('saleList');
const submitBtn = document.getElementById('submitBtn');
let isEditing = false;

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('saleName').value;
    const quantity = document.getElementById('saleQuantity').value;
    const price = document.getElementById('salePrice').value;
    const id = document.getElementById('saleId').value;

    if (isEditing) {
        updateSale(id, name, quantity, price);
    } else {
        addSale(name, quantity, price);
    }

    form.reset();
    submitBtn.textContent = 'Ajouter à la liste';
    isEditing = false;
}

function addSale(name, quantity, price) {
    const sale = {
        name,
        quantity,
        price,
        id: Date.now()
    };

    const sales = getSales();
    sales.push(sale);
    saveSales(sales);
    updateStock(name, quantity, 'subtract');
    renderSales(sales);
}

function updateSale(id, name, quantity, price) {
    const sales = getSales();
    const index = sales.findIndex(sale => sale.id == id);
    if (index !== -1) {
        sales[index] = { id: Number(id), name, quantity, price };
        saveSales(sales);
        renderSales(sales);
    }
}

function renderSales(sales) {
    saleList.innerHTML = '';
    sales.forEach(sale => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sale.name}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price}</td>
            <td>
                <button onclick="editSale(${sale.id})">Modifier</button>
                <button onclick="removeSale(${sale.id})">Supprimer</button>
            </td>
        `;
        saleList.appendChild(tr);
    });
}

function getSales() {
    const sales = localStorage.getItem('sales');
    return sales ? JSON.parse(sales) : [];
}

function saveSales(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

function loadSales() {
    const sales = getSales();
    renderSales(sales);
}

function editSale(id) {
    const sales = getSales();
    const sale = sales.find(sale => sale.id == id);
    if (sale) {
        document.getElementById('saleId').value = sale.id;
        document.getElementById('saleName').value = sale.name;
        document.getElementById('saleQuantity').value = sale.quantity;
        document.getElementById('salePrice').value = sale.price;
        submitBtn.textContent = 'Modifier le produit';
        isEditing = true;
    }
}

function removeSale(id) {
    const sales = getSales();
    const sale = sales.find(sale => sale.id == id);
    if (sale) {
        updateStock(sale.name, sale.quantity, 'add');
    }
    const newSales = sales.filter(sale => sale.id !== id);
    saveSales(newSales);
    renderSales(newSales);
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
    } else if (action === 'subtract') {
        stocks.push({ name, quantity: -parseInt(quantity) });
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
