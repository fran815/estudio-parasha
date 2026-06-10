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

    const word = data.items[2].name.he;

    return word;
}


async function cargarParashaYVersiculos() {
    const { start, end, diaActual } = obtenerRangoSemanaActual();
    
    // Construimos la URL de manera dinámica para la semana en curso
    const url = `https://www.hebcal.com/leyning?cfg=json&start=${start}&end=${end}`;
    const response = await fetch(url);
    const data = await response.json();

    const dayList = ["יּוֹם רִאשׁוֹן", "יּוֹם שֵׁנִי", "יּוֹם שְׁלִישִׁי", "יּוֹם רְבִיעִי", "יּוֹם חֲמִישִׁי", "יּוֹם שִׁשִּׁי(6", "שַׁבָּת"]
    const seferTora = ["בְּרֵאשִׁית","שְׁמוֹת","וַיִּקְרָא","בְּמִדְבַּר","דְּבָרִים"]
    const torahBooks = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"]
    const endVerse = document.getElementById('to-list').textContent
    // INDEX FOR ENGLISH NAME TO HEBREW
    const englishIndex = torahBooks.indexOf(data.items[2].fullkriyah[1].k);
    
    // JEWISH DATE
    document.getElementById('heb-date').textContent = data.items[2].hdate;

    document.getElementById('parasha-name').textContent = data.items[2].name.he;
    document.getElementById('book-name').textContent = seferTora[englishIndex];

    document.getElementById('weekdays').textContent = dayList[diaActual];
    document.getElementById('from-list').textContent = data.items[2].fullkriyah[diaActual+1].b;
    document.getElementById('to-list').textContent = data.items[2].fullkriyah[diaActual+1].e;

    // console.log(data.items[2].hdate)
}

// Ejecutar la función al cargar la página
window.onload = cargarParashaYVersiculos;