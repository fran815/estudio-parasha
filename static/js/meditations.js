import {enviarPalabra} from './parasha.js'

const getWord = enviarPalabra()

// Función para obtener las meditaciones
async function obtenerMeditacion() {
    const mediResponse = await fetch('/static/meditations.json');
    const meditData = await mediResponse.json();
    const newWord = await getWord;

    const analisis = meditData[newWord].analisis_reformado;
    const individual = meditData[newWord].aplicacion_individual;
    const social = meditData[newWord].aplicacion_social;

    document.getElementById('analisis').textContent = analisis;
    document.getElementById('invdividual').textContent = individual;
    document.getElementById('social').textContent = social;
}

obtenerMeditacion()