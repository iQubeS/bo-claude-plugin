---
title: "Kontakter"
path: "crm/kontakter"
gitbook_id: "ba9iWLrF09VmSEZSdGqi"
---

# Introduksjon

Kontaktlisten er en grunnleggende liste slik som alle CRM lister. Funksjonen er ganske enkel: lagre generelle driftsdata om eksterne kontakter i [link](crm/bedrifter.md) listen. Listens funksjonalitet er begrenset, men brukes til å knytte andre deler av systemet til enkeltpersoner slik at kontaktinformasjonen deres er tilgjengelig på arbeidsrommet.

# Kontaktlisten

Hver kontakt i denne listen representerer en ekstern kontaktperson i en bedrift. Her noteres deres kontaktinformasjon, funksjon i bedriften og juridisk grunnlag for lagring.

## Skjema

For å opprette et element, klikk på "+ Ny" i listen og skriv inn i skjemaet.

| Felt | Beskrivelse |
| --- | --- |
| Hovedkontakt | Kryss av i dette feltet for å angi denne kontakten som hovedkontakt for bedriften. |
| Logg | Tekstfelt som noterer inndata i en logg-lignende liste hver gang skjemaet lagres. |
| Lovlig basis | GDPR juridisk grunnlag for å lagre personopplysninger om kontakten. |
| Kontaktens navn | Kontaktens fulle navn. Dette er listens tittelfelt. |
| Jobbtittel | Kontaktens offisielle tittel i bedriften |
| Status | Markerer om kontakten er aktiv i bedriften eller ikke lenger jobber der. |
| Bedrift | Velg bedriften denne kontakten er tilknyttet. Hvis bedriften ikke er tilgjengelig i oppslagsfeltet, må du navigere til firmalisten for å opprette bedriften for å få alternativet tilgjengelig. |
| E-mail | Arbeids- eller personlig e-mail til kontakten. |
| Telefonnummer | Kontaktens jobb- og/eller personlige telefonnummer |
| Adresse | Kontaktens hjemme-/postadresse |

### Hovedkontakt

Ved å krysse av på hovedkontakt markerer du at denne kontakten er hovedkontakten for bedriften. Denne kontakten vil også bli referert til i [link](komponenter/informasjonskort.md) komponenten i bedriftens arbeidsrom.

En kontakt som er generert fra  feltet ved oppretting av et selskap vil ha hovedkontakt avkrysset som standard.

> ℹ️ **INFO**
> Å sjekke hvem som er hovedkontakt blant flere kontakter i samme bedrift er ikke umulig. Komponentene viser den første aktive kontakten som ble opprettet om det skulle være flere hovedkontakter for en bedrift.

### Logg

Hver gang du legger til tekst i dette feltet og trykker lagre vil en logg-lignende liste vises under. Listen kan brukes til det som anses som verdifullt. Nedenfor vises et eksempel hvor loggen brukes som en endringslogg for andre ansatte som ønsker å få mer informasjon om kontakten.

![bilde](gitbook-file:t8nOoBMud3RUBjEwa8wE)

## Søking

Kontaktlisten bruker standard SharePoint søkemotor som ligger øverst på siden. Skriv inn søkekriteriene dine her for å filtrere listen.

Les mer om SharePoint søking i  avsnittet.

> ℹ️ **INFO**
> For å søke etter delvise strenger ("Nor" i stedet for "Nordmann" for eksempel), legg inn i strengen tegnet * før eller etter bokstavene dine. Søkefeltet vil håndtere det som "hva som helst før/etter disse bokstavene". Hvis du ikke bruker tegnet *, kan det hende at søket ikke gir resultater fordi det bare gjør eksakte treff og ikke delvise søk.

# Referanser

📄 **Se også:** [crm/bedrifter.md](crm/bedrifter.md)

📄 **Se også:** [komponenter/nokkelkontakter.md](komponenter/nokkelkontakter.md)

