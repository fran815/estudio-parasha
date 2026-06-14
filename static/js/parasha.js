// Función para obtener las fechas de la semana actual (de domingo a sábado)
function obtenerRangoSemanaActual() {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0: Domingo, 1: Lunes, etc.
    
    const inicio = new Date(hoy);
    inicio.setDate(hoy.getDate() - diaSemana); // Mover al domingo actual
    
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6); // Mover al sábado actual

    const formatearFecha = (d) => d.toISOString().split('T')[0];
    
    return {
        start: formatearFecha(inicio),
        end: formatearFecha(fin),
        diaActual: diaSemana
    };
}

export async function enviarPalabra() {
    const { start, end, diaActual } = obtenerRangoSemanaActual();
    
    // Construimos la URL de manera dinámica para la semana en curso
    const url = `https://www.hebcal.com/leyning?cfg=json&start=${start}&end=${end}`;
    const response = await fetch(url);
    const data = await response.json();
    const getListLength = data.items.length
    const lastNum = getListLength - 1

    const word = data.items[lastNum].name.he;

    return word;
}


async function cargarParashaYVersiculos() {
    const { start, end, diaActual } = obtenerRangoSemanaActual();
    
    // Construimos la URL de manera dinámica para la semana en curso
    const url = `https://www.hebcal.com/leyning?cfg=json&start=${start}&end=${end}`;
    const response = await fetch(url);
    const data = await response.json();
    const getListLength = data.items.length

    const lastNum = getListLength - 1
    
    const dayList = ["יּוֹם רִאשׁוֹן", "יּוֹם שֵׁנִי", "יּוֹם שְׁלִישִׁי", "יּוֹם רְבִיעִי", "יּוֹם חֲמִישִׁי", "יּוֹם שִׁשִּׁי", "שַׁבָּת"]
    const seferTora = ["בְּרֵאשִׁית","שְׁמוֹת","וַיִּקְרָא","בְּמִדְבַּר","דְּבָרִים"]
    const torahBooks = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"]
    const endVerse = document.getElementById('to-list').textContent
    // INDEX FOR ENGLISH NAME TO HEBREW
    const englishIndex = torahBooks.indexOf(data.items[lastNum].fullkriyah[1].k);
    
    // JEWISH DATE
    document.getElementById('heb-date').textContent = data.items[lastNum].hdate;

    document.getElementById('parasha-name').textContent = data.items[lastNum].name.he;
    document.getElementById('book-name').textContent = seferTora[englishIndex];

    document.getElementById('weekdays').textContent = dayList[diaActual];
    document.getElementById('from-list').textContent = data.items[lastNum].fullkriyah[diaActual+1].b;
    document.getElementById('to-list').textContent = data.items[lastNum].fullkriyah[diaActual+1].e;

    // VARIABLES FOR GEMINI
    const fromVerse = data.items[lastNum].fullkriyah[diaActual+1].b;
    const untilVerse = data.items[lastNum].fullkriyah[diaActual+1].e;
    const bookName = data.items[lastNum].name.he;

    const idReading = `${bookName} ${fromVerse}-${untilVerse}`;
    obtenerAnalisisDeGemini(idReading);
    // console.log(data.items)
}

async function obtenerAnalisisDeGemini(idRead) {
    try {
        // Enviamos el ID de la lectura a nuestra propia ruta de Flask
        const response = await fetch('/obtener-analisis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idRead: idRead })
        });

        const data = await response.json();
        
        // Colocamos el análisis en un elemento de tu HTML (asegúrate de crear este id en tu HTML)
        document.getElementById('analisis').textContent = data.perspectiva_reformada;
        document.getElementById('invdividual').textContent = data.aplicacion_individual;
        document.getElementById('social').textContent = data.aplicacion_social;

    } catch (error) {
        console.error("Error al obtener el análisis:", error);
        document.getElementById('analisis-gemini').textContent = "No se pudo cargar el análisis en este momento.";
    }
}

// Ejecutar la función al cargar la página
window.onload = cargarParashaYVersiculos;