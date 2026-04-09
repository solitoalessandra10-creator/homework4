let chart;

function randomNormal() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function simulate() {
    const x0 = parseFloat(document.getElementById("x0").value);
    const T = parseFloat(document.getElementById("T").value);
    const mu = parseFloat(document.getElementById("mu").value);
    const sigma = parseFloat(document.getElementById("sigma").value);
    const steps = parseInt(document.getElementById("steps").value);

    const dt = T / steps;

    let values = [x0];
    let labels = [0];

    for (let i = 1; i <= steps; i++) {
        let prev = values[i - 1];
        let Z = randomNormal();

        let next = prev + mu * dt + sigma * Math.sqrt(dt) * Z;

        values.push(next);
        labels.push(i * dt);
    }

    // calcoli
    const finalValue = values[values.length - 1];
    const min = Math.min(...values);
    const max = Math.max(...values);

    // aggiorna risultati
    document.getElementById("res_x0").textContent = x0;
    document.getElementById("res_T").textContent = T;
    document.getElementById("res_steps").textContent = steps;
    document.getElementById("res_final").textContent = finalValue.toFixed(3);
    document.getElementById("res_min").textContent = min.toFixed(3);
    document.getElementById("res_max").textContent = max.toFixed(3);

    drawChart(labels, values);
}

function drawChart(labels, data) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ABM',
                data: data,
                borderWidth: 2,
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            responsive: true
        }
    });
}

function resetAll() {
    // reset input
    document.getElementById("x0").value = 1000;
    document.getElementById("T").value = 1;
    document.getElementById("steps").value = 100;
    document.getElementById("mu").value = 0.5;
    document.getElementById("sigma").value = 2;

    // reset risultati
    document.getElementById("res_x0").textContent = "-";
    document.getElementById("res_T").textContent = "-";
    document.getElementById("res_steps").textContent = "-";
    document.getElementById("res_final").textContent = "-";
    document.getElementById("res_min").textContent = "-";
    document.getElementById("res_max").textContent = "-";

    // cancella grafico
    if (chart) {
        chart.destroy();
        chart = null;
    }
}
