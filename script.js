let x = 1000;
let valori = [x];
let sequenza = [];
let interval = null;

// Parametri ABM
let mu = 0.1;
let sigma = 2;
let T = 1;

let N = 100;      // numero totale passi (utente)
let dt = T / N;
let stepCorrente = 0;

// Generatore gaussiano
function randomNormale() {
    let u1 = Math.random();
    let u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Imposta numero passi scelto dall’utente
function impostaPassi() {
    N = parseInt(document.getElementById("numPassi").value) || 100;
    dt = T / N;
}

function generaPasso() {

    if (stepCorrente >= N) {
        alert("Simulazione completata (1 anno)");
        return;
    }

    let Z = randomNormale();
    let salto = mu * dt + sigma * Math.sqrt(dt) * Z;

    sequenza.push(salto.toFixed(4));

    x = x + salto;
    valori.push(x);

    document.getElementById("sequenza").value += salto.toFixed(4) + "\n";
    document.getElementById("valori").value += x.toFixed(4) + "\n";

    stepCorrente++;

    disegna();
}

function autoRun() {
    if (interval) return;
    interval = setInterval(generaPasso, 100);
}

function stopRun() {
    clearInterval(interval);
    interval = null;
}

function reset() {
    clearInterval(interval);
    interval = null;

    x = 1000;
    valori = [x];
    sequenza = [];
    stepCorrente = 0;

    document.getElementById("sequenza").value = "";
    document.getElementById("valori").value = "";

    impostaPassi(); // aggiorna dt

    disegna();
}

function disegna() {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (valori.length < 2) return;

    let min = Math.min(...valori);
    let max = Math.max(...valori);

    let scalaX = canvas.width / (N); // ora basato su N (tempo totale)
    let scalaY = canvas.height / (max - min + 1);

    // 📈 DISEGNO CURVA
    ctx.beginPath();

    for (let i = 0; i < valori.length; i++) {
        let t = i * dt; // tempo reale
        let px = t * canvas.width; // mappa 0→1 su tutta la larghezza
        let py = canvas.height - (valori[i] - min) * scalaY;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }

    ctx.stroke();

    // 🧭 DISEGNO ASSE X (tempo)
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 1);
    ctx.lineTo(canvas.width, canvas.height - 1);
    ctx.stroke();

    // 🏷️ ETICHETTE TEMPO
    ctx.font = "12px Poppins";
    ctx.fillStyle = "black";

    let nTacche = 5; // numero di tacche sull'asse

    for (let i = 0; i <= nTacche; i++) {
        let t = i / nTacche; // frazione del tempo
        let x = t * canvas.width;

        // tacchetta
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - 5);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // etichetta (es: 0.00, 0.20, ..., 1.00)
        ctx.fillText(t.toFixed(2), x - 10, canvas.height - 10);
    }

    // 🏷️ titolo asse
    ctx.fillText("Tempo (anni)", canvas.width / 2 - 40, canvas.height - 25);
}
