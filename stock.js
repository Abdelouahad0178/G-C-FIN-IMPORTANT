document.addEventListener('DOMContentLoaded', loadStocks);
const stockList = document.getElementById('stockList');

function renderStocks(stocks) {
    stockList.innerHTML = '';
    stocks.forEach(stock => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${stock.name}</td>
            <td>${stock.quantity}</td>
        `;
        stockList.appendChild(tr);
    });
}

function getStocks() {
    const stocks = localStorage.getItem('stocks');
    return stocks ? JSON.parse(stocks) : [];
}

function loadStocks() {
    const stocks = getStocks();
    renderStocks(stocks);
}

// Function to update stocks from other pages
function updateStocksFromStorage() {
    const purchases = getPurchases();
    const sales = getSales();
    let stockMap = {};

    // Update stock based on purchases
    purchases.forEach(purchase => {
        if (!stockMap[purchase.name]) {
            stockMap[purchase.name] = 0;
        }
        stockMap[purchase.name] += parseInt(purchase.quantity);
    });

    // Update stock based on sales
    sales.forEach(sale => {
        if (!stockMap[sale.name]) {
            stockMap[sale.name] = 0;
        }
        stockMap[sale.name] -= parseInt(sale.quantity);
    });

    // Convert stock map to array and save to localStorage
    const stocks = Object.keys(stockMap).map(name => ({
        name,
        quantity: stockMap[name]
    }));

    saveStocks(stocks);
    renderStocks(stocks);
}

function saveStocks(stocks) {
    localStorage.setItem('stocks', JSON.stringify(stocks));
}

function getPurchases() {
    const purchases = localStorage.getItem('purchases');
    return purchases ? JSON.parse(purchases) : [];
}

function getSales() {
    const sales = localStorage.getItem('sales');
    return sales ? JSON.parse(sales) : [];
}

// Update stocks on page load
updateStocksFromStorage();
