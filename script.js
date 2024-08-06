document.getElementById('achatLink').addEventListener('click', () => loadPage('achat.html'));
document.getElementById('venteLink').addEventListener('click', () => loadPage('vente.html'));
document.getElementById('stockLink').addEventListener('click', () => loadPage('stock.html'));

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            const script = document.createElement('script');
            script.src = page.replace('.html', '.js');
            document.body.appendChild(script);
        });
}
