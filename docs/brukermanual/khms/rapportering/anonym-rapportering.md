---
title: "Anonym rapportering"
path: "khms/rapportering/anonym-rapportering"
gitbook_id: "kVzyGu40HCfZE5ApRjvS"
---

# Introduksjon

Anonym rapportering er et verktøy utviklet for å anonymisere brukeren som sender inn rapporten. Brukere i HR-gruppen vil bli varslet som standard, og vil følge opp den rapporterte saken.

> ℹ️ **INFO**
> Sjekk bedriftens interne prosess på dette. Det er mulig at brukerne som håndterer disse sakene er tilpasset.

> ⚠️ **WARNING**
> En bedrift i Norge er ikke forpliktet til å bruke anonym rapportering. De er imidlertid forpliktet til å følge opp meldinger om kritikkverdige forhold.

Les mer om denne typen rapportering på Arbeidstilsynets nettsider

🔗 **Embed:** [https://www.arbeidstilsynet.no/tema/varsling/Slik-kan-du-varsle-om-kritikkverdige-forhold](https://www.arbeidstilsynet.no/tema/varsling/Slik-kan-du-varsle-om-kritikkverdige-forhold)

# Opprette en rapport

For å opprette en ny anonym rapport, naviger til KHMS og klikk på Anonym rapportering som ligger på koblingslinjen på toppen av siden.

## Anonym rapporteringsskjema

Skjemaet er et tilpasset Microsoft-skjema som ikke bruker noen av de gjeldende påloggingsdetaljene for å identifisere den registrerte oppføringen.

| Felt | Beskrivelse |
| --- | --- |
| Tittel | Kort beskrivelse av rapporten |
| Dato | Dato for observasjon (eller rapport hvis ikke relevant) |
| Beskrivelse | Lang beskrivelse av saken. Ta med så mye informasjon som mulig. |

Etter innsending vil HR-ansvarlige bli varslet om at en ny anonym rapport er registrert. Merk at dette også betyr at du ikke vil kunne få et varsel om at det er iverksatt tiltak i saken og må følge opp dette manuelt.

> ℹ️ **INFO**
> Den rapporterte saken kan ikke slettes av HR-ansatte. Den kan bare flyttes til en inaktiv status.

### Hva burde en anonym rapport inneholde?

Siden du melder fra anonymt, er det viktig å inkludere så mye informasjon som mulig for saksbehandler. De klarer ikke å komme med oppfølgingsspørsmål og uten tilstrekkelig informasjon til å følge opp saken kan den bli forkastet.

[Arbeidstilsynet ]()anbefaler å inkludere følgende

- Hva skjedde? Er det brudd på loven, eller bedriftens skriftlige etiske retningslinjer?
- Hvem var involvert?
- Hvor skjedde det? Hvor ble det avdekket?
- Når skjedde det?
- Har det skjedd før? Hvor mange?
- Var det noen vitner?

# Håndtering av en rapport

Når en anonym rapport er registrert av en anonym opphavsmann, vil alle brukere i **HR gruppen** motta en varsel. Av sikkerhetsgrunner er ikke URL-en til denne saken inkludert i e-posten.

Denne listen er plassert i HR modulen. Som standard er ikke listen koblet sammen og konfigureres når systemet implementeres.

Feltene som er tilgjengelige i listen er de samme som i registeret, bortsett fra at det er et *Status *felt. *Opprettet av-*feltet er kun der for å vise at *System Account* (en tjenestebruker) er brukeren som har registrert hendelse opprettet i forrige seksjon. 

Skjemaet er veldig enkelt og lar HR-brukeren ta handling i form av en status. Fra et teknisk perspektiv brukes statusen kun til filtrering og oversiktsformål, men den bør representere noen interne handlinger som er tatt på rapporten. 

**Venter** er standardstatusen i registeret. Dette indikerer at rapporten enda ikke er evaluert.

**Godkjent **betyr at saksbehandleren mener det er tilstrekkelig bevis for å fortsette

**Avvist **betyr at saksbehandleren mener det ikke er nok bevis eller at den rapporterte saken ikke er verdt å følge opp.

## Versjonskontroll

For å forhindre at saksbehandlere endrer rapportinnholdet sporløst, er versjonskontroll aktivert i listen. En endring av en anonym rapport fra en saksbehandler bør begrenses til en statusoppdatering og/eller en skrivefeilretting. Med versjonskontroll aktivert, er det mulig å spore tilbake til disse endringene.

