<!-- Source: https://docs.business-online.no/administrasjon/globale-attributter/qdms-konfigurasjon -->

Title: QDMS-konfigurasjon | Business Online

URL Source: https://docs.business-online.no/administrasjon/globale-attributter/qdms-konfigurasjon

Markdown Content:
⌘Ctrl k

1.   [⚙️Administrasjon](https://docs.business-online.no/administrasjon)
2.   [Globale attributter](https://docs.business-online.no/administrasjon/globale-attributter)

QDMS-konfigurasjon
------------------

Definer oppslag og etiketter som brukes av dokumentprofiler og styrende dokumenter i QHSE-huben.

I QDMS-konfigurasjon seksjonen vil du finne alternativer for å definere eller endre metadata som brukes i _Dokumentprofilen_ og _Styrende dokumenter_.

Alternativene som er tilgjengelige for QDMS er alle relatert til dokumentprofil-oppsettet og dens arbeidsflyt:

*   Avdeling 
*   Dokumentkategori 

Disse listene brukes til å kategorisere dokumenter innenfor deres respektive avdeling og kategori. Navnene brukes for å generere unike dokumentnumre.

Arbeidsflyt-støttelistene er:

*   Dokumentstatus 
*   Handlingsstatus 

Verdiene deres styrer tekstrepresentasjonen av tilstandene et dokument befinner seg i til enhver tid. Nøkkelordene brukes av koden og er ikke redigerbare, men etikettene som brukes i listen og i varsler kan tilpasses.

_Avdelingsdefinisjonene_ i QDMS-konfigurasjonen har et tilleggsfelt kalt "Kode", i motsetning til _Avdeling_ i BO-konfigurasjonen.

Listen over avdelinger som opprettes her vil bli tilgjengelig som valg ved opprettelse av nye _Dokumentprofiler_, og avdelingskoden vil bli brukt som første del av dokumentnummeret.

Tittel

Navnet til avdelingen

Kode

Kort kode-beskrivelse av avdelingen.

Målet er å gjøre en kode så åpenbar at du kan utlede avdelingen til dokumentet bare ved å se på dokumentnummeret.

_Dokumentkategoriene_ i QDMS-konfigurasjonen har et tilleggsfelt kalt "Kode" i motsetning til _Dokumentene_ i BO-konfigurasjonen. I tillegg har dokumentkategori et felt som heter _Kategoritype_. Kategoritypen viser om dokumentkategorien er tilgjengelig i KHMS, DMS eller begge.

DMS er vårt prosjektdokumenthåndteringssystem og er kun tilgjengelig i enkelte prosjekter.

DMS er tilgjengelig som et tillegg på toppen av vårt standard Business Online system.

Listen over kategoriene som opprettes her vil bli tilgjengelig som valg ved opprettelse av nye _Dokumentprofiler_ og Kategori Koden vil bli brukt som første del av dokumentnummeret.

Tittel

Navnet til avdelingen

Kode

Kort kode-beskrivelse av avdelingen

Kategoritype

Velg om dokumentkaegorien er tilgjengelig i KHMS, DMS eller begge. (DMS er vår addon _Dokumentstyring Premium)_

Målet er å gjøre en kode så åpenbar at du kan utlede dokumentkategorien til dokumentet bare ved å se på dokumentnummeret.

Dokumentstatus-listen inneholder en liste over alle tilstander et dokument kan være i i løpet av livssyklusen.

Status

Navnet på statusen. Dette vises per dokument i Dokumentprofil

Beskrivelse

Den lange beskrivelsen av statusen. Beskrivelsen brukes kun som et verktøy for å utdype elementet i admin-huben og brukes ikke direkte noe sted.

Betydningen av disse linjene vil ikke endres hvis du endrer etikettene deres. Det eneste formålet med å ha disse elementene redigerbare er hvis du ønsker å endre ordlyden i statusene, dersom bedriften din har en annen måte å formulere dem på.

Disse statusene representerer handlingsvalgene du har når du godkjenner og avviser en bekreftelses- eller godkjenningsforespørsel.

Status

Navnet på handlingen. Dette vil gjenspeiles i Dokumentprofilens liste

Beskrivelse

Den lange beskrivelsen av statusen. Dette brukes kun som et verktøy for å utdype varen i admin-huben og brukes ikke direkte noe sted.

Disse modifiseres svært sjelden og legges hovedsakelig til for tilgjengelighet for vårt tekniske personell.

Last updated 1 year ago

This site uses cookies to deliver its service and to analyze traffic. By browsing this site, you accept the [privacy policy](https://business-online.no/personvernerklaering/).

