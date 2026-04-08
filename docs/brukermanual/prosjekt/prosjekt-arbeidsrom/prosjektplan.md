---
title: "Prosjektplan"
description: "Det har aldri vært enklere å holde oversikt over prosjektoppgaver"
path: "prosjekt/prosjekt-arbeidsrom/prosjektplan"
gitbook_id: "mjFJW5BvJLgMethxbikb"
---

# Introduksjon

Prosjektplanen brukes til å holde oversikt over prosjektets oppgaver, datoer og oppdrag. Det er en interaktiv webdel som har dra-og-slipp funksjonalitet, og kan tilpasses for å vise relevante oppgaver, statuser, datoer og data. Prosjektplanen åpnes ved å trykke på **Prosjektplan** fra navigasjonsmenyen.

![bilde](gitbook-file:DCntbi9RU0oivptvQLh1)

# Opprette en ny oppgave

En ny oppgave kan opprettes ved å klikke på **+ Ny oppgave**.

Ved å klikke på ny oppgave-knappen åpnes et registreringsskjema.

> ⚠️ **WARNING**
> Noen felt, merket med rød *, er obligatoriske for at oppgaven skal kunne opprettes.

| Felt | Beskrivelse |
| --- | --- |
| Oppgavetittel * | Oppgavens tittel |
| Startdato | Oppgavens startdato |
| Sluttdato | Oppgavens sluttdato |
| Status | Gjeldende oppgavestatus |
| % Ferdig | Gjennomføringsprosent |
| Tildelt til | Oppgaveansvarlig |
| Overordnet oppgave | Når andre oppgaver eksisterer kan du velge en oppgave som overordnet oppgave. Overordnet oppgaven vil omfatte alle underoppgaver |
| Forgjenger | Velg en oppgave som er en forgjenger til denne oppgaven. Dette vil visualisere en tilknytning til den valgte oppgaven. |
| WBS | Work Breakdown Structure. Dette feltet oppdateres automatisk når oppgaven lagres. Tallet er basert på om oppgaven er en overordnet oppgave eller en underoppgave. Eksempel: 1 - Overordnet oppgave nr. 1.  1.1 - Oppgaven vil tilhøre den første overordnede oppgaven |
| Milepæl | Konverterer oppgaven til en milepæl, merket med en lilla diamant. En milepæl-oppgave kan kun ha én dags varighet. |
| Kommentar | Legg til relevant eller utfyllende informasjon til oppgaven |

En strukturert opprettelse av oppgaver gjør videre arbeid i prosjektplanen enklere. En god huskeregel er å definere overordnede- og unerordnedeoppgaver i opprettelse av oppgaver, og la WBS bli satt automatisk. Ønsker du å endre rekkefølgen for en underoppgave kan du redigere WBS manuelt i etterkant. 

# Redigere og slette en oppgave

## Redigere en oppgave

Det er tre måter å redigere eller oppdatere en oppgave på.

1. Oppdaterer oppgaven gjennom [Min side]() hvor du kan klikke på tittelen eller link til prosjektplanen.
2. Bruke dra-og-slipp funksjonaliteten i prosjektplanens fremdriftsoversikt.
3. Gå inn i redigeringsskjema for en oppgave ved å dobbeltklikk på oppgaven i prosjektplanens fremdriftsoversikt.

Når du har redigert ferdig oppgaven i alternativ 2 eller 3 klikker du på **Lagre/Oppdater**-knappen.

## Slette en oppgave

For å slette en oppgave, gå til oppgavens redigeringsskjema og klikk deretter på papirkurvsymbolet øverst til høyre.

Når du klikker på papirkurven vil du få en bekreftelse på sletting. Merk at dersom oppgaven er en overodnet- eller en forgjenger-oppgave må alle under-oppgaver slettes eller tilknytningen fjernes først. Du vil da få en feilmelding med informasjon om dette. 

> 🚨 **DANGER**
> Slett element funksjonaliteten skal kun brukes hvis oppgaven ikke har noen arkivert verdi. For eksempel oppgaven er en duplikat, har blitt opprettet ved en feil, har blitt brukt som en testoppgave, etc.


Oppgaver kan, og bør, arkiveres ved å [oppdatere]() statusen eller oppgavenes fremgang.

# Tildeling og varsler

Når en oppgave er tildelt en bruker, enten ved opprettelse eller gjennom redigering, vil en melding bli sendt til brukerens [epost]() og [Teams]() med en link til prosjektets prosjektplan. Oppgaven vil også vises på brukerens [Min side]().

# Bruken av prosjektplanen

Prosjektplanen er bygget på prinsippet [work breakdown structure (WBS)](), og skal gjennom et intuitivt og grafisk design styre prosjektets oppgaver.

Prosjektplanen har tre hovedseksjoner:

1. [Verktøymeny]()
2. [Oppgaveoversikt]()
3. [Fremdriftsoversikt]()

![En fylt prosjektplan. Seksjonsbeskrivelser er inndelt ved hjelp av de stiplede linjene.](gitbook-file:uW3nv205M22XJl7F1F8o)

# Verktøymeny og oppgaveoversikt

## Verktøymeny

Verktøymenyen gjør det mulig å tilpasse de viste dataene og oppgavene slik brukeren synes det passer. Den brukes også til å lagre, angre og gjøre om endringer i prosjektplanens grensesnitt.

### Statisk visningsdato-endring

Flytter tidslinjen som brukes i [fremdriftsoversikten]() frem eller tilbake en uke.

### Manuell datoendring

Gjør det mulig å angi en egendefinert start- og sluttdato som brukes til å vise oppgavene i [fremdriftsoversikten](). Datoendringen lagres ikke og må justeres per visning og bruker etter ønske. 

### Auto-zoom

Auto-zoom vil automatisk sette visningsdatoen til å å vise alle prosjektoppgaver.

### Angre / Gjøre om

Enhver handling som gjøres for [fremdriftsoversikten]() kan angres eller gjøres om ved å bruke disse menyalternativene.

### Lagre

Handlinger som gjøres på [oppgaveoversikten ]()eller [fremdriftsoversikten](), må lagres for at endringen skal tre i kraft.

### Søk

Bruk av søkefeltet vil vise oppgaver som samsvarer med søkekriteriene, samt eventuelle relevante overordnede oppgaver, forgjengre eller tidligere oppgaver. Fjerning av søkekriteriene vil tilbakestille filteret til sin opprinnelige tilstand.

### Statusfilter

Ved å bruke statusfilteret vises oppgaver basert på statusene deres.

## Oppgaveoversikt

En oversikt over prosjektoppgavene som viser oppgavenavnet, fullføringsprosent og ansvarlig ressurs. De viste oppgavene er avhengig av filtrene som er angitt i [verktøymenyen]().

> ℹ️ **INFO**
> Hold musen over en oppgave for å se dens [WBS]().

### Skjul og ekspander

De overordnede oppgavene kan skjules eller ekspanderes for å skjule eller vise underoppgaver. Dette vil også gjenspeiles i [fremdriftsoversikten]().

### Dra-og-slipp

Med [dra-og-slipp]() funksjonaliteten kan brukeren enkelt omorganisere oppgaver.

![*Flytter en forgjenger oppgave til en ny overordnet oppgave*](gitbook-file:SD2WdFqJ8428o8ZFOx2t)

- Slipp en oppgave utenfor rutenettet for oppgaveoversikten for å fjerne den fra overordnet oppgaven.
- Slipp en oppgave på en annen oppgave for å gjøre oppgaven til en forgjengeroppgave.
- En oppgave med overordnet status kan ikke flyttes gjennom dra og slipp.

> ⚠️ **WARNING**
> Husk å [lagre]() dine endringer.

> ℹ️ **INFO**
> Oppgaveoversiktens dra-og-slipp støttes enda ikke av [angre / gjøre om]() funksjonaliteten.

# Fremdriftsoversikt

Fremdriftsoversikten viser en grafisk oversikt over oppgavene som vil gi en klar oversikt over omfanget. Viktig oppgavebehandling, som progresjon og datohåndtering, kan utføres direkte i oversikten med [dra-og-slipp]() funksjonaliteten, men husk å [lagre endringene dine]()!

> ℹ️ **INFO**
> Bruk [verktøymenyen]() for å tilpasse oversikten.

## Symboler og bruk

### Dagens dato

Gjeldende dato vises som en rød linje i oversikten, noe som gjør det enkelt for brukeren å sette opp og planlegge oppgaver deretter.

![Torsdag 10.](gitbook-file:25MVNI3rSPhnrpwtCBXe)

### Oppgavestatus

Oppgaver er farget basert på gjeldende fremdriftsstatus.

- Grå = Ikke startet
- Blå = startet
- Grønn = Fullført

### Oppgavefremdriftsmarkør

Fremdriftsmarkøren er synlig ved å holde musen over oppgaven og kan justeres ved å dra og holde.

![Flytter fremdriftsmarkøren.](gitbook-file:95GjMmd4Ur9Gtdg6CAxu)

### Tilknytning

Tilknytning mellom oppgaver er markert med en svart sammenhengende linje. Når du holder musepekeren over linjen vil den bli farget slik du tydelig kan se hvilke oppgaver som har tilknytning. Dette vil være nødvendig når du har flere oppgaver med tilknytning. 

### Overordnet oppgave

En overordnet oppgave er en visualisering av underoppgavenes kombinerte datoer og fremdrift. Overordnet oppgave vil automatisk oppdateres etter hvert som underoppgavene fullføres.

### Milepæl

En milepæl vises som en lilla diamant. Milepælen vil bidra til å bryte opp prosjektet og forbedre fremdriftsovervåkingen. En milepæl kan kun ha en dags varighet. 

> ℹ️ **INFO**
> Merk av for Milepæl-feltet i en oppgaves  [ny-]() eller [redigeringsskjema]() for å opprette en milepæl.

