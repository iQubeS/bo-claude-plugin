---
title: "BO-konfigurasjon"
description: "Definer avdelinger og arbeidsromtyper i systemet."
path: "administrasjon/globale-attributter/bo-konfigurasjon"
gitbook_id: "vSs7iHyT6Il2UDcFPfta"
---

# Introduksjon

Under overskriften *BO-konfigurasjon* finner du en rekke høynivå-definisjoner som brukes rundt i systemet. 

# Alternativer

Nesten alle alternativene under er elementtyper av hovedlister i systemet. En elementtype brukes til å skille elementet både når det gjelder å kunne filtrere i visninger samt tilpasse innholdet i arbeidsrommet. Hver elementtype kan knyttes til en kvalitetskontrollplan (QCP) og en unik mappestruktur. Dette vil bli dekket i senere seksjon.

**Elementtyper**

- Prosjekttype *
- Bedrifttype *
- Kontrakttype
- Personelltype *
- Mulighettype

> ℹ️ **INFO**
> * For disse valglistene er det også et alternativ å velge *arbeidsrommal.* Det er nesten alltid bare ett alternativ her for valg, som må velges for å lagre. Kontakt hovedkontakten din hvis det er mer enn ett valg her for å avklare hvordan du bruker det.

## Avdeling

Avdelinger er et felt som brukes i flere deler av systemet.

Å legge til, endre eller fjerne elementer fra denne listen vil oppdatere valgverdien for andre lister i systemet med et avdelingsvalg.

> ℹ️ **INFO**
> Komponenten er spesifikt konfigurert for standardlistene i systemet. Et nytt valgfelt kalt *Avdeling* i en ny liste vil ikke automatisk bli påvirket av endringer i Global Attributer-komponente

Denne valglisten inneholder alle avdelingene i din organisasjon. Endringer i denne listen vil gjenspeiles i følgende lister i systemet:

- Prosjekter
- Personell
- KHMS rapportering

> ℹ️ **INFO**
> Denne listen må ikke forveksles med avdeling under QDMS-konfigurasjon. Avdelingslisten som brukes av styrende dokumenter kan noen ganger være forskjellige i ulike operasjoner og er derfor adskilt.

## Prosjekttype

Denne listen har to hovedfunksjoner

1. Definer prosjekttypene som er tilgjengelige for nye prosjekter
2. Knytt prosjekttyper til en eller flere avdelinger

Når du oppretter et prosjekt vil ikke prosjekttypene være tilgjengelige for valg før du har valgt en avdeling. Det er herfra du definerer hvilke prosjekttyper som skal vises for hver avdeling.

> ℹ️ **INFO**
> Noen prosjekttyper er "universelle" og brukes på tvers av mange avdelinger. Det er vanlig praksis å beholde en prosjekttype som aldri er knyttet til en prosess for enklere prosjekter som kan kalles f.eks. "Ingen prosess" eller lignende.

## Bedrifttype

Denne listen inneholder alle bedrifttypene som bør være tilgjengelige for valg i *Bedriftslisten* på CRM-huben. Vanligvis ser listen slik ut

- Kunde
- Leverandør
- Samarbeidspartner
- Konkurrent
- Prospekt
- Egen bedrift

> ℹ️ **INFO**
> *Leverandørvalget* påvirker Bedriftskjemaet og valget brukes til å bestemme når leverandørevaluerings-feltene skal lastes inn når du endrer en bedrift. På grunn av dette anbefales det ikke å endre eller fjerne dette valget.

## Kontrakttype

Denne listen inneholder alle kontraktstyper som skal være tilgjengelige for kontraktslisten. Typiske verdier i dette feltet vil være

- Standard kontrakt
- SLA
- NDA
- MSA

Det er sjelden at disse kontraktstypene krever noen annen kvalitetskontrollplan enn kontraktens livssyklus, men det er likevel nyttig for å differensiere kontraktene.

## Personelltype

Denne listen inneholder alle personelltypene som skal være tilgjengelig i personellisten. Typiske verdier i dette feltet vil være

- Ansatt (fulltid)
- Ansatt (deltid)
- Konsulent

Disse eksemplene viser typer registre i personellisten som vil kreve forskjellige livssyklusprosesser og mappestrukturer.

## Mulighettype

Denne listen inneholder alle mulighetstypene som skal være tilgjengelige i *Mulighetslisten*. Som standard er det to typer muligheter.

- Mulighet
- Anbudsmulighet

Muligheter og anbudsmuligheter kan ha fundamentalt forskjellige tilnærmingsmåter og krav til mappestruktur og det er derfor de er differensierte.

