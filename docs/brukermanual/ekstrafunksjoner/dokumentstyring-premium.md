---
title: "Dokumentstyring premium"
description: "Dokumenthåndertingssystem"
path: "ekstrafunksjoner/dokumentstyring-premium"
gitbook_id: "rpak3SGLUMnlVa0RNc84"
---

# Introduksjon

Denne funksjonen (forkortet til DMS i deler av systemet) gir deg full kontroll over dokumentene i prosjekter, med avanserte verktøy for opprettelse, nummerering og godkjenning av prosjekt spesifikke dokumenter. Funksjonen er basert på NORSOK-standard for ekstra kontroll på dokumenter. 

De prosjekt spesifikke dokumentene som opprettes vil ha en unik nummerering tilknyttet prosjektet. Dette gir deg god kontroll på alle dokumentene som skal sendes til kunde i ethvert prosjekt.

# Konfigurasjon av dokumentstyring premium

For å bruke dokumentstyring må det først defineres de ulike prosjekttypene som skal ha muligheten for å bruke ekstrafunksjonen, hvilke dokumentkategorier som skal inneha DMS-dokumenter, og hvor/hvorfor dokumenter skal appliseres. Dette gjøres i *Globale Attributter* under Admin modulen.

## BO konfigurering

Under overskriften *BO-konfigurasjon* finner du *Prosjekttype. *Under dette feltet kan du velge eksisterende prosjekttyper eller lage nye prosjekttyper som skal følge en DMS-mal. Nå du oppretter eller endrer på en eksisterende type skal du velge *Sidemal*. Velg da *DMS Prosjekt* for prosjektene som skal følge denne malen. Da vil arbeidsrommet alltid opprettes med Dokumentstyring premium funksjonene. 

## QDMS konfigurering

Under overskriften *QDMS-konfigurasjon* finner du *Dokumentkategori.* Under dette feltet kan du for eksisterende og nye dokumentkategorier velge om de gjelder for DMS dokumenter også. I feltet *Type* får du valg mellom QDMS, DMS eller begge dokumentstyringssystem. Skal en dokumentkategori inkludere DMS-dokumenter velger du *Begge*, men skal en dokumentkategori bare gjelde for DMS-dokumenter velger du *DMS.* 

## DMS konfigurering

Under overskriften *DMS-konfigurasjon* finner du feltene *Dokumentstatus* og *Applikasjon*. Under *Dokumentstatus* vil du få en oversikt over de ulike statusene et dokument kan ha gjennom en godkjenningsprosess. Under feltet *Applikasjon* kan du legge til egendefinerte applikasjoner med kode. Definer hvor/hvorfor dokumentet skal appliseres og skriv inn en relevant kode. Koden vil bli en del av dokumentnavnet med følgende tråd: 

*Prosjektnummer - Applikasjon - Dokumentkategori - Løpenummer - Dokument tittel 
*Eks: *F8164-MEC-CL-001 Product checklist*

## Prosjektinnstillinger på arbeidsrom

Når konfigurasjon i Admin - Globale attributter er gjennomført er de generelle systemverdiene for bruk av DMS satt. Disse kan endres på i senere tid, men er nå klar for bruk i systemet.

Prosjekter er ulike og det blir nå relevant å definere ulike verdier for enkelte prosjekter som er opprettet. Dette gjøres direkte fra arbeidsrommet sin venstremeny til prosjekt. 

### DMS Admin

Under *DMS Admin *kan du tildele ansatte faste roller for godkjenning av dokumenter som opprettes i arbeidsrommet. Da vil de ulike rollene alltid være tildelt de definerte ansatte når nytt dokument opprettes og sendes på godkjenning. Dette er en enkel liste med personvelgerfelt for de ulike rollene.

### Gyldighetsområde

Under *Gyldighetsområde* kan du definere spesifikke områder for hvor dokumenter gjelder for hvert enkelt prosjekt. Dette er en enkel liste med føringer i tittel-felt med område tittel. 

# Bruk i prosjekt-arbeidsrom

På arbeidsrommet til et DMS-prosjekt har du *Dokumentprofil* og *Publiserte dokumenter *lett tilgjengelig fra start. I* Dokumentprofilen* vil du, likt som dokumentprofil i QDMS, opprette nye dokumenter og sende på en arbeidsflyt. I *Publiserte dokumeter* vil du finne alle dokumenter som har vært gjennom en arbeidsflyt. 

## Opprette nytt dokument

Klikk på Dokumentprofil fra arbeidsrommets hovedside eller fra venstremenyen under deltet *DMS*. Inne på dokumentprofil klikker du på "Nytt Dokument" rett under søkelinjen.

Du får opp et panel på høyre side med felter som du skal fylle ut eller velge. 

Klikk på "Opprett Dokument" når du er ferdig. 

| Felt | Beskrivelse |
| --- | --- |
| **Dokument tittel** | Tittel på dokumentet |
| **Applikasjon** | Har samme funksjon som avdeling i QDMS, og definerer hvor/hvorfor dokumentet skal appliseres. Applikasjonene og kode defineres i globale attributter. Koden brukes som en del av dokumentnummeret. |
| **Dokument kategori** | Velg hvilken kategori dokumentet tilhører. |
| **Gyldighetsområde ** | Velg hvor dette dokumentet er gyldig. Valg for gyldighetsområde opprettes i prosjekt innstillinger i venstre fane på arbeidsrommet for det aktuelle prosjektet. |
| **Inkludert i** | Velg hvilket dokumentsett dette dokumentet er inkludert i. Her er det mulighet for flervalg. MRB - Manufacturer's Record Book MDL - Master Document List CMDL - Client Master Document List SMDL - Supplier Master Document List |
| **Dokumentkjede** | Velg hvor sterk kontroll du ønsker på dette dokumentet. Ref. verdiene satt i globale attributter. Hvilken dokumentkjede som brukes settes under oppretting av nytt dokument. |
| **Dokument ansvarlig** | Velg personen som har ansvar for å følge opp dokumentet. |
| **DCC Verifiserer ** | Velg personen som skal tilse at det er riktig dokumentkjede. Dette feltet er ikke obligatorisk. |
| **Verifiserer** | Velg personen som skal verifisere dokumentet før det blir sendt til godkjenning |
| **Godkjenner** | Velg personen som skal godkjenne dokumentet og publisere det. |
| **Lag fra** | Velg hvor du vil opprette dokument fra:- **DMS template **- System mal for DMS prosjekter - **DMS Profile** - Kontrollert mal med informasjon (opprettes i QDMS dokumentprofil) - **Another project** - Kopiere dokument fra et annet prsojekt - **This project** - Kopiere dokument fra dette prosjektet - **Attachment** - Laste inn vedlegg fra egen datamaskin  *Når du har huket av for en av forslagene ovenfor vil du få en nedfallsmeny basert på valget. Eksempelvis vil" DMS mal" vise de ulike malene som er av den typen***.**** ** |

## Dokumentkjede

I Business Online er det fem ulike dokumentkjeder. De ulike kjedene varierer basert på graden av godkjenning som kreves. 

- Default
- IFC-ABT
- IFR-IFC-ABT
- IDC-IFR-IFC-ABT
- DIC-IDC-IFR-IFC-ABT

| Forkortelse |  | Beskrivelse |
| --- | --- | --- |
| **DIC** | Draft for Internal Comment | Tidlige utkast av dokumenter deles internt for innledende tilbakemeldinger og justeringer. |
| **IDC** | Issued for Discipline Check | Dokumenter sendes for disiplinspesifikk sjekk for å sikre teknisk nøyaktighet og oppfyllelse av prosjektkrav. |
| **IFR** | Issued for Review | Dokumentene sendes til klient og interessenter for konseptuell og teknisk gjennomgang. |
| **IFC** | Issued for Construction | Godkjente og endelige dokumenter utstedes for å guide faktisk bygging og installasjon. |
| **ABT** | As Built | Dokumenter oppdateres til å reflektere det faktiske utførte arbeidet etter konstruksjonens ferdigstillelse. |

## Sende på godkjenning

Når du har endret på et dokument i dokument-mappen til prosjektet og er klar for å sende til kunde starter du en arbeidsflyt. 

Klikk på de tre prikkene ti høyre for dokumentnavnet.

Du får opp et panel på høyre side med felter som du skal fylle ut eller velge.

Klikk på "send" når du har fylt ut feltene. 

| Felt | Beskrivelse |
| --- | --- |
| **Godkjennings nivå** | Nedtrekksmeny for valg av godkjenningsnivå |
| **Tidsfrist** | Frist for når dokumentet på godkjennes |
| **DCC Verifiserer** | Personvelgerfelt for valg av person som settes som DCC Verifiserer |
| **Verifiserer** | Personvelgerfelt for valg av person som skal verifisere dokumentet |
| **Godkjenner** | Personvelgerfelt for valg av person som skal godkjenne dokumentet |
| **Publiserings format** | Feltet for hvilket format dokumentet skal publiseres i |
| **Kommentar** | Kommentarfelt til dokumentet |

### 3-stegs godkjenning

Dokumentene i prosjektet blir gjennomgått og godkjent av flere parter før de får en endelig godkjenning, noe som bidrar til å redusere feil og forbedrer kvaliteten på dokumentasjonen som sendes ut fra bedriften.

## Tilgang til dokumentenes historikk

Alle dokumenter har full versjons- og revisjonshistorikk slik at du alltid kan hente frem en tidligere versjon av dokumentet.

