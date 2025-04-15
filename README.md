# Bankomat
// =====================================================================
// Bankomat simlator
// v2.1 (c)2025 Nicklas Olsson
// Pseudokod
// =====================================================================

// Start
Visa "Välkommen! Ange din kod:"

// Vänta på inmatning av 4 siffror
Lagra siffror som inmatadKod

Om inmatadKod matchar en användares kod:
    Logga in användare
    Visa "Inloggad: [namn] | Saldo: [saldo] kr"
    Visa alternativ: [Insättning], [Uttag], [Logga ut]
Annars:
    Visa "Fel kod. Försök igen."
    Återställ kodinmatning efter 1,5 sek

// INSÄTTNING
Om användare trycker "Insättning":
    Sätt currentMode till "deposit"
    Visa "Ange belopp för insättning"
    Vänta på belopp
    Vid ENTER:
        Om belopp giltigt:
            Öka saldo
            Visa nytt saldo
        Annars:
            Visa felmeddelande
    Återställ

// UTAG
Om användare trycker "Uttag":
    Sätt currentMode till "withdraw"
    Visa "Ange belopp för uttag"
    Vänta på belopp
    Vid ENTER:
        Om belopp giltigt och täcker saldo:
            Minska saldo
            Visa nytt saldo
        Annars:
            Visa felmeddelande
    Återställ

// Andra knappar
Avbryt: Återställ allt
Rensa: Rensa inmatning (kod eller belopp)
Logga ut: Återställ och visa inloggningsrutan

// Slut
