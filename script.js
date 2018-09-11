var pomeranjeAuta = 10,
    pozicijaHorizontalno = 220,
    auto = document.getElementById("car"),
    put = document.getElementById('road'),
    okolina = document.getElementById("landscape"),
    crash = document.getElementById("crash"),
    statusPoeni = document.getElementById("poeni"),
    statusZivoti = document.getElementById("zivoti"),
    statusNivo = document.getElementById("nivo"),
    newGameButton = document.getElementById("newGame"),
    scoresButton = document.getElementById("rezultati");
put.style.height = window.innerHeight + 'px';
put.style.position = 'relative';
put.style.overflow = "hidden";
auto.style.position = "absolute";
auto.style.top = (window.innerHeight / 4) * 3 + "px";
auto.style.left = pozicijaHorizontalno + "px";

document.body.addEventListener("keydown", carMoves);
newGameButton.addEventListener("click", function () {
    location.reload();
});
scoresButton.addEventListener("click", ispisiRezultate);

var igra, ucestalostEnemyAuta, brzina, score,
    poeni = 0,
    zivot = 3,
    brojacAutomobila = 0,
    nivo = 1;

kreirajJsonAkoNePostoji();
score = JSON.parse(localStorage.getItem("score"));
azurirajPoene();
provere();

var pocetak = prompt("Drive Safely! Enter your Name and Start the Game!");
console.log(pocetak);
if (pocetak == "") {
    pocetak = "unknown";
    zapocniIgru();
} else if (pocetak != null) {
    zapocniIgru();
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function zapocniIgru() {
    igra = setInterval(function () {
        ubaciAuto(brzina);
    }, ucestalostEnemyAuta);
    brzinaKretanjaOkoline(1e4);
}

function ubaciAuto(brzina) {
    provere();
    brojacAutomobila++;
    var enemyAuto = document.createElement("img");
    enemyAuto.setAttribute("src", "img/" + randomEnemyAuto() + ".png");
    enemyAuto.setAttribute("alt", "enemyCar");
    enemyAuto.setAttribute("id", "autoBroj" + brojacAutomobila);
    enemyAuto.style.position = "absolute";
    enemyAuto.style.left = randomPozicija(enemyAuto) + "px";
    put.appendChild(enemyAuto);
    var pozicija = 0 - enemyAuto.height;
    enemyAuto.style.top = pozicija + "px";

    function renderEnemyCar() {
        if (pozicija < innerHeight) {
            pozicija += brzina;
        }
        enemyAuto.style.top = pozicija + 'px';
        window.requestAnimationFrame(renderEnemyCar);
        proveriSudar(auto, document.getElementById("autoBroj" + brojacAutomobila));
        daLiJePoen(document.getElementById("autoBroj" + brojacAutomobila));
    }

    window.requestAnimationFrame(renderEnemyCar);
}

function provere() {
    if (zivot == 0) {
        alert("GAME OVER!\n" + pocetak + ": " + poeni);
        clearInterval(igra);
        sacuvajRezultat();
    }
    levelProperties();
}

function levelProperties() {
    if (nivo == 1) {
        brzina = 5;
        ucestalostEnemyAuta = 5000;
    }
    if (nivo == 2) {
        brzina = 5;
        ucestalostEnemyAuta = 4500;
    }
    if (nivo == 3) {
        brzina = 5;
        ucestalostEnemyAuta = 4000;
    }
    if (nivo == 4) {
        brzina = 5;
        ucestalostEnemyAuta = 3500;
    }
    if (nivo == 5) {
        brzina = 10;
        ucestalostEnemyAuta = 5000;
    }
    if (nivo == 6) {
        brzina = 10;
        ucestalostEnemyAuta = 4000;
    }
    if (nivo == 7) {
        brzina = 10;
        ucestalostEnemyAuta = 3000;
    }
    if (nivo == 8) {
        brzina = 10;
        ucestalostEnemyAuta = 3500;
    }
    if (nivo == 9) {
        brzina = 15;
        ucestalostEnemyAuta = 4000;
    }
    if (nivo == 10) {
        brzina = 15;
        ucestalostEnemyAuta = 2000;
    }
    if (nivo == 11) {
        clearInterval(igra);
        sacuvajRezultat();
        alert("END\n" + pocetak + ": " + poeni);
    }
}

function proveriSudar(car, enemy) {
    for (var positionCar in carPosition(car)) {
        for (var positionEnemy in carPosition(enemy)) {
            if (carPosition(car).top <= carPosition(enemy).bottom && carPosition(car).bottom >= carPosition(enemy).bottom &&
                ((carPosition(car).left <= carPosition(enemy).right && carPosition(car).right >= carPosition(enemy).right) ||
                    (carPosition(car).left <= carPosition(enemy).left && carPosition(car).right >= carPosition(enemy).left))) {
                put.removeChild(document.getElementById("autoBroj" + brojacAutomobila));
                zivot--;
                crash.style.visibility = "visible";
                provere();
                azurirajPoene();
                setTimeout(function () {
                    crash.style.visibility = "hidden";
                }, 800);
            }
        }
    }
}

function carPosition(car) {
    return {
        top: parseInt(car.style.top.replace("px", "")),
        left: parseInt(car.style.left.replace("px", "")),
        bottom: parseInt(car.style.top.replace("px", "")) + car.height,
        right: parseInt(car.style.left.replace("px", "")) + car.width
    }
}

function daLiJePoen(enemy) {
    if (carPosition(enemy).bottom > innerHeight - 5) {
        put.removeChild(enemy);
        poeni++;
        if (poeni > 0 && poeni % 10 == 0) {
            nivo++;
        }
        provere();
        azurirajPoene();
    }
}

function brzinaKretanjaOkoline(brzina) {
    put.style.animationDuration = brzina + "ms";
    okolina.style.animationDuration = brzina + "ms";
}

function randomPozicija() {
    return Math.floor(Math.random() * (put.offsetWidth - 50))
}

function randomEnemyAuto() {
    var boja = ["red", "blue", "green"];
    var randomBoja = Math.floor(Math.random() * boja.length);
    return boja[randomBoja];
}

function azurirajPoene() {
    statusZivoti.style.width = ((100 / 3) * zivot) + "%";
    statusZivoti.textContent = zivot;
    statusPoeni.style.width = (poeni * 1) + "%";
    statusPoeni.textContent = poeni;
    statusNivo.style.width = (10 * nivo) + "%";
    statusNivo.textContent = nivo;
}

function kreirajJsonAkoNePostoji() {
    if (JSON.parse(localStorage.getItem("score")) == null) {
        score = {};
        localStorage.setItem("score", JSON.stringify(score));
    } else {
        score = JSON.parse(localStorage.getItem("score"));
    }
}

function sacuvajRezultat() {
    if (poeni.toString().length == 1) { poeni = "00" + poeni }
    if (poeni.toString().length == 2) { poeni = "0" + poeni }
    score[new Date().getTime()] = [pocetak, poeni];
    localStorage.setItem("score", JSON.stringify(score));
}

function sortirajRezultate() {
    var nizRezultata = [];
    var rezultati = JSON.parse(localStorage.getItem("score"));
    for (var kljuc in rezultati) {
        nizRezultata.push((rezultati[kljuc][1] + ": " + rezultati[kljuc][0]));
    }
    nizRezultata = nizRezultata.sort().reverse();
    return nizRezultata;
}

function ispisiRezultate() {
    var nizZaIspisivanje = sortirajRezultate();
    var ispis = "";
    for (var i = 0; i < nizZaIspisivanje.length; i++) {
        ispis += (i + 1) + ". points / name : " + nizZaIspisivanje[i] + " \n ";
    }
    alert(ispis);
}

function carMoves(event) {
    if (event.keyCode === 37) {
        pozicijaHorizontalno === 0 ? pozicijaHorizontalno = 0 : pozicijaHorizontalno -= pomeranjeAuta;
    }
    if (event.keyCode === 39) {
        pozicijaHorizontalno >= (put.offsetWidth - auto.width) ? pozicijaHorizontalno = put.offsetWidth - auto.width : pozicijaHorizontalno += pomeranjeAuta;
    }
    document.getElementById("car").style.left = pozicijaHorizontalno + "px";
}