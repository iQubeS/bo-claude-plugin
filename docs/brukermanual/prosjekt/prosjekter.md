---
title: "Prosjekter"
description: "En liste som viser en tilpassbar oversikt over dine prosjekter"
path: "prosjekt/prosjekter"
gitbook_id: "OcQEaCeyKHiCj5YRhc9g"
---

# Introduksjon

Prosjektlisten er der det meste av det operative arbeidet skal foregå. Gjennom tilpassbare visninger og filtre viser listen en oversikt over bedriftens prosjekter.

![bilde](gitbook-file:HbferGlzI7lXF5dMO150)

## Tilgjengelighet

Som man kan se i [tilgangsmatrisen]() er ideen å gjøre prosjektene lett tilgjengelige for å tillate informasjonsdeling og samarbeid. Om nødvendig kan tilgangsnivået til et enkelt prosjekt være strengt begrenset.

# Opprette et nytt prosjekt

Et nytt prosjekt kan opprettes ved å klikke på "+ Ny" knappen, som vil omdirigere brukeren til et registreringsskjema.

Bruk skjemaet for å fylle inn prosjektets relevante data.

> ℹ️ **INFO**
> De tilgjengelige prosjekttypene avhenger av den valgte avdelingen.

Standard prosjektskjema viser følgende seksjoner og felt.

| Felt | Beskrivelse |
| --- | --- |
| Prosjektnavn * | Prosjektnavn eller tittel |
| Avdeling * | Relevant avdeling |
| Prosjekttype * | Relevant prosjekttype. Vil vise en liste over prosjekttyper avhengig av valgt avdeling |
| Bedrift | Relevant bedrift |
| Prosjektansvarlig * | Prosjektansvarlig. Krever en gyldig Business Online-bruker og brukernavn |

> ⚠️ **WARNING**
> Noen felt, merket med rød *, er obligatoriske for at prosjektet skal kunne opprettes.

**Prosjektinformasjon**

| Felt | Beskrivelse |
| --- | --- |
| Opprett Teams | Oppretter en intern Teams-kanal for prosjektet |
| [Del prosjekt]() | Oppretter en ekstern Teams-kanal for prosjektet |
| Begrenset | Begrenser prosjektarbeidsrommets tilgangsnivå til brukeren som oppretter prosjektet, prosjektansvarlig og [interne ressurser]() |
| Beskrivelse | Prosjektbeskrivelse |
| Startdato | Prosjektets startdato. |
| Sluttdato | Prosjektets planlegger eller faktisk sluttdato. |
| Status | Nåværende prosjektstatus. |

> ⚠️ **WARNING**
> Når et prosjekt er satt til begrenset, kan det ikke endres tilbake, og det samme gjelder hvis prosjektet er åpent.

**Prosjektforbindelser**

| Felt | Beskrivelse |
| --- | --- |
| Mulighet | Knytter relevante muligheter til prosjektet. |
| Kontrakt | Knytter relevante kontrakter til prosjektet. |

Når det nye prosjektet er lagret, ved å bruke **Lagre**-knappen øverst eller nederst i skjemaet, opprettes et nytt element.

> ✅ **SUCCESS**
> Etter noen sekunder vises en link til prosjektets [arbeidsrom](), som er prosjektets operasjonelle plattform.

![bilde](gitbook-file:7r9u7ALjOGdPeA51L3XT)

# Redigere et eksisterende prosjekt

Et prosjekt kan oppdateres eller redigeres gjennom prosjektelementets redigeringsskjema.

Når endringene er tatt i bruk bruker du **Lagre**-knappen øverst eller nederst i skjemaet.

## Hvorfor redigere?

Hensikten med å redigere et prosjektelement kan f.eks. være å oppdatere aktivitetsstatusen. Hvis du setter et prosjekt sin status til fullført, som du kan se nedenfor, skjules det automatisk fra alle listevisninger over aktive prosjekter.

## Vise et eksisterende prosjekts data

Klikk på prosjektnavnet for å vise prosjektelementets data. Merk at dataene ikke kan redigeres gjennom dette skjemaet. Visningsskjemaet kan være nyttig for f.eks. rapporteringsformål.

# Helseindikator

Prosjektlisten har en kolonne som heter Helse som indikerer om et avvik, risiko eller oppgave trenger oppmerksomhet.

![bilde](gitbook-file:ywM7ZmaR1QDW1Az0gqYT)

Ved å holde musepekeren over indikatoren kan du se prosjektets helse delt opp i tre: avvik, risiko og oppgaver. Som standard vil helseindikatoren være grå når ingen avvik, risikoer eller oppgaver er registrert for prosjektet.

![bilde](gitbook-file:fI0JOHxB6dEhYXqSWi5e)

Som vist på bildet over er helseindikatoren rød. Hvis en av de tre helseindikatorene for prosjektet er røde, vil den generelle indikatoren også være rød. I dette tilfellet er det visse oppgaver som avviker fra dagens mål. Helseindikatoren beregnes av:

**Avvik**: 
Rød = Alvorlighetsgrad er 1 eller 2 og det er åpne saker
Gul = Forfalt avvik eller åpen avviksrapport med alvorlighetsgrad = 3
Grønn = Resterende

**Risko**:
Rød = En risiko med samlet risikoverdi på 15 eller mer
Gul = En risiko med en samlet risikoverdi mellom 10 og 12
Grønn = Resterende

**Oppgave**: 
Rød = Over 10% avvik fra dagens mål
Gul = 10% avvik fra dagens mål
Grønn = Resterende

> ℹ️ **INFO**
> Helseindikatoren oppdateres en gang daglig, 03:30 CET.

# Slette et prosjekt

Et prosjekt kan slettes fra tre-prikker hurtigmenyen, eller ved å velge elementet og trykke delete-knappen på tastaturet. Et popup-vindu som ber om bekreftelse på sletting vil vises.

> 🚨 **DANGER**
> Slettelement funksjonaliteten skal kun brukes hvis prosjektet ikke har noen arkivert verdi. f.eks. prosjektet er et duplikat, har blitt opprettet ved en feil, har blitt brukt som et testprosjekt, etc.


Prosjekter kan, og bør, arkiveres ved å [redigere]() statusen.

![bilde](gitbook-file:UP1TekwdzwCSvuPu3heK)

> ℹ️ **INFO**
> Slettede elementer kan gjenopprettes fra papirkurven.

