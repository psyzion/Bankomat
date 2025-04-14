// ======= Användare ===========
const users = [
    { namn: "Anna", kod: "1234", saldo: 1000 },
    { namn: "Erik", kod: "5678", saldo: 1000 }
  ];
  
  let inmatadKod = "";
  let inloggadAnvändare = null;
  let display = document.getElementById("display");
  let userInfo = document.getElementById("user-info");
  
  // ======= Element ===========
  const numButtons = document.querySelectorAll(".num-btn");
  const saldoBtn = document.getElementById("saldo-btn");
  const depositBtn = document.getElementById("deposit-btn");
  const withdrawBtn = document.getElementById("withdraw-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const clearBtn = document.getElementById("clear-btn");
  const enterBtn = document.getElementById("enter-btn");
  
  // ======= Händelser ===========
  numButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (inloggadAnvändare) {
        inmatadKod += btn.textContent;
        display.textContent = inmatadKod;
      } else if (inmatadKod.length < 4) {
        inmatadKod += btn.textContent;
        display.textContent = "*".repeat(inmatadKod.length);
        if (inmatadKod.length === 4) {
          kontrolleraKod();
        }
      }
    });
  });
  
  clearBtn.addEventListener("click", () => {
    inmatadKod = "";
    display.textContent = inloggadAnvändare
      ? "Välj ett alternativ."
      : "Välkommen! Ange din kod:";
  });
  
  cancelBtn.addEventListener("click", () => {
    if (inloggadAnvändare) {
      display.textContent = "Åtgärd avbruten.";
      inmatadKod = "";
    } else {
      inmatadKod = "";
      display.textContent = "Kod rensad.";
    }
  });
  
  logoutBtn.addEventListener("click", () => {
    loggaUt();
  });
  
  saldoBtn.addEventListener("click", () => {
    display.textContent = `Saldo: ${inloggadAnvändare.saldo} kr`;
  });
  
  depositBtn.addEventListener("click", () => {
    const belopp = prompt("Ange belopp att sätta in:");
    const summa = Math.floor(parseFloat(belopp));
    if (isNaN(summa) || summa <= 0) {
      display.textContent = "Felaktig inmatning.";
      return;
    }
    inloggadAnvändare.saldo += summa;
    display.textContent = `Insatt: ${summa} kr. Nytt saldo: ${inloggadAnvändare.saldo} kr`;
  });
  
  withdrawBtn.addEventListener("click", () => {
    const belopp = prompt("Ange belopp att ta ut:");
    const summa = Math.floor(parseFloat(belopp));
    if (isNaN(summa) || summa <= 0) {
      display.textContent = "Felaktig inmatning.";
      return;
    }
    if (summa > inloggadAnvändare.saldo) {
      display.textContent = "Otillräckligt saldo.";
      return;
    }
    inloggadAnvändare.saldo -= summa;
    display.textContent = `Uttag: ${summa} kr. Nytt saldo: ${inloggadAnvändare.saldo} kr`;
  });
  
  // ======= Funktioner ===========
  function kontrolleraKod() {
    const användare = users.find(u => u.kod === inmatadKod);
    if (användare) {
      inloggadAnvändare = användare;
      display.textContent = `Välkommen ${användare.namn}!`;
      userInfo.textContent = användare.namn;
      aktiveraKnappar(true);
    } else {
      display.textContent = "Fel kod. Försök igen.";
    }
    inmatadKod = "";
  }
  
  function loggaUt() {
    inloggadAnvändare = null;
    userInfo.textContent = "";
    display.textContent = "Utloggad. Ange kod för att logga in.";
    aktiveraKnappar(false);
  }
  
  function aktiveraKnappar(status) {
    saldoBtn.disabled = !status;
    depositBtn.disabled = !status;
    withdrawBtn.disabled = !status;
    logoutBtn.disabled = !status;
  }
  