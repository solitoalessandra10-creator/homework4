let chart;

// Aspetta che il DOM sia caricato
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnGenera").onclick = simula;
    document.getElementById("btnReset").onclick = reset;
});

function simula() {
    const n = parseInt(document.getElementById("passi").value);
    const T = parseFloat(document.getElementById("tempo").value);

    if (isNaN(n) || isNaN(T)) {
        alert("Inserisci numeri validi");
        return;
    }

    const dt = T / n;
    let x = 0;
    let tempi = [0];
    let valori = [0];

    let plus = 0;
    let minus = 0;

    // Random Walk con Rademacher (Approssimazione Moto Browniano)
    for (let i = 1; i <= n; i++) {
        let step = Math.random() < 0.5 ? -1 : 1;

        if (step === 1) plus++;
        else minus++;

        // Scaling corretto per convergere al moto browniano: 1/sqrt(n)
        x += step / Math.sqrt(n);

        tempi.push(Number((i * dt).toFixed(4)));
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
                borderColor: '#800000',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Tempo (t)' },
                    ticks: {
                        maxTicksLimit: 10 // Evita di affollare l'asse X
                    }
                },
                y: {
                    title: { display: true, text: 'W(t)' }
                }
            }
        }
    });
}

function aggiornaStats(n, T, finale, plus, minus) {
    document.getElementById("stats").innerHTML = `
        <p><b>n:</b> ${n}</p>
        <p><b>T:</b> ${T.toFixed(2)}</p>
        <p><b>Valore finale W(T):</b> ${finale.toFixed(4)}</p>
        <p><b>Passi +1:</b> ${plus}</p>
        <p><b>Passi -1:</b> ${minus}</p>
    `;
}

function reset() {
    if (chart) chart.destroy();
    document.getElementById("stats").innerHTML = "";
    document.getElementById("passi").value = 1000;
    document.getElementById("tempo").value = 1;
}
