---
title: "QDMS-konfigurasjon"
description: "Definer oppslag og etiketter som brukes av dokumentprofiler og styrende dokumenter i QHSE-huben."
path: "administrasjon/globale-attributter/qdms-konfigurasjon"
gitbook_id: "QekfSpS4V9guOeVbifyu"
---

# Introduksjon

I QDMS-konfigurasjon seksjonen vil du finne alternativer for å definere eller endre metadata som brukes i *Dokumentprofilen* og *Styrende dokumenter*.

# Alternativer

Alternativene som er tilgjengelige for QDMS er alle relatert til dokumentprofil-oppsettet og dens arbeidsflyt:

- Avdeling
- Dokumentkategori

Disse listene brukes til å kategorisere dokumenter innenfor deres respektive avdeling og kategori. Navnene brukes for å generere unike dokumentnumre.

Arbeidsflyt-støttelistene er:

- Dokumentstatus
- Handlingsstatus

Verdiene deres styrer tekstrepresentasjonen av tilstandene et dokument befinner seg i til enhver tid. Nøkkelordene brukes av koden og er ikke redigerbare, men etikettene som brukes i listen og i varsler kan tilpasses.

## Avdeling

*Avdelingsdefinisjonene *i QDMS-konfigurasjonen har et tilleggsfelt kalt "Kode", i motsetning til *Avdeling* i BO-konfigurasjonen. 

Listen over avdelinger som opprettes her vil bli tilgjengelig som valg ved opprettelse av nye *Dokumentprofiler*, og avdelingskoden vil bli brukt som første del av dokumentnummeret.

| Felt | Beskrivelse |
| --- | --- |
| Tittel | Navnet til avdelingen |
| Kode | Kort kode-beskrivelse av avdelingen. |

> ℹ️ **INFO**
> Målet er å gjøre en kode så åpenbar at du kan utlede avdelingen til dokumentet bare ved å se på dokumentnummeret.

## Dokumentkategori

*Dokumentkategoriene* i QDMS-konfigurasjonen har et tilleggsfelt kalt "Kode" i motsetning til *Dokumentene *i BO-konfigurasjonen. I tillegg har dokumentkategori et felt som heter *Kategoritype*. Kategoritypen viser om dokumentkategorien er tilgjengelig i KHMS, DMS eller begge. 

> ℹ️ **INFO**
> DMS er vårt prosjektdokumenthåndteringssystem og er kun tilgjengelig i enkelte prosjekter. 

DMS er tilgjengelig som et tillegg på toppen av vårt standard Business Online system.

Listen over kategoriene som opprettes her vil bli tilgjengelig som valg ved opprettelse av nye *Dokumentprofiler* og Kategori Koden vil bli brukt som første del av dokumentnummeret.

| Felt | Beskrivelse |
| --- | --- |
| Tittel | Navnet til avdelingen |
| Kode | Kort kode-beskrivelse av avdelingen |
| Kategoritype | Velg om dokumentkaegorien er tilgjengelig i KHMS, DMS eller begge. (DMS er vår addon *Dokumentstyring Premium)* |

> ℹ️ **INFO**
> Målet er å gjøre en kode så åpenbar at du kan utlede dokumentkategorien til dokumentet bare ved å se på dokumentnummeret.

## Dokumentstatus

Dokumentstatus-listen inneholder en liste over alle tilstander et dokument kan være i i løpet av livssyklusen.

| Felt | Beskrivelse |
| --- | --- |
| Status | Navnet på statusen. Dette vises per dokument i Dokumentprofil |
| Beskrivelse | Den lange beskrivelsen av statusen. Beskrivelsen brukes kun som et verktøy for å utdype elementet i admin-huben og brukes ikke direkte noe sted. |

> ℹ️ **INFO**
> Betydningen av disse linjene vil ikke endres hvis du endrer etikettene deres. Det eneste formålet med å ha disse elementene redigerbare er hvis du ønsker å endre ordlyden i statusene, dersom bedriften din har en annen måte å formulere dem på.

## Handlingsstatus

Disse statusene representerer handlingsvalgene du har når du godkjenner og avviser en bekreftelses- eller godkjenningsforespørsel.

| Felt | Beskrivelse |
| --- | --- |
| Status | Navnet på handlingen. Dette vil gjenspeiles i Dokumentprofilens liste |
| Beskrivelse | Den lange beskrivelsen av statusen. Dette brukes kun som et verktøy for å utdype varen i admin-huben og brukes ikke direkte noe sted. |

> ℹ️ **INFO**
> Disse modifiseres svært sjelden og legges hovedsakelig til for tilgjengelighet for vårt tekniske personell.

