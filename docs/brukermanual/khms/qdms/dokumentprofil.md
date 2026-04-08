---
title: "Dokumentprofil"
path: "khms/qdms/dokumentprofil"
gitbook_id: "VLI4UC6UAuMp0WkbVBRU"
---

# Introduksjon

Dokumentprofilen, som du finner under KHMS modulen, er hvor du oppretter, sender til godkjenning og opprettholder alle [link](khms/qdms/styrende-dokumenter.md) i din bedrift. 

Der de styrende dokumentene befinner seg i et skrivebeskyttet bibliotek, tilgjengelig for hele bedriften, er dokumentprofilen et begrenset og spesialisert dokumentbibliotek med:

- Unike dokumentoppretting funksjoner
- Revisjonshistorikk
- En to-trinns arbeidsflyt for publisering av dokumenter

Disse er i samsvar med ulike standarder som ISO-9001:2015.

> 🚨 **DANGER**
> Når du oppretter dokumentprofiler, er den øvre filstørrelsen 100 MB per fil. Overskridelse av denne grenseverdien vil føre til at filen ikke publiseres. For å unngå dette problemet, endre størrelsen på all grafikk til en mindre størrelse.

# Generelt

Du navigerer til biblioteket ved å klikke på *Dokumentprofil* linken fra hurtigmenyen på KHMS modulen. Dokumentprofilen er et spesialisert dokumentbibliotek skreddersydd for håndtering av kildefilene til de styrende dokumentene.

## Søking

Søkefeltet i biblioteket er et aktivt filtreringsverktøy som trimmer ned listen over de kvalifiserte resultatene for ditt søk. Dokumentene vil trimmes ned til å bare vise det som samsvarer med ditt søk. 

Søkefeltet krever en inntasting av minimum 2 tegn og vil søke på tvers av alle kolonnene som er synlige i den valgte visning. 

> ⚠️ **WARNING**
> Merk at søk på flere kolonner ikke er mulig, som gjør at du ikke kan søke på dokumentnummeret og versjonen i samme søk. Delvise søk er mulig så lenge søket i søkefeltet inneholder det samme påfølgende sett med bokstaver som i kolonnen.

## Tillatelser

Dokumentprofilens dokumenter er ikke tilgjengelig for alle brukere. Slik som oversikten over [Tilgang]() viser er det bare personell i QDMS-DC rollen som har tilgang til å se, opprette og vedlikeholde styrende dokumenter. Systemadministratorer har heller ikke tilgang til biblioteket uten å ha denne rollen.

Personell i denne rollen kan

1. Opprette nye dokumenter
2. Endre dokumenter
3. Distribuere dokumenter for godkjenning.

Dokumenter som sendes til godkjenning til brukere utenom QDMS-DC rollen blir gitt noen midlertidige tilpassede tillatelser. Brukeren som skal godkjenne må kunne se dokumentet for å kunne ta en avgjørelse om godkjenning eller avvisning av arbeidsflyten.

Les mer om dokumentgodkjenning i *Arbeidsflyt *seksjonen.

## Dokumentprofil kolonner

Dokumentprofil-biblioteket inneholder en rekke kolonner du kan angi når du oppretter dokumentet, og noen som fylles ut automatisk basert på dokumentets godkjenningsstatus.

| Felt | Beskrivelse |
| --- | --- |
| Navn | Det fulle navnet på dokumentet er kombinasjonen av dokumentnummeret og tittelen på dokumentet |
| Avdeling | Avdelingen dokumentprofilen gjelder for |
| Dokumentkategori | Type dokument |
| Status | Gjeldende arbeidsflyt status for et dokument |
| Versjon | Den gjeldende SharePoint-versjonen av dokumentet |
| Revisjon | Det gjeldende revisjonsnummeret til dokumentet |
| Dokument ansvarlig | Brukeren merket som er ansvarlig for dokumentet |
| Verifiserer | Brukeren merket som er verifiserer av dokumentet |
| Godkjenner | Brukeren merket som er godkjenner på dokumentet |
| Godkjent av | Brukeren som sist godkjente dokumentet. Denne brukeren kan være forskjellig fra brukeren i «Godkjenner»-feltet fordi brukeren som startet arbeidsflyten endret den før sending av arbeidsflyten, eller den siste godkjenneren ble endret etter første godkjenning. |
| Godkjenningsdato | Siste dato dokumentet ble godkjent |

### Dokumentnavn

Navnet består av dokumentnummeret og tittelen på dokumentet. Tittelen legges inn ved opprettelse av dokument, og nummeret genereres basert på avdeling og dokumentkategori satt, etterfulgt av et serienummer for hver kombinasjon av disse.

Hver avdelings- og dokumentkategori verdi er knyttet til en kode som oversetter tekstverdien til en forkortet streng.

Eksempel:

| Tittel | Avdeling | Dokument kategori | Dokument nummer |
| --- | --- | --- | --- |
| HMS manual | KHMS | Prosedyre | KHMS-PROS-001 |
| Prosjekt evaluering | KHMS | Prosedyre | KHMS-PROS-002 |
| Utstyrsjustering | Drift | Instruksjon | DRI-INSTR-001 |

Se Avdeling og Dokumentkategori under QDMS-konfigurasjon for å sette opp disse valg-verdiene og tilhørende koder. 

### Status

Verdien i denne kolonnen angir hvor dokumentet er i godkjenningen eller om den er sendt til godkjenning. Denne verdien og versjon-/revisjonsnummeret angir om filen er blitt publisert. 

Hvis versjon/revisjon har verdi på 1.0 eller mer har dokumentet blitt godkjent hvert fall en gang. Dokumentet vil nå være et publisert dokument i Styrende dokumenter.

### Versjon og revisjon

Versjonen er SharePoint-versjonssystemet for et dokumentbibliotek. Revisjonen inneholder bare det en SharePoint-versjon vil kalle en hovedversjon, som er den publiserte versjonen av et dokument.

Versjonen har en mindre versjon for hvert dokument og endringer utført på dokumentet. Revisjonen oppdateres kun når et dokument er godkjent og publisert til styrende dokumenter.

# Dokumenthåndtering

Det spesialiserte dokumentbiblioteket inneholder noen funksjoner for å legge til og vedlikeholde dokumenter på en strukturert måte. Du kan samhandle med eksisterende filer ved å

1. Klikk på **+ Nytt dokument** for å opprette en ny dokumentprofil
2. Klikk på dokumentnavnet for å åpne dokumentet
3. Klikk på de tre prikkene for å åpne nedtrekksmenyen

## Opprette en ny dokumentprofil

For å lage en ny dokumentprofil klikker du på **+ Nytt dokument** i toppen av venstre hjørne, under søkefeltet. Det vil nå åpnes et skjema på høyre side av skjermen.

| Felt | Beskrivelse |
| --- | --- |
| Dokument tittel | Tittelen på dokumentet. Dette vil bli brukt til å generere dokumentnavnet. |
| Opprett fra | Velg hva du vil at det nye dokumentet skal være basert på. Se informasjonen etter tabellen for en beskrivelse av de tilgjengelige valgene. |
| Avdeling | Avdelingen det nye dokumentet skal tilhøre. Dette vil bli brukt til å generere dokumentnummer navnet. |
| Dokumentkategori | Dokumentkategorien dokumentet skal tilhøre. Dette vil bli brukt til å generer dokumentnummer navnet. |
| Dokumentansvarlig | Brukeren i din bedrift som er ansvarlig for å vedlikeholde dette dokumentet. |
| Neste revisjonsdato | Neste dato dette dokumentet bør revideres. |
| Verifiserer | Brukeren merket som er verifiserer av dokumentet |
| Godkjenner | Brukeren som normalt skal godkjenne dette dokumentet etter verifisering. |

### Opprett fra

Dette er et sentralt valg når du oppretter et nytt dokument i Dokumentprofil. 

***Mal***** **- Liste over systemmaler som inneholder selskapets godkjente fargeskjema og metadata plassholdere for bruk i fremtidige dokumenter. Dette bør være grunnlaget for alle Word-dokumenter i dokumentprofilen.

Hvis dokumentet er sannsynlig til å bli importert til prosjekter (vanligvis arbeidsdokumenter for prosjekter eller CRM-huben), velger du systemmalene med "Arbeidsrom" i dem. Disse dokumentene vil inkludere metadataen for arbeidsområdets dokumentnummer og revisjon, ikke bare dokumentnummeret og revisjonen generert i Dokumentprofil.

> ℹ️ **INFO**
> Valgene som er oppført her kan betraktes som "maler for malene". De brukes vanligvis ikke som arbeidsdokumenter direkte, men legger grunnlaget for nye arbeidsdokumenter du oppretter i Dokumentprofil.

***Profil**** - *Liste av alle dokumenter i Dokumentprofil biblioteket. Bruk denne til å basere det nye dokumentet på et eksisterende dokument i systemet. Den vil bruke basisinnholdet til å lage en helt fersk fil med eget innhold og metadata.

***Vedlegg**** - *Velg en fil fra din lokale lagringsstasjon som du vil laste opp til dokumentprofilen som kan godkjennes til å bli et styrende dokument. Du kan revidere vedleggsfilen til enhver tid ved å klikke på **rediger **og deretter erstatte filen. Dokumentet vil få statusen draft og må deretter sendes på en ny arbeidsflyt for å bli publisert i styrende dokumenter.

### Neste revisjonsdato

Dette datofeltet er valgfritt, men lar deg angi påminnelser for revisjon av visse dokumenter som må revideres med en bestemt frekvens eller beskriver en sak som er utsatt for hyppige endringer. Dette kan føre til at innholdet blir utdatert hvis det ikke vedlikeholdes jevnlig.

En påminnelse vil bli sendt til *dokument ansvarlig * 30, 14 og 7 dager før den satte dato (gitt at dokumentet ikke har fått en ny revisjonsdato innen da).

### Verifiserer / godkjenner

Brukerne satt i disse feltene er personer med kvalitetssikring og/eller lederrolle som skal avgjøre om et dokument er godt nok til å publiseres eller ikke. Feltene er imidlertid ikke låste og kan endres etter at dokumentet er opprettet og før dokumentet sendes til godkjenning.

> ℹ️ **INFO**
> Det er ingen begrensning for å ha samme verifiserer og godkjenner, og det er heller ingen validering for å begrense brukere som oppretter dokumentene for å verifisere eller godkjenne dem.

## Endre en dokumentprofil

Det er to typer endringer du kan gjøre i et dokument. Det første er å gjøre endringer i selve dokumentet, og det andre er å redigere dokumentet sine egenskaper. Begge disse handlingene vil resultere i en mindre versjonsøkning, og krever at dokumentet godkjennes for å få endringene publisert i Styrende dokumenter.

### Redigering av dokumentet

For å redigere et dokument, klikk ganske enkelt på dokumentnavnet. Dette vil be applikasjonen om å åpne dokumentet direkte for redigering.

> ℹ️ **INFO**
> Merk at en endring av dokumentet vil øke versjonsnummeret en gang per åpning og lukking av dokumentet (eller redigeringsøkt). Det spiller ingen rolle hvor mange ganger du lagrer når du har dokumentet åpent.

### Redigering av dokumentegenskapene

For å redigere dokumentegenskapene, klikk på "Rediger dokument" fra nedtrekksmenyen for dokumentet. Dette vil åpne redigeringsskjemaet på høyre side.

Herfra kan du endre de fleste detaljene du kan angi når du oppretter filen, med unntak av avdeling og dokumentkategori.

> 🚨 **DANGER**
> Dokumentnummeret blir utgjort av avdelingen og dokumentkategorien og det er derfor ikke mulig å endre avdeling eller dokumentkategori etter at dokumentet er opprettet. For å endre disse må du gjenskape dokumentet basert på dokumentprofilen av gjeldende dokument og ugylddiggjøre sistnevnte etter det nye er opprettet.

## Arbeidsflyt

Arbeidsflyten er en sentral funksjon i dokumentprofil biblioteket. Det er en godkjenningsprosess på to nivåer, hvor en **opphavsmann** setter i gang arbeidsflyten ved å sende en verifiseringsforespørsel til en **verifiserer** som igjen markerer dokumentet klart til å bli gjennomgått av den endelige rollen – **godkjenner**. 

![Flytskjema for arbeidsflyten](gitbook-file:QEnUKsn7iP3zJYVFlnJI)

Arbeidssflyten sikrer at alle filer er kvalitetssikret og godkjent av riktig personell før de publiseres til [link](khms/qdms/styrende-dokumenter.md) og gjøres tilgjengelig for hele bedriften.

### Opphavsmann

Opphavsmannen er personen som starter arbeidssflyten. Det er vanligvis (men ikke nødvendigvis) samme bruker som er ansvarlig for dokumentet.

### Sendes for godkjenning

For å starte arbeidsflyten, velg *Send til verifisering og godkjenning* i dokumentprofilens nedtrekksmeny. Dette vil åpne skjemaet for godkjenningsforespørsel på høyre side.

| Felt | Beskrivelse |
| --- | --- |
| Forfallsdato | Datoen handlingen skal utføres innen. Settes som standard til dagens dato. |
| Verifiserer | Verifisereren som er definert i dokumentets egenskaper. Kan erstattes i skjemaet. |
| Godkjenner | Godkjenneren som er definert i dokumentets egenskaper. Kan erstatted i skjemaet. |
| Publiseringsformat | Dokumenttypen dokumentet skal publiseres som i Styrende dokumenter |
| Kommentar | En kommentar som opphavsmannen kan sende som en melding til verifisereren og godkjenneren. Verifisereren og godkjenneren vil kunne se kommentaren i godkjenningsskjemaene sine. |

### Verifiserer

Verifisereren er personen som har i oppgave å se over dokumentet før det blir sendt til godkjenneren og dermed publisert. Verifisererens funksjon er å

- Redusere tiden brukt til å se over dokumentet av godkjenneren
- Redusere sjansen for å gå glipp av noe ved å ha et ekstra sett med øyne før godkjenning

Verifisereren kan finne godkjenningsoppgave på *Min side, *fra en av varslene distribuert via e-mail eller Teams eller direkte fra dokumentprofilen.

Verifisereren kan se opphavsmannens kommentar under dokumentdetaljene og åpne dokumentet ved å klikke på dokumenttittelen.

Hvis verifisereren avviser vil arbeidsflyten tilbakestilles og *Dokument status* vil bli satt til *Avvist*. Hvis verifisereren godkjenner vil arbeidsflyten fortsette til godkjenneren. 

### Godkjenner

Godkjenneren er den som mottar godkjenningsoppgaven fra opphavsmannen. Godkjenneren har som oppgave å være det avgjørende leddet som bestemmer om dokumentet publiseres til Styrende dokumenter eller ikke.

Godkjenneren kan finne godkjenningsoppgavene på *Min side, *fra en av varslene distribuert via e-mail eller Teams eller direkte fra dokumentprofilen.

I godkjenningsskjemaet kan godkjenneren se opphavsmannens kommentar og godkjenningskommentaren fra verifisereren. Dokumentet kan nås ved å klikke på *Dokumenttittel* linken. 

Hvis dokumentet blir **avvist **vil arbeidsflyten tilbakestilles og *Dokumentstatus *vil bli satt til *Avvist*. Hvis dokumentet har blitt **godkjent **vil det bli publisert til styrende dokumenter med gjeldende metadata, dokumentversjon og publisert i filformatet definert i *Publiserings format*. I dokumentprofil biblioteket vil dokumentet

- Øke hovedversjonen og tilbakestille den mindre versjonen til 0
- Øke revisjonen
- Sette dokumentstatus til Publisert

Et varsel vil også bli distribuert til opphavsmannen via e-post og Teams.

### Publiseringsformat

Hvis du velger **PDF**, konverteres dokumentet til en PDF-fil når det publiseres til biblioteket for styrende dokumenter.

> ⚠️ **WARNING**
> Ikke alle filtyper støtter publisering til PDF. Du vil motta en advarsel i skjemaet hvis du prøver å publisere en filtype som ikke støttes.

Hvis du velger **Opprinnelig**, publiseres dokumentet i gjeldende dokumenttype når det publiseres til Styrende dokumenter biblioteket.

Det er også en begrensning som advares om når du holder musepekeren over varsel ikonet.

Publiseringsformatet kan kun angis for første gangs godkjenning av dokumentet. Alle fremtidige godkjenninger vil publisere dokumentet i formatet det først ble publisert som.

> ℹ️ **INFO**
> Hvis du trenger å publisere dokumentet tilbake til opprinnelig format må du lage et nytt dokument basert på det gamle. Ugylddiggjør det gamle, og husk å publisere i riktig format.

## Ugyldiggjøring, versjons- og revisjonshistorikk for et dokument

### Revisjonshistorikk

Revisjonshistorikken viser alle store endringer i dokumentets tilstand når det gjelder interaksjon.

For å åpne revisjonshistorikken trykker du på valget *Revisjonshistorikk* fra nedtrekksmenyen i dokumentprofilen.

Hver historikkoppføring genereres med

- Brukeren som utførte handlingen
- Datoen da handlingen skjedde
- Versjonen og revisjonen etter handlingen ble gjort

Det blir generert en historikkoppføring for

- Når dokumentet ble opprettet
- Iverksatte arbeidsflyter
- Verifikasjon og godkjenning som ble avvist eller godkjent
- Arbeidsflyt som ble kansellert eller sendt på nytt
- Publiserte hendelser

> ℹ️ **INFO**
> Alle disse handlingene kan leses fra , men kan oppleves for detaljert slik at det er vanskelig å se de store strekene på grunn av alle handlingene som er skrevet i mange mindre versjoner av logikken.

### Versjonshistorikk

I nedtrekksmenyen vil du også ha tilgang til den detaljerte versjonshistorikken. Her vises alle kolonneendringer og gir tilgang til å se dokumenter i tidligere versjoner. 

For å se versjonshistorikken til en dokumentprofil trykker du på nedtrekksmenyen og velger *Versjonshistorikk*. 

Versjonshistorikken vil begynne å laste i et overlegg i midten av nettleservinduet. Her kan du se alle endringer som er gjort i et dokument i alle stadier av endringshistorikken. Du kan lese mer om SharePoint-versjonshistorikk i den offisielle Microsoft-dokumentasjonen linket nedenfor, men nedenfor er noen nøkkelfunksjoner:

- Se dokumentinnholdets tidligere mindre eller større versjoner. Inne i Office-applikasjonen (som Word) kan du så se en oversikt over endringene
- Kolonneendringer utført av handlinger i dokumentet. Mange av disse er skjulte kolonner som bare brukes av koden for å spore verdier i arbeidsflyten
- Overvåk filstørrelsesendringer per versjon (for å identifisere hvor et stort bilde ble satt inn for eksempel)
- Gjenopprett tidligere versjoner til gjeldende versjon

🔗 **Embed:** [https://support.microsoft.com/nb-no/office/vise-versjonsloggen-for-et-element-eller-en-fil-i-en-liste-eller-et-bibliotek-53262060-5092-424d-a50b-c798b0ec32b1](https://support.microsoft.com/nb-no/office/vise-versjonsloggen-for-et-element-eller-en-fil-i-en-liste-eller-et-bibliotek-53262060-5092-424d-a50b-c798b0ec32b1)

### Ugyldiggjøring

Selv ikke brukere med den høyeste tillatelse kan fjerne et dokument fra dokumentprofil biblioteket ved å slette det på den tradisjonelle måten. Et dokument i dokumentprofilen anses å være kontrollert på flere måter og for å kunne fjerne dette må det ugyldiggjøres. Da vil dokumentet bli fjernet i dokumentprofilen og styrende dokumenter.

Et dokument ugyldiggjøres ved at en leder eller en kollega godkjenner at det er greit å fjerne dokumentet. Ugyldiggjøring startes fra nedtrekksmenyen for dokumentprofil.

Rediger forfallsdatoen hvis det ikke haster og legg til en kommentar som forklarer godkjenneren hvorfor det skal ugyldiggjøres. Standardverdien i godkjennerfeltet vil være brukeren definert som *godkjenner.* 

En godkjenningsoppgave sendes til godkjenneren du har satt, og de kan åpne godkjenningsskjemaet fra oppgaven i Min side eller fra en av varslene systemet mottar angående forespørselen.

På denne siden kan godkjenneren enten godkjenne eller avvise ugyldiggjøring-forespørsel basert på dokumentinformasjonen og opphavspersonens kommentar. 

> ℹ️ **INFO**
> Dokumentet er teknisk sett ikke slettet etter ugyldiggjøring. Alle tillatelser er fjernet, og ugyldig status er filtrert ut fra alle visninger. Kontakt kundestøtte hvis et ugyldig dokument må gjenopprettes.

## Avbryt eller send på nytt

Hvis verifisereren eller godkjenneren ikke har gått gjennom arbeidsflyten enda er det en funksjon for å kansellere arbeidsflyten eller sende den på nytt. Motivet for dette kan være hva som helst, men er vanligvis knyttet til

- Du finner feil du ønsker å fikse etter at arbeidsflyten har startet
- Varsle brukerne på nytt som du vil vurdere og godkjenne

Velg *Avbryt eller Send på nytt* fra dokumentprofilens nedtrekksmeny.

Skjemaet for Avbryt eller Send på nytt vises på høyre side etter å ha bekreftet valget.

Skjemaet vil vise informasjon om dokumentet og arbeidsflytstatusen. Klikk på ikonene *Avbryt *eller* Send på nytt *for å stoppe eller sende arbeidsflyt-oppgavene på nytt.

Dokumentstatusen vil bli oppdatert til *Arbeidsflyt avbrutt* hvis du velger å avbryte den. Statusen forblir i samme status hvis den sendes på nytt.

