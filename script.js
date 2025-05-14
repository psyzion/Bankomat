// =====================================================================
// Bankomat v1.2 (c)2025 Nicklas Olsson
// =====================================================================


// =========================
// Klassdefinitioner
// =========================

class Användare {
  constructor(namn, kod, saldo = 0, admin = false) {
    this.namn = namn;       // Användarens namn
    this.kod = kod;         // PIN-kod (sträng)
    this.saldo = saldo;     // Saldo i kronor
    this.admin = admin;     // true om administratör
  }

/*   deposit(belopp) {
    this.saldo += belopp;
  }

  withdraw(belopp) {
    if (belopp > this.saldo) return false;
    this.saldo -= belopp;
    return true;
  } */

  
}


// =========================
// Globala variabler
// =========================

let användareLista = []; // En lista för alla användare (som objekt).
let inloggadAnvändare = null; // Vem är inloggad.
let inmatadKod = ""; // Vilken kod som skrivs in (som en sträng).


let currentMode = null; // Gör användaren en insättning, ett uttag eller inget alls.
let beloppsInmatning = ""; // Spara användarens inmatade belopp som text.

// ======= Element ===========
const displayMain = document.getElementById("display");
const userInfo = document.getElementById("user-info");
const adminPanel = document.getElementById("admin-panel");
const userTable = document.getElementById("user-table");
const addUserForm = document.getElementById("add-user-form");
const depositBtn = document.getElementById("deposit-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
const logoutBtn = document.getElementById("logout-btn");
const cancelBtn = document.getElementById("cancel-btn");
const clearBtn = document.getElementById("clear-btn");
const enterBtn = document.getElementById("enter-btn");
const numButtons = document.querySelectorAll(".num-btn"); // Hämtar alla knappar med siffror (0-9).


// =========================
// Initiering
// =========================

window.onload = () => {
  laddaAnvändare();
  reset();
};


// =========================
// Funktioner
// =========================

// Återställer till grundläget, beroende på om man är inloggad eller inte.
function reset() {
    inmatadKod = "";
    beloppsInmatning = "";
    currentMode = null;
    adminPanel.style.display = "none";
  
    if (inloggadAnvändare) {
      if (inloggadAnvändare.admin) {
        displayMain.textContent = "ADMINLÄGE";
        adminPanel.style.display = "block";
        visaAdminTabell();
      } else {
        displayMain.textContent = "Välj ett alternativ:";
        userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
      }
    } else {
      displayMain.textContent = "Välkommen! Ange din kod:";
      userInfo.textContent = "";
    }
  }

// Användarhantering
function laddaAnvändare() {
  const sparade = localStorage.getItem("användare");
  if (sparade) {
    användareLista = JSON.parse(sparade);
  } else {
    användareLista = [
      new Användare("Emma", "1234", 1000),
      new Användare("Nicklas", "5678", 1000),
      new Användare("Admin", "0000", 0, true)
    ];
    sparaAnvändare();
  }
}

function sparaAnvändare() {
  localStorage.setItem("användare", JSON.stringify(användareLista));
}


// In-utloggning
function loggaIn(kod) {
  const användare = användareLista.find(u => u.kod === kod);
  if (användare) {
    inloggadAnvändare = användare;
    uppdateraKnappar(!användare.admin);
    logoutBtn.disabled = false;
    reset();
  } else {
    displayMain.textContent = "Fel kod. Försök igen.";
    setTimeout(() => {
      inmatadKod = "";
      displayMain.textContent = "Vänligen ange din kod:";
    }, 1500);
  }
  inmatadKod = "";
}

function loggaUt() {
  inloggadAnvändare = null;
  userInfo.textContent = "";
  uppdateraKnappar(false);
  reset();
  adminPanel.style.display = "none";
}

// Slår på eller av funktionsknappar beroende på inloggning
function uppdateraKnappar(aktiv) {
  depositBtn.disabled = !aktiv;
  withdrawBtn.disabled = !aktiv;
  logoutBtn.disabled = !aktiv;
}

// Transaktionshantering
function hanteraInsättning() {
  currentMode = "deposit";
  beloppsInmatning = "";
  displayMain.textContent = "Ange belopp för insättning:";
}

function hanteraUttag() {
  currentMode = "withdraw";
  beloppsInmatning = "";
  displayMain.textContent = "Ange belopp för uttag:";
}

function avslutaTransaktion() {
  currentMode = null;
  beloppsInmatning = "";
  setTimeout(reset, 1000);
}


// Adminpanel
function visaAdminTabell() {
  userTable.innerHTML = "";
  användareLista.forEach((anv, index) => {
    const rad = document.createElement("tr");
    rad.innerHTML = `
      <td>${anv.namn}</td>
      <td>${anv.kod}</td>
      <td>${anv.saldo} kr</td>
      <td>${anv.admin ? "Ja" : "Nej"}</td>
      <td><button onclick="taBortAnvändare(${index})">Ta bort</button></td>
    `;
    userTable.appendChild(rad);
  });
}

function taBortAnvändare(index) {
  if (användareLista[index].admin) {
    alert("Du kan inte ta bort adminkontot!");
    return;
  }
  användareLista.splice(index, 1);
  sparaAnvändare();
  visaAdminTabell();
}

addUserForm.addEventListener("submit", e => {
  e.preventDefault();
  const namn = addUserForm.namn.value.trim();
  const kod = addUserForm.kod.value.trim();
  const saldo = parseInt(addUserForm.saldo.value);
  const admin = addUserForm.admin.checked;

  if (!namn || !kod || isNaN(saldo)) {
    alert("Fyll i alla fält korrekt.");
    return;
  }

  användareLista.push(new Användare(namn, kod, saldo, admin));
  sparaAnvändare();
  visaAdminTabell();
  addUserForm.reset();
});


// =========================
// Händelser 
// =========================

// Siffror
numButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const siffra = btn.textContent;

    if (!inloggadAnvändare) {
      if (inmatadKod.length < 4) {
        inmatadKod += siffra;
        displayMain.textContent = "*".repeat(inmatadKod.length);
      }
      if (inmatadKod.length === 4) {
        loggaIn(inmatadKod);
      }
    } else if (currentMode) {
      beloppsInmatning += siffra;
      displayMain.textContent = beloppsInmatning;
    }
  });
});

// Enter
enterBtn.addEventListener("click", () => {
  if (currentMode && beloppsInmatning) {
    let belopp = Math.floor(Number(beloppsInmatning));
    if (isNaN(belopp) || belopp <= 0) {
      displayMain.textContent = "Ogiltigt belopp.";
      avslutaTransaktion();
      return;
    }

    if (currentMode === "deposit") {
      inloggadAnvändare.saldo += belopp;
      displayMain.textContent = `Insatt: ${belopp} kr`;
      
    }

    if (currentMode === "withdraw") {
      if (inloggadAnvändare.saldo < belopp) {
        displayMain.textContent = "Otillräckligt saldo.";
      } else {
        inloggadAnvändare.saldo -= belopp;
        displayMain.textContent = `Uttag: ${belopp} kr`;
      }
    }

    userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
    sparaAnvändare();
    avslutaTransaktion();
  }
});

// Funktionsknappar_
depositBtn.addEventListener("click", hanteraInsättning);
withdrawBtn.addEventListener("click", hanteraUttag);
logoutBtn.addEventListener("click", loggaUt);
cancelBtn.addEventListener("click", reset);

// Rensa
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
