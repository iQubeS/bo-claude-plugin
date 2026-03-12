<!-- Source: https://docs.business-online.no/komponenter/godkjenning-pa-arbeidsrom -->

Title: Godkjenning på arbeidsrom | Business Online

URL Source: https://docs.business-online.no/komponenter/godkjenning-pa-arbeidsrom

Markdown Content:
⌘Ctrl k

1.   [🧩Komponenter](https://docs.business-online.no/komponenter)

Godkjenning på arbeidsrom
-------------------------

I en bedrift- eller prosjektarbeidsrom i systemet kan det være nødvendig å kjøre en intern godkjenning av et dokument før det distribueres eksternt. Dette inkluderer dokumenter i underkomponenter av bedrifter som muligheter og kontrakter.

I dokumentbiblioteket til komponentene nedenfor er det støtte for å sende ethvert dokument i biblioteket til en arbeidsflyt, enten det er en fagfellevurdering eller en prosedyregodkjenning av et dokument distribuert til en klient.

Godkjenning av arbeidsrom-dokumenter støttes ikke innenfor personellarbeidsrom eller QHSE-rapportsider.

Arbeidsflyten er en enkel ett-trinns godkjenning hvor du definerer en godkjenner som enten godkjenner eller avviser et dokument. Hvis dokumentet godkjennes blir det publisert i godkjente dokumenter.

Dokumentansvarlig er personen som starter arbeidsflyten. For å starte arbeidsflyten, finn valget "Start godkjenningsprosess" i nedtrekksmenyen på dokumentet.

Etter å ha klikket på menyalternativet vil det vises et panel for godkjenningsdetaljer på høyre side av skjermen. Her kan du definere hvem som skal godkjenne dokumentet og legge til kommentar til godkjenneren. Etter godkjenning vil en e-post og en Teams varsel bli distribuert til godkjenneren, samt en oppgave på deres [Min side](https://docs.business-online.no/min-side).

Når godkjenneren har foretatt en handling på dokumentet (godkjent eller avvist), vil den dokumentansvarlige motta en e-post og en Teams varsel.

Du kan ikke starte arbeidsflyt for elementer som fortsatt er åpne for redigering.

Bruk alternativet "Avbryt arbeidsflyt" for å trekke tilbake arbeidsflyten. Dette vil fjerne godkjenningsoppgaven og varsle godkjenneren.

Godkjenneren er den som mottar godkjenningsoppgaven fra brukeren som er dokumentansvarlig. Godkjenningspanelet kan åpnes via link fra e-post- eller Teams-varslene, eller godkjenningsoppgaven på Min side.

Godkjenningssiden vil øverst vise en rekke detaljer om dokumentet og handlingene du kan utføre nedenfor.

Dokumenttittel

Tittel på dokumenter med en lenke for å åpne filen sendt til godkjenning.

Utgivelsesdato

Datoen da dokumentet ble sendt til godkjenning.

Dokumentansvarlig

Brukeren som sendte dokumentet til godkjenning.

Revisjonsnummer

Gjeldende revisjon av dokumentet. Hvis det blir godkjent, vil dette øke med 1.

Versjon

Versjonen av dokumentet da det ble sendt til godkjenning.

Dokumentansvarlig kommentar

Kommentaren sendt til godkjenneren av brukeren som startet godkjenningsarbeidsflyten

Aksjon valgt

Et valg for godkjenneren å avgjøre om dokumentet skal godkjennes eller avvises

Publiser format

Et valg for godkjenneren å bestemme hvilket format dokumentet skal publiseres som. Hvis du velger **Opprinnelig**, publiseres dokumentet i gjeldende dokumenttype.

Etter innsending av skjemaet vil dokumentansvarlig bli varslet via e-post og Teams varsling om handlingen din. Dokumentet du godkjente vil fortsette å få sine godkjenningsfelt oppdatert, og dokumentet vil bli publisert i _Godkjente dokumenter_ biblioteket til det opprinnelige arbeidsrommet.

Når du holder musepekeren over trekanten ved siden av "Publiseringsformat", får du beskjed om at publiseringsformatet ikke kan endres etter første godkjenning. For å publisere et dokument til et annet format, må du opprette et nytt dokument med samme innhold og publisere det.

Dokumentbiblioteket inneholder en rekke felt knyttet til godkjenningsstatusen til dokumentet.

Navn

Navnet på dokumentet

Tittel

Dokumenttittelen

Dokumentnummer

SharePoint-dokumentbibliotekets unike identifikator for dokumentet.

Versjon

SharePoint-versjon av dokumentet (for internt bruk)

Revisjon

Gjeldende godkjent revisjon av dokumentet (for ekstern bruk).

Godkjenningsstatus

Noterer gjeldende status for dokumentet i arbeidsflyten.

Modifisert

Datoen og klokkeslettet da dokumentet sist ble endret.

Modifisert av

Brukeren som sist endret dokumentet.

Tittel-feltet får auto-generert tittel når dokumentet opprettes fra mappestrukturlogikken, eller når dokumentet kopieres ved hjelp av [CD-Filer](https://docs.business-online.no/komponenter/cd-filer) komponenten. For å endre tittel klikker du på "Ny tittel" i nedtrekksmenyen på dokumentet.

Dette er standard SharePoint dokumentnummer. Den er bygget slik:

_[Egendefinert streng] - [Arbeidsrom-ID] - [dokument-teller for arbeidsrom]_

Den tilpassede strengen er en konfigurasjon på nettstedet og den samme for hele systemet. I vårt tilfelle er det DUID.

Arbeidsrom-IDen er en automatisk generert unik alfanumerisk streng. Dette nummeret forblir det samme for alle dokumenter innenfor samme arbeidsrom.

Arbeidsrom-dokumenttelleren er et tall fra 1-X innenfor gjeldende arbeidsrom og økes hver gang et nytt dokument opprettes innenfor samme arbeidsrom.

Eksempel: _DUID-1934734584-17_

Versjon-feltet er standard versjonsverktøy i SharePoint. Den opererer i mindre og større versjoner, der mindre versjoner representerer endringer i dokumentet eller dokumentegenskaper, og hovedversjonen representerer en publisert versjon. For hver publisering av hovedversjoner tilbakestilles den mindre versjonen til 0.

Versjonshistorikken er tilgjengelig for et hvert dokument via nedtrekksmenyen.

Revisjonsfeltet er den siste publiserte hovedversjonen. Den publiserte hovedversjonen er den versjonen av dokumentet som ble godkjent i fagfellevurdering og kan ha blitt distribuert eksternt. Dokumenter med revisjonsnummer vil ha sin publiserte versjon plassert i biblioteket for godkjente dokumenter.

Dette feltet vil inneholde dokumentets gjeldende godkjenningsstatus.

**Utkast**- Dokumentet er under endring og gjeldende versjon er ikke godkjent.

**Under godkjenning** - Dokumentet er sendt til vurdering, men er ennå ikke godkjent

**Godkjent**- Dokumentet er godkjent og har blitt publisert i Godkjente dokumenter

**Avvist**- Dokumentet ble avvist etter å ha blitt sendt til godkjenning

Biblioteket for godkjente dokumenter er stedet der alle publiserte dokumenter havner i sitt publiserte format. Det opprinnelige dokumentet kan jobbes videre med uten at det påvirker det godkjente dokumentet.

Last updated 1 year ago

This site uses cookies to deliver its service and to analyze traffic. By browsing this site, you accept the [privacy policy](https://business-online.no/personvernerklaering/).

