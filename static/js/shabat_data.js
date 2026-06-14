function getShabbatHour() {
    fetch('https://www.hebcal.com/shabbat?cfg=i2&zip=85145&ue=off&b=20&M=on&lg=es&tgt=_top')
    .then(response => response.text())
    .then(data => {

        const contenedor = document.getElementById('hebcal-shabbat');
        contenedor.innerHTML = data;

        const ulList = contenedor.querySelector('ul');
        
        // 2. Conviertes sus hijos (HTMLCollection) en un Array real
        const listaArray = Array.from(ulList.children);

        // 3. Aplicas el .forEach()
        listaArray.forEach((li) => {
            if (li.classList.contains('candles')) {
                const getHour = li.querySelector('strong');
                const shabbatHour = getHour.textContent;
                contenedor.innerHTML = shabbatHour;
            }
        });

    });
}

getShabbatHour();