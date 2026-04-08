---
title: "Generer arbeidsrom"
path: "administrasjon/generer-arbeidsrom"
gitbook_id: "pgRLvOpSKN3PrLey2xab"
---

# Generer arbeidsrom

## Hva kan jeg bruke arbeidsrom generatoren til?

Arbeidsrom-generatoren har to formål

1. Generere et nettsted
2. Generer flere nettsteder

Behovet for å regenerere et nettsted kan være et scenario du støter på hvis brukeren har fylt ut et hovedliste-oppføringsskjema som inneholder korrupte data eller på lignende måte har lagt til en korrupt oppføring fra [rutevisningsfunksjonen]().

Generering av en serie nettsteder er normalt et scenario i systemimplementeringsfasen. Systemadministratorer vil kanskje importere en gruppe listeoppføringer fra Microsoft Excel eller et lignende program. Dette gjøres vanligvis ved å bruke utklippsfunksjonen i Windows (Ctrl-C/Ctrl-V) og [rutenettvisningsfunksjonen]() i hovedlisten.

## Hvordan gjenkjenner jeg om en hovedlisteoppføring ikke er generert?

Hvis et listeelement mangler en unik ID og/eller arbeidsromkoblingsikon.

## Hvordan kan jeg fikse problemet med et arbeidsrom som ikke er riktig opprettet?

Det første du må gjøre er å sjekke registreringsskjemaet for manglende eller korrupte data.

> ℹ️ **INFO**
> Tips, sjekk alltid personvelgerfelt, datofelt i feil formatering og bruk av spesialtegn og symboler.

Naviger til administrasjons-huben og finn funksjonen Generer arbeidsrom. Velg den berørte huben og listen, og velg deretter visningen der du enkelt kan finne det defekte elementet.

Velg elementet og trykk på Kjør. Om noen få minutter vil siden være gjenopprettet og normalt arbeid kan gjenopptas.

## Jeg har importert en liste over oppføringer og ønsker å generere arbeidsrom

Det første trinnet er å bekrefte at ingen av elementene har korrupte eller manglende data (obligatoriske felter).

> ⚠️ **WARNING**
> SharePoint vil indikere om et obligatorisk felt mangler verdier.

Vær forsiktig med datofelt da SharePoint kan bruke amerikanske datoformater når datovelgeren brukes manuelt i [rutenettvisning](). MM-DD-ÅÅÅÅ.

Det andre trinnet. Naviger til administrasjons-huben og finn funksjonen Generer arbeidsrom. Velg det berørte navet og listen, og velg deretter visningen der du enkelt kan finne partiet med elementer.

> ℹ️ **INFO**
> For å ha bedre kontroll over elementer uten et arbeidsrom anbefales det å lage en listevisning og bruk passende filtre.

Velg elementene og trykk på Sett i kø. Sidene er nå plassert i en kø og planlagt å starte batchgenerering kl. 03:30 (CET) dagen etter.

> 🚨 **DANGER**
> Det anbefales å ikke kjøre batcher med mer enn 100 listeelementer om gangen. Systemgrense-terskelen er 150 elementer.

