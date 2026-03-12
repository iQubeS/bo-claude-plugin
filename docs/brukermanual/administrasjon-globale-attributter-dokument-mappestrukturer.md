<!-- Source: https://docs.business-online.no/administrasjon/globale-attributter/dokument-mappestrukturer -->

Title: Dokument-mappestrukturer | Business Online

URL Source: https://docs.business-online.no/administrasjon/globale-attributter/dokument-mappestrukturer

Markdown Content:
⌘Ctrl k

1.   [⚙️Administrasjon](https://docs.business-online.no/administrasjon)
2.   [Globale attributter](https://docs.business-online.no/administrasjon/globale-attributter)

Dokument-mappestrukturer
------------------------

Når et arbeidsrom genereres i en arbeidsrom-genererende liste, som prosjekter eller bedrifter, kan dokumentbiblioteket automatisk fylles ut av en forhåndsinnstilt mappestruktur. Dette oppnås med verktøyet som er omtalt i denne seksjonen.

I Business Online er det 6 lister som genererer dokumentbiblioteker for arbeidsrommet. Disse er

*   Bedrifter 
*   Kontrakter 
*   Muligheter 
*   Prosjekter 
*   Personell 
*   KHMS-rapporter 

Hver av disse listene kan ha sine egne unike mappestrukturer definert. På _Dokumenter_-valget i Globale attributter under _BO-konfigurasjon_ representeres alle disse listene og deres mappestrukturer.

Det er fra dette biblioteket logikken bestemmer hvilken mappestruktur som skal importeres når et nytt arbeidsrom genereres. Generelt ser det slik ut

Liste Navn > Type _(eller Default)_> (General _(hvis Bedrift eller Prosjekt)_)> Mappestruktur

Arbeidsrom som genereres som Teams-sider krever en ekstra mappe kalt "General", som er mappen som brukes av arbeidsrommene og av Teams i Filer-fanen.

Den nødvendige banen vil alltid være riktig satt opp med General-mappen når systemet er nytt, men for nye unike mappestrukturer er det viktig å huske General-mappen for de to listene som krever det (Bedrifter og Prosjekter).

Bedrifter -> Type / Default ->**General**-> Mappestruktur

Kontrakter -> Type / Default -> Mappestruktur

Muligheter -> Type / Default -> Mappestruktur

NCRObservationCard -> Mappestruktur

Personell -> Type / Default ->**Delte Dokumenter & HR Dokumenter** ->Mappestruktur

ProjectGeneral -> Type / Default ->**General**-> Mappestruktur

Det kan hende at arbeidsrommets dokumentbibliotek-visning på hovedsiden for prosjekter og bedrifter ikke fungerer riktig hvis General-mappen ikke eksisterer. Dette er fordi visningsnettdelen er forhåndskonfigurert til å vise innholdet i General-mappen, og når den ikke er generert fra denne komponenten kan det oppstå en feil.

Når du går inn i en av listemappene fra toppnivået vil det være

*   En default mappe 
*   Mappetyper 

"Default" mappestrukturen er mappestrukturen som genereres når det ikke er noen unik mappestruktur som samsvarer med elementopprettingen.

Si at det nye elementet er et prosjekt med prosjekttypen «Utvikling». Hvis det ikke er noen mappe i ProjectGeneral med dette navnet, vil logikken forsøke å generere en standard mappestruktur i "Default"-mappen.

I et nytt system vil Default-mappen ha blitt opprettet for hver av listene, men ikke nødvendigvis fylt med en mappestruktur. Hvis det ikke finnes noen mappestruktur i slutten av banen, vil det ikke bli generert noen mappestruktur for arbeidsrommet.

Mappetypene opprettes med navn som tilsvarer deres element, dette for å tillate at unike mappestrukturer kan opprettes.

De fleste lister har type-definisjoner som er utdypet i avsnittet til BO-konfigurasjon.

Når du oppretter en unik mappestruktur for en bestemt prosjekttype eller bedriftstype er det to ting du bør huske:

1.   
Mappenavnet må være identisk med den tilsvarende prosjekt/bedriftstypen

    *   Eks: Mappen må hete nøyaktig "Tender Project" hvis prosjekttypen heter "Tender Project". Hvis mappen hadde fått navnet "Tender", ville ikke logikken kunne assosiere den på riktig måte, og ville generere Default mappestruktur i stedet 

2.   
General-mappen i _Default_ eller _mappetype_

    *   Eks på banen: ProjectGeneral -> "Tender Project" ->**General**-> Mappestruktur 

Når du oppretter en unik mappestruktur for en bestemt personelltype er det også to ting du bør huske:

1.   
Mappenavnet må være identisk med den tilsvarende personell-typen

    *   Eks: Mappen må hete nøyaktig "Konsulent" hvis personell-typen heter "Konsulent". Hvis mappen hadde fått navnet "konsulenter", ville ikke logikken kunne assosiere den på riktig måte, og ville generere Default mappestruktur i stedet 

2.   
Delte Dokumenter og HR Dokumenter mappene i _Default_ eller _mappetypen_

    *   Eks på banen: Personnel -> "Konsulent" ->**Delte Dokumenter**og **HR Dokumenter**-> Mappestruktur 

KHMS-rapporter har teknisk sett en registrerings type, men mappestrukturen kan ikke tilpasses basert på den.

Når du er innenfor _Default/mappetypen_ (_General_ hvis det er en bedrifts- eller prosjektmappestruktur, _Delte dokumenter_ og _HR Dokumenter_ hvis det er Personell mappestruktur), er det på tide å definere mappestrukturen. Herfra kan du definere en mappestruktur med så mange mapper du vil.

Det er to ting å vurdere på dette nivået:

*   Sorteringsrekkefølge 
*   Relevante dokumenter 

Mappene du oppretter her vil vises i samme sorteringsrekkefølge når de genereres i et arbeidsområde. Dette betyr at dersom du ønsker en helt spesifikk sorteringsrekkefølge for mapper, må de opprettes i riktig rekkefølge ovenfra og ned.

For hver mappe i mappestrukturen er det en mulighet for å knytte et dokument til mappen som skal kopieres og opprettes i mappen når arbeidsrommet genereres.

I Redigeringsmenyen (pen-ikonet) for hver mappe er det et oppslag til dokumentbiblioteket _Styrende dokumenter._ Når ett eller flere dokumenter er valgt her, vil de bli kopiert inn i denne mappen når dokumentbiblioteket for arbeidsrommet er generert.

Dette brukes vanligvis til å generere en fil som alltid er relevant uavhengig av elementet som genereres. Det kan eksempelvis være et kravbeskrivelses-dokument for et utviklingsprosjekt, eller et leverandørvurderings-dokument for en ny leverandør i bedriftslisten.

Husk at dokumenter også kan importeres fra QCP-funksjonalitet. QCP-arbeidsfilene importeres på forespørsel i henhold til prosess, mens relevante dokumenter importeres til mappen hver gang mappestrukturen genereres.

Last updated 1 year ago

This site uses cookies to deliver its service and to analyze traffic. By browsing this site, you accept the [privacy policy](https://business-online.no/personvernerklaering/).

