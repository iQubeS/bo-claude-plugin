---
title: "Nøkkelkontakter"
description: "Hvordan Business Online administrerer interne og eksterne kontakter i et arbeidsrom."
path: "komponenter/nokkelkontakter"
gitbook_id: "RAGhDXwevUwQdRxA1EYF"
---

# Introduksjon

Hovedfunksjonen til Nøkkelkontakter-komponenten er å vise en oversikt over personer relatert til arbeidsrommet. Komponenten brukes til både Eksterne og Interne kontakter, som begge har forskjellig kildedata.

Hensikten er å ha kontaktdata lett tilgjengelig for arbeidsrommets brukere samt å ha en rask oversikt over hvem som er knyttet til arbeidsrommet.

# Eksterne kontakter

Nøkkelkontakter-komponenten som brukes for eksterne kontakter henter og viser data fra [link](crm/kontakter.md) listen. 

## Innlastning på arbeidsrom

Når du går inn i et arbeidsrom vil det normalt sett kun lastes inn elementer som er lagt til av en bruker, med unntak av bedriftens arbeidsrom. I bedriftarbeidsrommet vil alle kontakter som er knyttet til gjeldende bedrift lastes inn som standard.

## Legge til

Når du skal legge til en ekstern kontakt i nøkkelkontakter-komponenten vil komponenten som standard velge bedriften som er valgt for gjeldende arbeidsrom. Når en bedrift er valgt vil kontaktene som er tilknyttet bedriften lastes inn og lar brukeren velge en eller flere kontakter som skal legges til.

> ℹ️ **INFO**
> Brukere som blir lagt til vil vises på forsiden som standard og må skjules manuelt i redigeringsmenyen.

Når kontakten er lagt til vil brukeren vises i komponenten. Informasjonen deres vil være tilgjengelig ved å holde musepekeren over brukeren.

## Rediger

Klikk på en kontakt for å åpne redigeringsskjemaet. Alle detaljer som endres herfra vil reflekteres på kontakten i kontaktlisten, med unntak av rolle som bare endres for gjeldende arbeidsrom.

Hensikten med redigering av en ekstern kontakt er hvis nye detaljer mottas og må oppdateres. Siden de oppdaterte detaljene er relevante for alle andre som legger til denne kontakten vil kontaktlisten også oppdateres.

I redigeringsskjemaet kan du også velge å ikke vise kontakten på arbeidsrommets side. Dette er avhuket som standard når du legger til eksterne kontakter.

## Opprette

Hvis den eksterne kontakten du ønsker å legge til for en bedrift ikke finnes i kontaktlisten kan du legge til kontakter direkte fra komponenten. 

Dette vil føre til at en ny kontakt registreres i kontaktlisten og at kontakten legges til i den eksterne kontakt-komponenten.

> ℹ️ **INFO**
> Merk at her vil rollen bli brukt som stillingstittel for kontakten, i motsetning til redigeringsskjemaet der den kun oppdaterer rollen i prosjektet.

# Interne ressurser

Nøkkelkontakter-komponenten som brukes for interne ressurser henter og viser en blanding av personell- og brukerdata. Den brukes hovedsakelig til å knytte bedriftens personell til det nåværende arbeidsrommet, samt å gi egne tilganger for arbeidsrom som er begrenset ift. tilgangsgrupper. 

## Legge til

Ved å klikke på legg til vil et skjema lastes inn der du må skrive inn navnet på ressursen du ønsker å legge til. 

> ℹ️ **INFO**
> Funksjonen søker opp i personellisten. Hvis du ikke finner ressursen du leter etter, kontakt HR for å sjekke om de har registrert personen.

## Rediger

For å redigere en ressurs i interne ressurser, klikk på navnet. I skjemaet som lastes inn kan brukere endre rollen til personellet som er lagt til. Når du oppretter den interne ressursen kan du bare endre rollen ressursen har i arbeidsrommet. Dette er fordi personelldetaljene er kun redigerbare for HR-brukere.

Ved opprettelse av en intern ressurs settes prosjektrollen normalt til den ansattes tittel/stilling i bedriften. I redigeringsskjemaet kan dette endres for å passe til rollen ressursen har i prosjektet (som prosjektleder eller innkjøper).

## Funksjonalitet

Nøkkelkontakt-komponenten lar deg legge til interne ressurser for et arbeidsrom, og hvis arbeidsrommet er satt til begrenset vil den nye interne ressursen nå få tilgang. 

**Bedrifter**: Legger brukeren til i gruppen slik at de kan få tilgang til samarbeidsverktøy som Planner og Teams

**Prosjekter**: Legger brukeren til i gruppen og gir tilgang til prosjektet hvis det er satt til begrenset

**KHMS rapporter**: Gir brukertilgang til arbeidsrommet og tiltak

