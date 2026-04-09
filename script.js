let chart;

function randomNormal() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function simulate() {
    const x0 = parseFloat(document.getElementById("x0").value);
    const mu = parseFloat(document.getElementById("mu").value);
    const sigma = parseFloat(document.getElementById("sigma").value);
    const steps = parseInt(document.getElementById("steps").value);

    const T = 1;
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

    drawChart(labels, values);
}

function drawChart(labels, data) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'ABM',
                data: data,
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function resetChart() {
    // cancella grafico
    if (chart) {
        chart.destroy();
        chart = null;
    }

    // reset input ai valori default
    document.getElementById("x0").value = 100;
    document.getElementById("mu").value = 0.05;
    document.getElementById("sigma").value = 0.2;
    document.getElementById("steps").value = 250;
}
