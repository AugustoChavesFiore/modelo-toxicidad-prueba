// modelo de toxicidad TFjs
const text = document.getElementById('text');
const button = document.getElementById('analyze');
const predictions = document.getElementById('predictions');
const loader = document.getElementById('loader');

const threshold = 0.9;


async function toxicidad(texto) {
    
    const model = await toxicity.load(threshold);
    const predictions = await model.classify(texto);
    console.log(predictions);
    return predictions;

};

button.addEventListener('click', async () => {
    if (!text.value) {
        alert('Por favor, ingrese un texto');
        return;
    };
    predictions.innerHTML = '';
    button.disabled = true;
    button.textContent = 'Analizando...';
    loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

    const texto = text.value;
    const predicciones = await toxicidad(texto);
    console.log(predicciones);
    loader.innerHTML = '';
    button.disabled = false;
    button.textContent = 'Analizar';
    let html = '';
    predicciones.forEach((prediction) => {
        html += `
        <div class="card col-6" >
            <div class="card-body">
            <h5 class="card-title">${prediction.label}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${prediction.results[0].match  ? "Verdadero" : prediction.results[0].match == null? "Indeciso" : "Falso" } </h6>
            <p class="card-text">
            ${(prediction.results[0].probabilities[0] * 100).toFixed(2)}% de probabilidad de no ser ${prediction.label}
            </p>
            <p class="card-text">
            ${(prediction.results[0].probabilities[1] * 100).toFixed(2)}% de probabilidad de ser ${prediction.label}
            </p>
            </div>
      </div>
        `;
    });
    predictions.innerHTML = html;
});