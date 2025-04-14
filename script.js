// ======= Användare ===========
const users = [
    { namn: "Anna", kod: "1234", saldo: 1000 },
    { namn: "Erik", kod: "5678", saldo: 1000 }
  ];
  
  let inmatadKod = "";
  let inloggadAnvändare = null;
  let display = document.getElementById("display");
  let userInfo = document.getElementById("user-info");
  
  let currentMode = null; // null | "deposit" | "withdraw"
  let beloppsInmatning = "";
  
  // ======= Element ===========
  const numButtons = document.querySelectorAll(".num-btn");
  const saldoBtn = document.getElementById("saldo-btn");
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
    display.textContent = inloggadAnvändare
      ? `Välkommen ${inloggadAnvändare.namn}`
      : "Välkommen! Ange din kod:";
  }
  
  function uppdateraKnappar(aktiv) {
    saldoBtn.disabled = !aktiv;
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
      display.textContent = `Välkommen ${användare.namn}`;
    } else {
      display.textContent = "Fel kod. Försök igen.";
      setTimeout(reset, 1500);
    }
    inmatadKod = "";
  }
  
  function visaSaldo() {
    display.textContent = `Saldo: ${inloggadAnvändare.saldo} kr`;
  }
  
  function hanteraInsättning() {
    currentMode = "deposit";
    beloppsInmatning = "";
    display.textContent = "Ange belopp för insättning:";
  }
  
  function hanteraUttag() {
    currentMode = "withdraw";
    beloppsInmatning = "";
    display.textContent = "Ange belopp för uttag:";
  }
  
  function avslutaTransaktion() {
    currentMode = null;
    beloppsInmatning = "";
    setTimeout(() => {
      display.textContent = `Saldo: ${inloggadAnvändare.saldo} kr`;
    }, 1000);
  }
  
  // ======= Händelser ===========
  numButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const siffra = btn.textContent;
  
      if (!inloggadAnvändare) {
        if (inmatadKod.length < 4) {
          inmatadKod += siffra;
          display.textContent = "*".repeat(inmatadKod.length);
        }
        if (inmatadKod.length === 4) {
          loggaIn(inmatadKod);
        }
      } else if (currentMode) {
        beloppsInmatning += siffra;
        display.textContent = beloppsInmatning;
      }
    });
  });
  
  enterBtn.addEventListener("click", () => {
    if (currentMode && beloppsInmatning) {
      let belopp = Math.floor(Number(beloppsInmatning));
      if (isNaN(belopp) || belopp <= 0) {
        display.textContent = "Ogiltigt belopp.";
        avslutaTransaktion();
        return;
      }
  
      if (currentMode === "deposit") {
        inloggadAnvändare.saldo += belopp;
        display.textContent = `Insatt: ${belopp} kr`;
      }
  
      if (currentMode === "withdraw") {
        if (belopp > inloggadAnvändare.saldo) {
          display.textContent = "Otillräckligt saldo.";
        } else {
          inloggadAnvändare.saldo -= belopp;
          display.textContent = `Uttag: ${belopp} kr`;
        }
      }
      avslutaTransaktion();
    }
  });
  
  saldoBtn.addEventListener("click", visaSaldo);
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
      display.textContent = "Ange din kod:";
    } else if (currentMode) {
      beloppsInmatning = "";
      display.textContent = currentMode === "deposit"
        ? "Ange belopp för insättning:"
        : "Ange belopp för uttag:";
    }
  });
  