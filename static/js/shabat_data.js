fetch('https://www.hebcal.com/shabbat?cfg=i2&zip=85145&ue=off&b=20&M=on&lg=es&tgt=_top')
.then(response => response.text())
.then(data => {
    const contenedor = document.getElementById('hebcal-shabbat');
    contenedor.innerHTML = data;
    
    // Busca el tercer elemento <li> dentro del contenedor y lo borra
    const tercerPunto = contenedor.querySelector('li:nth-of-type(3)');
    const cuartoPunto = contenedor.querySelector('li:nth-of-type(2)');
    const candlesLista = document.querySelector('.candles');
    const havdalahLista = document.querySelector('.havdalah');

    if (tercerPunto) {
        tercerPunto.remove();
    }
    if (cuartoPunto) {
        cuartoPunto.remove();
    }
    if (candlesLista) {
        // Buscamos el tag strong que contiene la hora
        const etiquetaHora = candlesLista.querySelector('strong');
        
        if (etiquetaHora) {
            const horaTexto = etiquetaHora.textContent; // Extrae "7:13pm"
            
            // Reemplazamos todo el contenido del li por el formato limpio
            candlesLista.innerHTML = `<strong>${horaTexto}</strong>`;
        }
    }
    if (havdalahLista) {
        // Buscamos el tag strong que contiene la hora
        const etiquetaHavdalah = havdalahLista.querySelector('strong');
        
        if (etiquetaHavdalah) {
            const horaTexto = etiquetaHavdalah.textContent; // Extrae "7:13pm"
            
            // Reemplazamos todo el contenido del li por el formato limpio
            havdalahLista.innerHTML = `<strong>Havdalah</strong>:<br><strong>${horaTexto}</strong>`;
        }
    }
});