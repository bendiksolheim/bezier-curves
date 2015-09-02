1
    Hei hallo

2
    - Regner med alle har hørt om Beziér-kurver i en eller annen form
    - Eks: pen tool i photoshop/illustrator/sketch
        - Særtilfeller
    Mål: skal i løpet av lyntalen forstå Beziér-kurver på en mer generell måte, og forstå hvordan de fungerer
    - Muligens en kjent kurve for de fleste
    - Alt som skal til for å tegne denne er koordinatene til de 4 punktene vi ser. 
    - Litt mer generelt kan vi si: består av N antall punkter, hvor N er et naturlig tall større enn eller lik 2
    - Starter alltid i P0, og ender i PN
    Dette skal vi klare helt uten kode og matematikk

3
    La oss ta det helt basic her, vi starter med enkleste variant
    - Enkleste variant har 2 punkter, og en linje mellom.
    Litt kjedelig, la oss legge til et kontrollpunkt

4
    Kalles en kvadratisk Beziér-kurve
    - Har fått et nytt punkt
    - Koblet til det første punktet, og kontrollerer hvordan kurven går ut fra første punktet og mot det andre

    Akkurat som at vi koblet et kontrollpunkt til punkt 1 da vi gikk fra 2 til 3 punkter, kobler vi et kontrollpunkt til
    det andre endepunktet når vi går fra 3 til 4 punkter

5
    Kalles en kubisk Beziér-kurve
    - Kan nå kontrollere både hvordan kurven går ut fra startpunktet, og inn i sluttpunktet
    - Og alt som kreves er å vite koordinatene til disse 4 punktene

    Ok, jeg sa at vi skulle forstå dette på en mer generell måte, men så langt har vi bare sett på velkjent tilfeller
    - Har gått fra 2 punkter, til 3, til 4 punkter
    - Ikke umiddelbart klart hvordan vi kan gå videre, vi har ikke flere punkter å koble kontrollpunkter på

3
    Tenk på måten slike kurver tegnes på, eller hvordan vi ville ha tegnet dem.
    - Ville ha startet i starten, og tegnet en strek mot slutten, over en tid T
    - Vi ser at så lenge streken er rett er det ganske enkelt

4
    Legger til en hjelpelinje
    - tegner i paralell, fra start til kontrollpunk, og kontrollpunkt til slutt
    - Linje mellom de nye punktene
    - Nytt punkt på denne linja
    - Dette siste punktet går i en ujevn bane, og her er kurven din

5
    Samme prinsipp

6
    5 punkter
    - Slik kan vi fortsette
    - Alt vi trenger å gjøre er å legge et nytt punkt på linjen, og interpolere via det også
    - Kan fortsette slik i det uendelige, jo flere punkter jo større kontroll og "oppløsning" får du på kurven

7
    Easing-funksjoner i CSS
    - Igjen, et særtilfelle: start og slutt er fast, og vi kontrollerer de to punktene i midten vha koordinater
    - cubic-bezier tar inn disse koordinatene, og lager en animasjon som ikke er lineær
    - Slik kan vi veldig enkelt lage mer interessante animasjoner

8
    Sist, kanskje litt mer søkt, for å animere et objekt i en kurve
    - Ser kanskje litt rart ut, men brukes mye i f.eks. spill
        - mer naturlig gang-bane for en karakter
        - animere kamera langs en kurve i tre dimensjoner
        - for det er selvsagt ingen ting i veien for å ta dette videre i flere dimensjoner