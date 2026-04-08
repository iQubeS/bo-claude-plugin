---
title: "KHMS-arbeidsrom"
path: "khms/rapportering/khms-arbeidsrom"
gitbook_id: "UMN5yBWhWJduIUPjbqtg"
---

# Introduksjon

Når en KHMS-rapport når en viss grad av arbeid kan det være nødvendig å generere et arbeidsrom for å hjelpe med datalagring, oppgavebehandling og samarbeid. Siden dette ikke er relevant eller nødvendig for alle KHMS-rapporter, er det en valgfri funksjon som kan aktiveres av saksbehandleren for sine tildelte saker.

> ℹ️ **INFO**
> Dette valget er tilgjengelig for alle typer registreringer unntatt forbedringsforslag.

# Opprette et KHMS-arbeidsrom

I motsetning til andre lister i systemet med arbeidsrom-funksjoner, må et aktivt valg merkes av for at KHMS-arbeidsrom skal genereres.

Åpne redigeringsskjemaet for en rapportert KHMS-sak. Naviger til "[Aksjoner]()"-fanen i skjemaet. Merk av for "Opprett arbeidsrom", og trykk lagre. 

> ℹ️ **INFO**
> Hvis NCR-prosjektfeltet ikke er synlig i listen, kontakt din lokale administrator for å legge det til i visningen. Du kan selv midlertidig legge den til i en privat visning eller ved å bruke "Legg til kolonne" helt til høyre i listevisningen.

# Arbeidsrom verktøy

Hensikten med å generere et arbeidsrom for en KHMS-rapport er å ha et utvidet rom for å logge alle aktiviteter knyttet til håndtering av saken. Dette kan for eksempel være en undersøkelse eller mulighetsanalyse.

Verktøyene i KHMS-arbeidsrommet er annerledes sammenlignet med noen andre arbeidsrom, men inneholder nøyaktig det som kreves for formålet.

![bilde](gitbook-file:DV3Gm3F83QkRUF0Di09v)

## Tillatelser

KHMS-arbeidsrommet er et begrenset arbeidsrom som bare er tilgjengelig for

- Medlemmer av tilgangsgruppen KHMS-ansvarlig
- KHMS-rapport saksbehandler (brukeren i feltet Deleger til)
- Interne ressurser lagt til i KHMS-arbeidsrommet

Alle brukere i KHMS-ansvarlig gruppen vil ha tilgang til alle KHMS-arbeidsrom. Saksbehandlere og ressurser vil kun ha tilgang til det de har fått tilgang til.

## Tiltak

Tiltak i en KHMS-rapportsammenheng er en liste over korrigerende eller forebyggende tiltak som er tatt for å oppnå en løsning på den rapporterte saken og som til slutt fører til lukking av saken.

Det er et flott verktøy for saksbehandleren å bruke for å involvere de rette personene i å løse et problem uten å måtte tildele KHMS-rapporten på nytt. I praksis fungerer tiltak som en oppgave de tildelte brukerne må følge opp og lukke for at KHMS-rapporten skal gå videre.

I KHMS-arbeidsrommet er det, på samme måte som KHMS-rapportredigeringsskjemaet, en komponent som viser alle tiltak som er registrert for gjeldende KHMS-rapport. 

![bilde](gitbook-file:ah31e51IF58kboCmfAdc)

### Varslinger

En epost og Teams-varsling vil bli distribuert for tiltaket til den tildelte brukeren. Dette skjer når

- Tiltaket er tildelt
- Forfallsdatoen for tiltaket er i dag

Brukeren som har tildelt tiltaket vil også bli varslet når tiltaket er gjennomført.

### Min side

Alle tiltak som er tildelt deg vil vises på KHMS-oppgaver på Min side. 

![Tiltak som vises på KHMS-oppgavepanelet på Min side](gitbook-file:M8RFMqNr8eD54ck1PTUP)

## Tidslinje

Tidslinjekomponenten er spesielt nyttig i et KHMS-arbeidsrom ettersom håndtering av rapporter ofte innebærer å ha oversikt over hvilke hendelser som finner sted og hvilken informasjon som gis på hvilket tidspunkt.

Under konstruksjonen av rapporten er denne informasjonen uvurderlig, men det krever at ressursene som er involvert logger hendelser etter hvert som de skjer. 

Denne informasjonen er også svært nyttig hvis ledere eller tidligere saksressurser trenger å se tilbake på detaljene i en hendelse.

Se en detaljert beskrivelse av komponenten i avsnittet som er koblet til nedenfor.

📄 **Se også:** [komponenter/tidslinje.md](komponenter/tidslinje.md)

## Dokumenter

Som alle arbeidsrom inneholder denne også et dokumentbibliotek med nesten all funksjonalitet. Biblioteket kan forhåndsutfylles med en mappestruktur basert på typen registrering, og eventuelle nødvendige arbeidsfiler kan importeres fra Styrende dokumenter ved å bruke [link](komponenter/cd-filer.md) verktøyet. 

Filene vil naturligvis arve tillatelsene på nettstedet, og kun være tilgjengelige for brukere som er definert i tilgangs seksjonen.

> ℹ️ **INFO**
> Den eneste dokumentbiblioteks-funksjonaliteten som ikke er tilgjengelig for disse arbeidsrommene er dokumentgodkjenningen. Hvis du importerer filer fra styrende dokumenter med ProjectRevision og ProjectUniqueID-metakoden, kan du fjerne dem manuelt.

## Eksterne kontakter

De eksterne kontaktene brukes på samme måte som andre arbeidsrom. Du kan enten legge til kontakter som allerede er registrert eller opprette uregistrerte kontakter direkte.

Enhver kontakt som er relatert til hendelsen og ikke i din bedrift skal legges til her for to formål

1. Rask tilgang til deres email, telefonnummer og rolle i KHMS-rapporten
2. Historisk oversikt over hvem du var i kontakt med og hvilke interessenter som var en del av denne KHMS-rapporten

Se delen av nøkkelkontakt-komponenten for mer informasjon.

## Interne ressurser

Det er her du definerer alle som er involvert i KHMS-rapporten, enten det er direkte håndtering eller interessenter/godkjennere. 

I tillegg til å legge til ressurser for kontaktinformasjon og historiske formål bruker du også dette verktøyet for å gi brukere tilgang til arbeidsrommet. Å legge til eller fjerne ressurser fra denne listen vil gi eller oppheve deres tilgang til arbeidsrommet.

Se  delen av nøkkelkontakt-komponenten for mer informasjon.

