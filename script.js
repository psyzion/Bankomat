// =====================================================================
// Bankomat v2.1 (c)2025 Nicklas Olsson
// =====================================================================

// ======= Användare ===========
// Skapar en array med användarobjekt. Varje objekt innehåller namn, pinkod och saldo.
const users = [
    { namn: "Emma", kod: "1234", saldo: 1000 },    // Användare 1
    { namn: "Nicklas", kod: "5678", saldo: 1000 }  // Användare 2
];

// Håller koll på vilken kod som skrivs in just nu (som en sträng).
let inmatadKod = "";

// Håller koll på vem som är inloggad – null betyder ingen är inloggad.
let inloggadAnvändare = null;

// Referens till displayelementet där meddelanden visas.
let displayMain = document.getElementById("display");

// Referens till elementet som visar användarinformation (namn + saldo).
let userInfo = document.getElementById("user-info");

// Håller koll på om användaren gör en insättning, ett uttag eller inget alls.
let currentMode = null; // Kan vara null, "deposit" eller "withdraw"

// Används för att spara användarens inmatade belopp som text tills det konverteras.
let beloppsInmatning = "";

// ======= Element ===========
// Hämtar alla knappar med siffror (0-9).
const numButtons = document.querySelectorAll(".num-btn");

// Hämtar knapparna för de olika funktionerna i bankomaten.
const depositBtn = document.getElementById("deposit-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const logoutBtn = document.getElementById("logout-btn");
const cancelBtn = document.getElementById("cancel-btn");
const clearBtn = document.getElementById("clear-btn");
const enterBtn = document.getElementById("enter-btn");

// ======= Funktioner ===========

// Återställer gränssnittet till grundläget, beroende på om man är inloggad eller inte.
function reset() {
    // Rensar kod och beloppsinmatning
    inmatadKod = "";
    beloppsInmatning = "";
    currentMode = null;

    // Om någon är inloggad: visa meny med saldo
    if (inloggadAnvändare) {
        displayMain.textContent = "Välj ett alternativ:";
        userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
    } else {
        // Om ingen är inloggad: be om kod
        displayMain.textContent = "Välkommen! Ange din kod:";
        userInfo.textContent = "";
    }
}

// Slår på eller av funktionsknappar beroende på inloggning
function uppdateraKnappar(aktiv) {
    depositBtn.disabled = !aktiv;   // Insättning
    withdrawBtn.disabled = !aktiv;  // Uttag
    logoutBtn.disabled = !aktiv;    // Logga ut
}

// Försöker logga in användaren med given kod
function loggaIn(kod) {
    // Letar efter användare med matchande kod
    const användare = users.find(u => u.kod === kod);

    if (användare) {
        // Om kod stämmer: spara användaren, uppdatera knappar, visa meny
        inloggadAnvändare = användare;
        userInfo.textContent = användare.namn;
        uppdateraKnappar(true);
        reset();
    } else {
        // Fel kod: visa felmeddelande och nollställ
        displayMain.textContent = "Fel kod. Försök igen.";
        setTimeout(() => {
            inmatadKod = "";
            displayMain.textContent = "Vänligen ange din kod:";
        }, 1500); // Väntar 1.5 sekunder innan ny chans
    }

    inmatadKod = ""; // Töm kod oavsett
}

// Sätter läget till insättning och förbereder displayen
function hanteraInsättning() {
    currentMode = "deposit";
    beloppsInmatning = "";
    displayMain.textContent = "Ange belopp för insättning:";
}

// Sätter läget till uttag och förbereder displayen
function hanteraUttag() {
    currentMode = "withdraw";
    beloppsInmatning = "";
    displayMain.textContent = "Ange belopp för uttag:";
}

// Avslutar transaktion, återgår till huvudmeny efter liten paus
function avslutaTransaktion() {
    currentMode = null;
    beloppsInmatning = "";
    setTimeout(reset, 1000); // Väntar 1 sekund innan reset
}

// ======= Händelser ===========
// Siffra trycks in
numButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const siffra = btn.textContent; // Hämtar siffran från knappen

        if (!inloggadAnvändare) {
            // Om ingen är inloggad: bygg upp 4-siffrig kod
            if (inmatadKod.length < 4) {
                inmatadKod += siffra;
                displayMain.textContent = "*".repeat(inmatadKod.length); // Visa stjärnor
            }
            if (inmatadKod.length === 4) {
                loggaIn(inmatadKod); // När 4 siffror skrivits in, försök logga in
            }
        } else if (currentMode) {
            // Om användaren är i en transaktion: bygg upp belopp
            beloppsInmatning += siffra;
            displayMain.textContent = beloppsInmatning;
        }
    });
});

// ENTER-knappen trycks in
enterBtn.addEventListener("click", () => {
    // Kontroll: bara fortsätt om man är i ett transaktionsläge och något belopp har matats in
    if (currentMode && beloppsInmatning) {
        // Konverterar till heltal (avrundar nedåt)
        let belopp = Math.floor(Number(beloppsInmatning));

        // Validerar att det är ett giltigt belopp
        if (isNaN(belopp) || belopp <= 0) {
            displayMain.textContent = "Ogiltigt belopp.";
            avslutaTransaktion();
            return;
        }

        // Hantera insättning
        if (currentMode === "deposit") {
            inloggadAnvändare.saldo += belopp;
            displayMain.textContent = `Insatt: ${belopp} kr`;
            userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
        }

        // Hantera uttag
        if (currentMode === "withdraw") {
            if (belopp > inloggadAnvändare.saldo) {
                // Om man försöker ta ut mer än man har
                displayMain.textContent = "Otillräckligt saldo.";
            } else {
                // Annars: genomför uttaget
                inloggadAnvändare.saldo -= belopp;
                displayMain.textContent = `Uttag: ${belopp} kr`;
                userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
            }
        }

        avslutaTransaktion(); // Återställ efter hantering
    }
});

// Kopplar insättning- och uttagsknappar till sina funktioner
depositBtn.addEventListener("click", hanteraInsättning);
withdrawBtn.addEventListener("click", hanteraUttag);

// Logga ut-knappen nollställer allt och återgår till startläge
logoutBtn.addEventListener("click", () => {
    inloggadAnvändare = null;
    userInfo.textContent = "";
    uppdateraKnappar(false);
    reset();
});

// Avbryt-knappen: nollställer till meny eller kodinmatning
cancelBtn.addEventListener("click", reset);

// Clear-knappen rensar pågående inmatning (antingen kod eller belopp)
clearBtn.addEventListener("click", () => {
    if (!inloggadAnvändare) {
        inmatadKod = "";
        displayMain.textContent = "Ange din kod:";
    } else if (currentMode) {
        beloppsInmatning = "";
        displayMain.textContent = currentMode === "deposit"
            ? "Ange belopp för insättning:"
            : "Ange belopp för uttag:";
    }
});

// ===== Initiera läget ==========
// När sidan laddas: kör reset för att visa rätt skärm direkt
window.onload = reset;
