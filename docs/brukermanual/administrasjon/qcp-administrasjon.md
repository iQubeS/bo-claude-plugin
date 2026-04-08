---
title: "QCP-administrasjon"
path: "administrasjon/qcp-administrasjon"
gitbook_id: "0QlbPjPK13pNqRTVvI6B"
---

# Hva er en QCP (kvalitetskontrollplan)?

![Eksempel på en QCP](gitbook-file:bXj6sLJrdwPbHs75QUDG)

En QCP sikrer at alle i organisasjonen jobber i henhold til de definerte forretningsprosessene. I hovedsak er det en sjekkliste som hjelper brukere i et arbeidsrom å følge den riktige prosessen for jobben som skal utføres.

# Hvordan man oppretter en QCP

## Oppretting og konfigurasjon

Naviger til Admin-huben og velg QCP Administrasjon.

Klikk på tannhjulet og velg ny QCP.

Du kan nå definere den nye kvalitetskontrollplanen med følgende alternativer:

| Felt | Beskrivelse |
| --- | --- |
| QCP Tittel | Tittel på kvalitetskontrollplanen.* (f.eks. utviklingsprosess)* |
| Hub/modul | Velg hub/modulen knyttet til listen du vil opprette en ny kvalitetskontrollplan for |
| Velg liste | Velg listen du vil opprette en ny QCP for. Nedtrekksmenyen vil bli filtrert basert på valgt hub |
| Velg kolonne | Dette vil vise alle relevante kolonner for å koble til en QCP *(f.eks. prosjekttype). *Som regel er det bare ett alternativ tilgjengelig. |
| Velg type | Velg typen *(f.eks. prosjekttype)* som skal koble QCPen til arbeidsrommet |

> 🚨 **DANGER**
> Velg kun en unik kombinasjon av kolonne og type for en liste. Hvis det er 2 QCPer koblet med samme kombinasjon, vil den første bli valgt.

## Administrer

Vi får nå muligheten til å administrere kvalitetskontrollplanen ved å opprette og endre fasene. 

**Opprette **en ny fase ved å klikke på **+ **ikonet til høyre for den siste fasen.

**Slett **en fase ved å klikke på X øverst til høyre i fasen.

Hver prosess administreres med versjonskontroll og [arbeidsflyt]().

> ⚠️ **WARNING**
> Husk å sende til godkjenning når du har oppdatert QCPen.

Bare den siste hovedversjonen av en QCP vil bli brukt av systemet.

Etter at du har klikket på en fase, får du et fasestyringsverktøy. Her kan brukeren som opprettet QCPen opprette og administrere de forskjellige fasene.

| Felt | Beskrivelse |
| --- | --- |
| Prosess fase | Gi et navn til fasen. |
| Sorteringsrekkefølge | Endre sorteringsrekkefølgen mellom fasene. |

## Fasedetaljer

I fasedetaljer-delen vil du kunne opprette og redigere sjekkpunktene under fasen. Det er her vi kan bygge sjekkpunkter med tilhørende funksjonalitet.

| Felt | Beskrivelse |
| --- | --- |
| Tittel * | Gi sjekkpunktet en tittel (obligatorisk felt) |
| Beskrivelse | Beskriv mer detaljert om sjekkpunktet, her støttes rik tekst |

**Tittel*** - Gi sjekkpunktet en tittel, obligatorisk felt.

**Beskrivelse **- Beskriv mer detaljert om sjekkpunktet, her støttes rik tekst.

![Fase detaljer](gitbook-file:N7byN4XfAlrhUIBP1ORQ)

# QCP funksjonalitet

## Linker

Her er det mulighet for å knytte et styrende dokument eller ekstern link til et fasesjekkpunkt. 

Det første alternativet er å velge en link til et [styrende dokument](). Med denne funksjonen kan du søke direkte i det godkjente dokumentbiblioteket og legge til en direkte link til dokumentet med lesetilgang.

Det andre alternativet er å kopiere en ekstern link og den kan limes direkte i feltet. 

Begge handlingene vil generere en link i QCP-nettdelen slik at sluttbrukeren enkelt kan få tilgang til riktig informasjon til rett tid. 

## Arbeidsfiler

Arbeidsfiler gjør det mulig å legge ved et styrende dokument til et sjekkpunkt. Det styrende dokumentet som blir lagt til her kopieres inn i arbeidsrommets dokumentbibliotek, hvor dokumentet deretter kan redigeres. 

## Triggere

Triggere kan brukes til å automatisk endre metadataverdier for et arbeidsrom (f.eks. endre status for et prosjekt når et trinn er fullført). Dette kan redusere manuell innsats for å oppdatere metadata basert på prosessfremdriften.

| Felt | Beskrivelse |
| --- | --- |
| QCP aksjon | Velg hvilken kontrollpunktstatus som skal utløse hendelsen. |
| Felttype | Velg hvilken felttype i arbeidsrommet som skal trigges. Her støttes *dato*- og *valg*-kolonnetyper. |
| Felt | De tilgjengelige feltene i arbeidsromslisten som kan utløses vil være synlige her. De tilgjengelige feltene er basert på hvilket listenavn QCPen er under (ProjectGeneral, Lead osv.) og hvilken *felttype* som ble valgt. |
| Dager | Hvis felttypen *dato *er valgt, har du muligheten til å sette en dato på forhånd for det valgte feltet. Hvis dager ikke er definert, angir det datoen sjekkpunktets aksjon endres. Hvis man definerer antallet dager vil datoen sjekkpunktets aksjon endres + antall dager bli satt som den nye datoverdien. |
| Status | Hvis felttypen *valg* ble valgt, vil status vise aktuelle verdier for det valgte feltet. De tilgjengelige statusene er basert på hvilket listenavn QCPen er under og hvilket *felt* som ble valgt. (F.eks. under listenavnet Personell er Felt = Land, og Status = Norge når dette sjekkpunktet er satt til fullført.) |

## Triggerskjemaer

Triggerkjemaer gjør det mulig for brukerne å åpne et skjema for registrering av nytt element relatert til et trinn i prosessen. (f.eks. fra [mulighet]() prosessen kan du nå sette det opp slik at det opprettes en kontrakt eller et leveringsprosjekt når en mulighet er vunnet.)

| Felt | Beskrivelse |
| --- | --- |
| Hub/Modul | Velg den relaterte huben/modulen |
| Liste | Velg listen hvor du vil opprette et nytt element. |
| Skjema | Systemet vil automatisk generere en link til det nye skjemaet. |

## Avhengighet

Det kan være behov for å sørge for at et trinn i prosessen ikke hoppes over. Dette kan oppnås ved å sette opp et avhengighetsforhold. 

| Felt | Beskrivelse |
| --- | --- |
| Fase | Velg i hvilken fase du ønsker at et sjekkpunkt skal fullføres før gjeldende sjekkpunkt kan utføres |
| Detaljer | Viser en liste over alle sjekkpunkter for den valgte fasen. Velg hvilket sjekkpunkt som skal fullføres før det gjeldene sjekkpunktet kan gjøres |

> ⚠️ **WARNING**
> Endebrukeren vil få opp en feilmelding hvis det forsøkes å hoppe over det relevante trinnet.

## Fremhev innhold

Hvis det er et avgjørende trinn i prosessen du vil fremheve på tidslinjen eller sende en varsel, kan du sette det opp ved å bruke *Fremhev innhold *funksjonaliteten. 

| Felt | Beskrivelse |
| --- | --- |
| Legg til tidslinje | Når et sjekkpunkt er fullført opprettes det en ny oppføring i [tidslinjen]() inne på arbeidsrommet. |
| Send notifikasjon | Velg en person som skal varsles når et sjekkpunkt er fullført (vanligvis brukt som en overlevering). |

# Arbeidsflyt

Alle QCPer må godkjennes før de er tilgjengelige i systemet. Når du først oppretter en prosess vil den bli avpublisert i versjon 0.0 [Hovedversjon, mindre versjon]. Bare hovedversjoner vil være tilgjengelige for systemet, og mindre versjoner vil bare være synlige fra QCP-Admininistrasjon verktøyet.  

Når en prosess er klar til å publiseres, kan brukeren klikke på **Send til godkjenning**-knappen. Denne handlingen vil åpne et panel som vises på høyre side.

| Felt | Beskrivelse |
| --- | --- |
| Godkjenner | Velg en bruker som skal gjennomgå og godkjenne QCPen |
| Forfallsdato | Velg en forfallsdato for godkjenningsoppgaven |
| Kommentar * | Skriv en kommentar til godkjenneren (obligatorisk felt) |
| Send | Tigger en arbeidsflyt |

## Godkjenningsadministrasjon

Når arbeidsflyten startes vil det genereres en oppgave med en e-post som sendes som en varsel til brukeren som er satt som godkjenner. 

![E-post varsel om godkjenning](gitbook-file:11mmfemk8z2LBEw5ck7x)

Godkjenningsoppgaven vil ligge på [Min side]() under Til gjennomgang.

Ved å klikke på linken fra oppgaven eller Vis-linken i e-posten vil brukeren bli omdirigert til godkjenningssiden. Her kan brukeren se gjennom den foreslåtte versjonen av prosessen og godkjenne eller avvise endringene ved å klikke på de tilsvarende knappene.

Når QCPen er godkjent vil en hovedversjon bli opprettet og den oppdaterte QCPen vil være tilgjengelig i systemet.

> ⚠️ **WARNING**
> Eksisterende arbeidsrom med QCPen vil ikke automatisk bli oppdatert.

Du kan se historikken til en QCP ved å klikke på tidsikonet. Dette åpner et sidepanel til høyre som viser hele historikken av alle arbeidsflyter for denne QCPen. 

![Prosessrevisjon](gitbook-file:PgI9oC7IDDq0FwJO59IL)

Inne i et arbeidsrom med en QCP oppfordres brukeren til å oppdatere denne.

