let chart; // Variabile globale per il grafico

function boxMullerTransform() {
    // Genera una variabile casuale con distribuzione Normale Standard N(0,1)
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

function generaSimulazione() {
    // 1. Recupero parametri
    const x0 = parseFloat(document.getElementById('x0').value);
    const T = parseFloat(document.getElementById('T').value);
    const n = parseInt(document.getElementById('steps').value);
    const mu = parseFloat(document.getElementById('mu').value);
    const sigma = parseFloat(document.getElementById('sigma').value);

    const dt = T / n;
    let currentX = x0;
    
    const dataPoints = [x0];
    const labels = [0];

    // 2. Calcolo percorso ABM
    for (let i = 1; i <= n; i++) {
        const dz = boxMullerTransform();
        // Formula: X_new = X_old + mu*dt + sigma*sqrt(dt)*Z
        currentX = currentX + (mu * dt) + (sigma * Math.sqrt(dt) * dz);
        
        dataPoints.push(currentX);
        labels.push((i * dt).toFixed(2));
    }

    // 3. Statistiche
    const minVal = Math.min(...dataPoints).toFixed(3);
    const maxVal = Math.max(...dataPoints).toFixed(3);
    const finalVal = dataPoints[dataPoints.length - 1].toFixed(3);

    document.getElementById('results').innerHTML = `
        <strong>Risultati:</strong><br>
        X₀: ${x0}<br>
        Valore finale: ${finalVal}<br>
        Min: ${minVal}<br>
        Max: ${maxVal}
    `;

    // 4. Rendering Grafico
    renderChart(labels, dataPoints);
}

function renderChart(labels, data) {
    const ctx = document.getElementById('abmChart').getContext('2d');
    
    if (chart) { chart.destroy(); } // Distruggi grafico precedente

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Percorso ABM',
                data: data,
                borderColor: '#1e88e5',
                borderWidth: 2,
                pointRadius: 0, // Nasconde i pallini per un effetto linea fluida
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Tempo (Anni)' } },
                y: { title: { display: true, text: 'Valore X' } }
            }
        }
    });
}

function resetSimulazione() {
    if (chart) chart.destroy();
    document.getElementById('results').innerHTML = "";
    // Opzionale: reset input ai valori di default
}
