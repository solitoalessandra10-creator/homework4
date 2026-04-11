let chart;

document.getElementById("btnGenera").onclick = simula;
document.getElementById("btnReset").onclick = reset;

function simula() {
    const n = parseInt(document.getElementById("passi").value);
    const T = parseFloat(document.getElementById("tempo").value);

    const dt = T / n;

    let x = 0;
    let tempi = [0];
    let valori = [0];

    let plus = 0;
    let minus = 0;

    // Random Walk con Rademacher
    for (let i = 1; i <= n; i++) {
        let step = Math.random() < 0.5 ? -1 : 1;

        if (step === 1) plus++;
        else minus++;

        x += step / Math.sqrt(n);

        tempi.push(i * dt);
        valori.push(x);
    }

    disegnaGrafico(tempi, valori);
    aggiornaStats(n, T, x, plus, minus);
}

function disegnaGrafico(tempi, valori) {
    const ctx = document.getElementById("grafico").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tempi,
            datasets: [{
                label: 'Random Walk scalata',
                data: valori,
                borderColor: 'green',
                borderWidth: 2,
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
    x: {
        title: {
            display: true,
            text: 'Tempo'
        },
        grid: { display: true },
        ticks: {
            callback: function(value, index) {
                return tempi[index].toFixed(3);
            }
        }
    },
        }
    });
}

function aggiornaStats(n, T, finale, plus, minus) {
    document.getElementById("stats").innerHTML = `
        <p><b>n:</b> ${n}</p>
        <p><b>T:</b> ${T.toFixed(2)}</p>
        <p><b>Valore finale RW scalata:</b> ${finale.toFixed(4)}</p>
        <p><b>Passi +1:</b> ${plus}</p>
        <p><b>Passi -1:</b> ${minus}</p>
    `;
}

function reset() {
    if (chart) chart.destroy();
    document.getElementById("stats").innerHTML = "";
}
