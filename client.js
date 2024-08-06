document.addEventListener('DOMContentLoaded', function() {
    loadClients();

    document.getElementById('showFormButton').addEventListener('click', function() {
        document.getElementById('clientFormSection').style.display = 'block';
        this.style.display = 'none';
    });

    document.getElementById('clientForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientName = document.getElementById('clientName').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const clientInvoiceNumber = document.getElementById('clientInvoiceNumber').value;
        const clientInvoiceDate = document.getElementById('clientInvoiceDate').value;
        const clientAmount = parseFloat(document.getElementById('clientAmount').value);
        const clientPaymentAmount = parseFloat(document.getElementById('clientPaymentAmount').value);

        const client = {
            id: Date.now(),
            name: clientName,
            phone: clientPhone,
            invoiceNumber: clientInvoiceNumber,
            invoiceDate: clientInvoiceDate,
            amount: clientAmount,
            paymentAmount: clientPaymentAmount
        };

        saveClient(client);
        addClientToTable(client);
        document.getElementById('clientForm').reset();
        document.getElementById('clientFormSection').style.display = 'none';
        document.getElementById('showFormButton').style.display = 'block';
    });

    document.getElementById('searchBox').addEventListener('input', function(e) {
        const searchValue = e.target.value.toLowerCase();
        filterClients(searchValue);
    });
});

function saveClient(client) {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
}

function loadClients() {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.forEach(addClientToTable);
}

function addClientToTable(client) {
    const table = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.setAttribute('data-id', client.id);
    
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);
    const cell8 = newRow.insertCell(7);
    
    cell1.textContent = client.name;
    cell1.setAttribute('data-label', 'Nom');
    cell2.textContent = client.phone;
    cell2.setAttribute('data-label', 'Téléphone');
    cell3.innerHTML = `<a href="#" onclick="showPopup('${client.invoiceNumber}', ${client.amount.toFixed(2)}, ${client.paymentAmount.toFixed(2)}, ${(client.amount - client.paymentAmount).toFixed(2)})">${client.invoiceNumber}</a>`;
    cell3.setAttribute('data-label', 'N° de Facture');
    cell4.textContent = client.invoiceDate;
    cell4.setAttribute('data-label', 'Date de Facture');
    cell5.textContent = client.amount.toFixed(2);
    cell5.setAttribute('data-label', 'Montant Facture');
    cell6.textContent = client.paymentAmount.toFixed(2);
    cell6.setAttribute('data-label', 'Montant Réglé');
    cell7.textContent = (client.amount - client.paymentAmount).toFixed(2);
    cell7.setAttribute('data-label', 'Solde Restant');

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => editClient(client.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteClient(client.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    cell8.appendChild(actionsDiv);
}

function editClient(id) {
    const clients = JSON.parse(localStorage.getItem('clients'));
    const client = clients.find(c => c.id === id);

    document.getElementById('clientName').value = client.name;
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientInvoiceNumber').value = client.invoiceNumber;
    document.getElementById('clientInvoiceDate').value = client.invoiceDate;
    document.getElementById('clientAmount').value = client.amount;
    document.getElementById('clientPaymentAmount').value = client.paymentAmount;

    deleteClient(id);
    document.getElementById('clientFormSection').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'none';
}

function deleteClient(id) {
    let clients = JSON.parse(localStorage.getItem('clients'));
    clients = clients.filter(client => client.id !== id);
    localStorage.setItem('clients', JSON.stringify(clients));
    document.querySelector(`tr[data-id="${id}"]`).remove();
}

function filterClients(searchValue) {
    const rows = document.querySelectorAll('#clientsTable tbody tr');
    let totalAmount = 0;
    let totalBalance = 0;
    let rowCount = 0;

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        if (name.includes(searchValue)) {
            row.style.display = '';
            totalAmount += parseFloat(row.cells[4].textContent);
            totalBalance += parseFloat(row.cells[6].textContent);
            rowCount++;
        } else {
            row.style.display = 'none';
        }
    });

    const totalAmountElement = document.getElementById('totalAmount');
    const totalBalanceElement = document.getElementById('totalBalance');
    if (searchValue === '' || rowCount === 0) {
        totalAmountElement.textContent = '';
        totalBalanceElement.textContent = '';
    } else {
        totalAmountElement.textContent = `MONTANT TOTAL = ${totalAmount.toFixed(2)}`;
        totalBalanceElement.textContent = `SOLDE RESTANT TOTAL = ${totalBalance.toFixed(2)}`;
    }
}

function showPopup(invoiceNumber, amount, paymentAmount, balance) {
    document.getElementById('popupInvoiceNumber').textContent = `N° de Facture: ${invoiceNumber}`;
    document.getElementById('popupAmount').textContent = `Montant Facture: ${amount.toFixed(2)}`;
    document.getElementById('popupPaymentAmount').textContent = `Montant Réglé: ${paymentAmount.toFixed(2)}`;
    document.getElementById('popupBalance').textContent = `Solde Restant: ${balance.toFixed(2)}`;
    document.getElementById('popup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
