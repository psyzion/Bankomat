```                                                                 
     Interaktiv bankomat i webbläsaren – byggd med HTML, CSS & JS
```

## 🧾 Versionshistorik

| Version | Förändringar |
|--------:|--------------|
| **1.0** | Enkel inloggning med PIN via tangentbord + Enter. Tre knappar: saldo, insättning, uttag. |
| **1.1** | Sifferinmatning via knappar. PIN döljs som `*`. Bättre layout med Grid. |
| **1.3** | Belopp matas nu via knapptryck – inga minustecken, decimaler eller tangentbordsfel. |
| **1.5** | Användarna görs till objekt med namn, PIN och saldo. |
| **1.8** | Användardata sparas i `localStorage`. Saldo består efter sidladdning. |
| **2.0** | Adminläge! Pinkod låser upp adminpanel med funktion för att lägga till/ta bort användare. |

---

## 🏦 Bankomatprojekt

Detta är en interaktiv bankomatsimulator skapad i JavaScript, HTML och CSS. Projektet utvecklades parallellt med en webutvecklingskurs.

### 💡 Funktioner

- PIN-inloggning (knappbaserad)
- Visuellt saldo, uttag och insättning
- Felmeddelanden vid ogiltiga transaktioner
- localStorage-sparning
- Adminläge med användarhantering
- Mörkt, responsivt tema

---

## 🛠️ Teknisk översikt

- **HTML**: Semantisk struktur
- **CSS**: Grid & Flexbox för layout, mörkt tema
- **JavaScript**:
  - Användare hanteras som objekt i en array
  - PIN matas via knappar, visas som `*`
  - När korrekt PIN anges: matchning sker och kontot laddas
  - Adminkontot har särskild PIN, visar ett extra UI
  - Data sparas till och läses från `localStorage`
  - DOM-manipulation uppdaterar displayen och layouten i realtid

---

## 🌐 Live & Källkod

Kolla in projektet live eller bidra själv:

👉 https://github.com/psyzion/bankomat

---

## 📄 Licens och info

Projektet är gjort för lärande och övning, ej för verklig användning.

```
(c) 2025 Nicklas Olsson
```
