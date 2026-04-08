---
title: "Bedrifter"
description: "Alle eksterne relasjoner"
path: "crm/bedrifter"
gitbook_id: "f6cQL3SoBbndv02bP6bA"
---

# Introduksjon

Bedriftslisten er et register for alle eksterne relasjoner og er en sentral del av CRM hubben i Business Online. Huben hjelper å holde styr på alle aspekter en bedrift er involvert i, enten det er en kontrakt, et prosjekt eller en KHMS rapport.

Huben vil gi en oversikt over nyttige rapporter som kunder, leverandører, prospekter og mer. 

# Bedriftslisten

Alle eksterne bedrifter din bedrift har med å gjøre vil være i denne listen. Selve listen har noen gode funksjoner og kolonneformateringer, hvor du vil ha muligheten til å endre visningen som filtrerer listen basert på dine behov. Bedriftslisten er en liste som fort vokser seg stor, noe som gjør visningsfiltrering viktig.

Se [Microsoft Dokumentasjon]() på SharePoint lister for ytterligere utdypning av listeverktøyene.

## Opprette en bedrift

For å opprette et nytt element kan du klikke på "Bedrift" under "opprett ny" fra hurtigmenyen på siden, eller ved å klikke på "Bedrift" i CRM huben og dermed klikke på "+ Ny" på listenivået. Når skjemaet åpnes kan du begynne å legge inn  bedriftsdetaljene.

| Felt | Beskrivelse |
| --- | --- |
| Finn bedrift | Dette er en svært nyttig funksjon hvor du kan slå opp en bedrift i en forespørsel til Brønnøysundregisteret. Når en bedrift er bekreftet, vil dataene som er tilgjengelige fra registeret bli skrevet til skjemaet |
| Bedriftsnavn | Navnet til bedriften |
| Opprett mulighet | Kryss av for dette hvis du vil generere en ny mulighet når du bekrefter detaljene til denne bedriften. Brukes vanligvis når du oppretter et prospekt eller kunde |
| Bedriftstype | Definer hvilken type bedrift det er |
| Organisasjonsnummer | Legg inn bedriftens organisasjonsnummer |
| Intern ansvarlig | Angi en intern bruker som intern ansvarlig for denne bedriften |
| Telefonnummer | Legg inn bedriftens offisielle telefonnummer |
| Epost | Legg inn den offisielle eposten til bedriften |
| Nettside | Legg inn nettadressen og legg til en beskrivelse som f.eks. "Nettside". Du kan legge inn nettadressen i begge feltene, men hvis nettadressen er lang vil den se dårlig ut i listen |
| Opprett Teams | Sjekk om det skal genereres et team for bedriften. Den er avmerket som standard |
| Aktiv | Sjekk om bedriften er aktiv, eller om den er registrert for arkivformål. Dette er et veldig normalt filterkriterium for listevisninger og oppslag for å unngå å inkludere ikke-aktive bedrifter |
| Adresse | Bedriftens hovedadresse |
| Post adresse | Bedriftens postboksadresse |
| Hovedkontaktens navn | Navnet på bedriftens hovedkontakt |
| Hovedkontaktens jobb tittel | Hovedkontaktens tittel |
| Hovedkontaktens epost | Epost adressen til hovedkontakten |
| Hovedkontaktens telefon | Telefonnummeret til hovedkontakten |

> ℹ️ **INFO**
> Hvis du valgte "leverandør" som bedriftstype vil det være noen ekstra felt tilgjengelig når du redigerer skjemaet. Se  for mer informasjon om dette.

### Finn bedrift

Direkte forespørsel til Brønnøysund bedriftsregister som, ved bekreftelse, vil kopiere data fra registeret direkte til ditt registreringsskjema.

Den vil automatisk utfylle følgende felt:

- Bedriftsnavn
- Organisasjonsnummer
- Nettside
- Adresse
- Postadresse

To grunner til at dette er viktig:

1. Feltene som blir utfylt er tidkrevende å hente på egenhånd
2. Dataen som blir hentet fra Brønnøysund registeret er den siste oppdaterte publiserte informasjonen om bedriften.

### Opprett en mulighet

Når denne er merket av vil et felt kalt "Mulighetens navn" vises under som lar deg definere navnet på muligheten. Når bedriftsskjemaet er blitt lagret vil muligheten og det tilhørende arbeidsrommet bli generert og vist i menyen på bedriftens arbeidsrom.

> ℹ️ **INFO**
> Det er tidsbesparende å bruke denne funksjonen om du ofte registrerer prospekter og alle er relatert til muligheter.

### Opprett Teams

Å avmerke dette valget vil generere et Team, i Teams applikasjonen, tilknyttet det tilhørende arbeidsrommet. Teamet vil inneholde alle Teams relaterte funksjoner som er tett tilknyttet andre komponenter i arbeidsrommet (Planner, Notebook, dokumenter osv.).

### Hovedkontakt

Mens du registrerer en bedrift vil du møte en rekke felt som er relatert til bedriftens hovedkontakt. Disse detaljene brukes i en bakgrunnsprosess som genererer kontakten i [link](crm/kontakter.md) listen. I likhet med å opprette en mulighet er dette en prosess som er designet for å spare deg tid når du registrerer informasjonen om en bedrift.

## Link

Etter å ha lagt til en bedrift vil det bli generert et tilhørende arbeidsrom. Når prosessen er fullført vil linken vises som et ikon i link-kolonnen.

![bilde](gitbook-file:eTz5vFVbX0kcH4l2sAr6)

Ved å klikke på ikonet vil det åpnes en ny fane med arbeidsrommet, dette blir forklart videre i avsnittet .

> ℹ️ **INFO**
> Dette er en bakgrunnsprosess som kan ta alt fra 1-3 minutter, avhengig av aktivitetsnivået på serveren.

## Endre bedriftsdetaljer

For å endre detaljene til en bedrift klikker du på bedriftnavnet i listen. Når du kommer inn i visningsskjema trykker du rediger øverts til venstre. 

Endringer du gjør i feltene vil bli lagret når du trykker på "Lagre".

### Leverandørklassifisering

Hvis gjeldene *bedriftstype* er "Leverandør" vil det være et ekstra sett med felt for å klassifisere leverandøren.  

| Felt | Beskrivelse |
| --- | --- |
| Leverandør kategori | Kategoriser leverandøren etter beregningen av hvor kritisk virksomheten din er avhengig av leveringen. |
| Godkjent leverandør | Angi godkjenningsstatus for leverandøren. Valget vil være betinget formatert i listen basert på inndataen. |
| ISO9001 sertifisert | Ja / Nei valg for å angi om leverandøren er ISO 9001 sertifisert eller ikke. Brukes hovedsakelig for å raskt filtrere ut alle sertifiserte selskaper. |
| Leverandør evaluering | Tekstfelt for å utarbeide en leverandørvurdering om det er relevant. |

## Slette en bedrift

En bedrift kan slettes fra tre-prikker hurtigmenyen, eller ved å velge elementet og trykke på delete-kanppen på tastaturet. Et pop-up vindu som ber om bekreftelse på sletting vil vises. 

![bilde](gitbook-file:L9tETswQgTCn6HjsFQJ2)

Hvis en bedrift slettes, vil alle tilknyttede muligheter og kontrakter også bli slettet. Det anbefales derfor å bruke funksjonen for å sette en bedrifts status til Aktiv eller Inaktiv. Dette gir en bedre oversikt over om bedriften fortsatt har verdi for virksomheten din.

> 🚨 **DANGER**
> Slett element funksjonaliteten skal kun brukes hvis bedriften ikke har noen arkivert verdi. 

Bedrifter kan, og bør, arkiveres ved å [redigere]() statusen til ja/nei for aktiv.

# Bedriftens arbeidsrom

Arbeidsrommet er hvor all informasjon og statusoppdatering for en bedrift blir lagret, enten manuelt eller hentet fra andre parter av systemet.

![bilde](gitbook-file:m7D4pyG7XV1qDwyAXplE)

Forsiden er utstyrt med standard arbeidsromskomponenter som[link](komponenter/tidslinje.md) og [link](komponenter/informasjonskort.md), og med mulighet for [link](komponenter/qcp-kvalitetskontrollplan.md). Det er også en visning av General-mappen i arbeidsrommets dokumentbibliotek som kan inneholde forhåndsgenererte mapper og dokumenter fra styrende dokumenter. I likhet med andre arbeidsrom kan alle dokumenter sendes på en godkjenningsflyt med [link](komponenter/godkjenning-pa-arbeidsrom.md).

Gruppekalender-komponenten kan synkroniseres med Conversations fanen i arbeidsrommet. I denne komponenten vil alle møter som arbeidsrommet er invitert til, som en deltager, vises. Under gruppekalenderen er et forhåndsdefinert utvalg av bedriftskontakter og interne ressurser vist. 

Hurtiglinkmenyen kobler alle standard arbeidsroms funksjonaliteter som conversations, Notebook, Planner, dokumenter, godkjente dokumenter, eksterne kontakter og interne ressurser. 

Det som er ulikt med bedriftens arbeidsrom er kontrakter, muligheter og KHMS saker funksjonene. Disse komponentene viser data fra kontrakt, mulighet og KHMS rapporterings listene som er blitt tilknyttet bedriften. Nye elementer kan også bli opprettet direkte fra disse komponentene i de tilsvarende listene.

## QCP

En QCP i en bedrift er typisk en livssyklus QCP likt som for personell. For en leverandør, som eksempel, kan de første fasene være hvordan man vurderer leverandøren og hvilke arbeidsoppgaver man skal utføre for godkjenning av en ny leverandør.

> ℹ️ **INFO**
> QCPer på en bedrift sitt arbeidsrom er ikke ofte brukt men kan være nyttig hvis den er opprettet på riktig måte.

## Tidslinje

Tidslinjen i bedriftens arbeidsrom vil ha referanser generert for følgende tilknytninger som er opprettet i systemet:

- Prosjekt opprettet
- Mulighet opprettet
- Kontrakt opprettet

## Dokumentbibliotek

Dokumentbiblioteket i bedriftens arbeidsrom inneholder alle standard Microsoft-funksjoner i tillegg til å kunne motta forhåndsgenererte mappestrukturer fra [link](administrasjon/globale-attributter/dokument-mappestrukturer.md), sende dokumenter for godkjenning ved å bruke [link](komponenter/godkjenning-pa-arbeidsrom.md), og importere styrende dokumenter ved å bruke [link](komponenter/cd-filer.md) verktøyet.

## Kontrakter

Kontraktssiden vil vise alle kontrakter registrert for denne bedriften (både aktive og lukkede). Du kan også opprette nye kontrakter herfra hvor den nye kontrakten automatisk blir tilknyttet den gjeldende bedriften.

![bilde](gitbook-file:Yhhub86bIwIcP4FE8NPL)

### Godkjente dokumenter

Når et dokument er godkjent, publiseres det i **Godkjente dokumenter** biblioteket i formatet som er valgt av opphavsmannen.

📄 **Se også:** [komponenter/godkjenning-pa-arbeidsrom.md](komponenter/godkjenning-pa-arbeidsrom.md)

> ℹ️ **INFO**
> Et dokument vil først få sin første revisjon etter at det er godkjent minst en gang.

## Muligheter

Denne siden vil vise alle muligheter som er registrert for denne bedriften (både aktive og lukkede). Du kan også opprette nye muligheter fra denne visningen og disse vil automatisk være tilknyttet den aktuelle bedriften.

![bilde](gitbook-file:kNrR9VMH9negbUtEW6Hm)

## KHMS saker

Siden vil vise alle KHMS saker som er registrert og tilknyttet den aktuelle bedriften. I tillegg, for å gi rask tilgang til eksisterende saker, kan du også opprette nye saker herfra hvor de automatisk blir knyttet til gjeldende bedrift.

![bilde](gitbook-file:SfbnqXJgIdGixielRe4B)

