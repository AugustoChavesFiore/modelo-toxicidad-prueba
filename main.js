const text = document.getElementById('text');
const button = document.getElementById('analyze');
const predictions = document.getElementById('predictions');
const loader = document.getElementById('loader');

const threshold = 0.8;


// async function toxicidad(texto) {
//     try {
//     const model = await toxicity.load(threshold);
//     const predictions = await model.classify(texto);
//     console.log(predictions);
//     return predictions;
        
//     } catch (error) {
//         return error;
//     };

// };


async function toxicidad(texto) {
    try {
        const res = await fetch('http://localhost:3000/toxicity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto, threshold })
        });
        const data = await res.json();
        return data;
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

button.addEventListener('click', async () => {
    if (!text.value) {
        alert('Por favor, ingrese un texto');
        return;
    };
    predictions.innerHTML = '';
    button.disabled = true;
    button.textContent = 'Analizando...';
    const texto = text.value;
    const textArray = texto.split(',');
    console.log(textArray);
    const predicciones = await toxicidad(textArray);
    if (predicciones instanceof Error) {
        predictions.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${predicciones.message}
        </div>
        `;
        button.disabled = false;
        button.textContent = 'Analizar';
        return;
    };
    
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