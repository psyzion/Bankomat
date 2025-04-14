// =====================================================================
// Bankomat v2.1 (c)2025 Nicklas Olsson
//
// =====================================================================


// ======= Användare ===========
const users = [
    { namn: "Emma", kod: "1234", saldo: 1000 },
    { namn: "Nicklas", kod: "5678", saldo: 1000 }
  ];
  
  let inmatadKod = "";
  let inloggadAnvändare = null;
  let displayMain = document.getElementById("display");
  let userInfo = document.getElementById("user-info");
  
  let currentMode = null; // null | "deposit" | "withdraw"
  let beloppsInmatning = "";
  
  // ======= Element ===========
  const numButtons = document.querySelectorAll(".num-btn");
  const depositBtn = document.getElementById("deposit-btn");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const clearBtn = document.getElementById("clear-btn");
  const enterBtn = document.getElementById("enter-btn");
  
  // ======= Funktioner ===========
  function reset() {
    inmatadKod = "";
    beloppsInmatning = "";
    currentMode = null;
  
    if (inloggadAnvändare) {
      displayMain.textContent = "Välj ett alternativ:";
      userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
    } else {
      displayMain.textContent = "Välkommen! Ange din kod:";
      userInfo.textContent = "";
    }
  }
  
  function uppdateraKnappar(aktiv) {
    depositBtn.disabled = !aktiv;
    withdrawBtn.disabled = !aktiv;
    logoutBtn.disabled = !aktiv;
  }
  
  function loggaIn(kod) {
    const användare = users.find(u => u.kod === kod);
  
    if (användare) {
      inloggadAnvändare = användare;
      userInfo.textContent = användare.namn;
      uppdateraKnappar(true);
      reset(); // Visa välkomsttext med saldo
    } else {
      displayMain.textContent = "Fel kod. Försök igen.";
      setTimeout(() => {
        inmatadKod = "";
        displayMain.textContent = "Vänligen ange din kod:";
      }, 1500);
    }
  
    inmatadKod = "";
  }
  
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
  
  // ======= Händelser ===========
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
        userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
      }
  
      if (currentMode === "withdraw") {
        if (belopp > inloggadAnvändare.saldo) {
          displayMain.textContent = "Otillräckligt saldo.";
        } else {
          inloggadAnvändare.saldo -= belopp;
          displayMain.textContent = `Uttag: ${belopp} kr`;
          userInfo.textContent = `Inloggad: ${inloggadAnvändare.namn} | Saldo: ${inloggadAnvändare.saldo} kr`;
        }
      }
  
      avslutaTransaktion();
    }
  });
  
  depositBtn.addEventListener("click", hanteraInsättning);
  withdrawBtn.addEventListener("click", hanteraUttag);
  
  logoutBtn.addEventListener("click", () => {
    inloggadAnvändare = null;
    userInfo.textContent = "";
    uppdateraKnappar(false);
    reset();
  });
  
  cancelBtn.addEventListener("click", reset);
  
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
  window.onload = reset;
  