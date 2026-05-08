const db = require('./database');

const articles = [
  {
    title: 'Film Franz Agnieszky Holland na shortlistu Evropské filmové akademie',
    slug: 'film-franz-shortlist-efa',
    category: 'Art',
    author: 'Tereza Malá',
    perex: 'Česko-polský snímek o Franzi Kafkovi se probojoval mezi nejlepší evropské filmy roku. Režisérka Agnieszka Holland a producentka Šárka Cimbalová slaví další úspěch.',
    content: '<p><strong>Snímek Franz, který mapuje život pražského spisovatele Franze Kafky, se dostal na prestižní shortlist Evropské filmové akademie. Film v hlavní roli s Idanem Weissem zaujal kritiky po premiérách v Torontu a San Sebastiánu.</strong></p><h2>Cesta na shortlist</h2><p>38. ročník Evropských filmových cen se koná v Berlíně a na shortlist se letos dostalo 44 celovečerních filmů z 34 evropských zemí. Český film mezi nimi potvrzuje rostoucí mezinárodní prestiž české kinematografie.</p><p>Režisérka Agnieszka Holland, která žije střídavě v Praze a Varšavě, přistoupila ke Kafkovu příběhu s citlivostí a vizuální poetikou. „Kafka je pro mě symbolem středoevropské identity — rozpolcené mezi jazyky, kulturami a světy," říká Holland.</p><h2>Producentský úspěch Šárky Cimbalové</h2><p>Producentka Šárka Cimbalová stojí za řadou mezinárodně úspěšných projektů. Franz je jejím dosud nejambicióznějším počinem. Film vznikal tři roky a natáčel se v autentických pražských lokacích včetně Starého Města a Josefova.</p><p>„Chtěli jsme, aby Praha byla plnohodnotnou postavou filmu. Kafkova Praha, to není jen kulisa — je to atmosféra, která prostupuje každou stránkou jeho díla," vysvětluje Cimbalová.</p>',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
    date: '2026-04-18'
  },
  {
    title: 'Kompletní korespondence Voskovce a Wericha vychází jako audiokniha',
    slug: 'voskovec-werich-audiokniha',
    category: 'Art',
    author: 'Tereza Malá',
    perex: '561 dopisů, 68 hodin poslechu — unikátní audiokniha zachycuje 35 let přátelství dvou legend české kultury přes oceán.',
    content: '<p><strong>Jedná se o vůbec nejrozsáhlejší audioknihu v historii české nakladatelské produkce. Šest CD obsahuje kompletní korespondenci mezi Jiřím Voskovcem a Janem Werichem z let 1945 až 1980.</strong></p><h2>35 let přátelství přes oceán</h2><p>Dopisy zachycují nejen osobní přátelství dvou výjimečných osobností, ale i dramatické dějiny 20. století viděné očima dvou intelektuálů — jednoho v emigraci, druhého v komunistickém Československu.</p><p>Voskovec psal z New Yorku o životě v Americe, o stesku po vlasti i o svých hereckých rolích na Broadwayi. Werich odpovídal z Prahy, kde se snažil tvořit v čím dál těsnějších mantinelech normalizačního režimu.</p><h2>Nahrávka ve hvězdném obsazení</h2><p>Audioknihu namluvili přední čeští herci, kteří dokázali zachytit specifický humor i melancholii obou autorů. Projekt vznikal dva roky a vyžádal si pečlivou ediční práci — mnoho dopisů bylo dosud nepublikovaných.</p><p>„Je to fascinující dokument o přátelství, které přežilo válku, emigraci i železnou oponu," říká editorka projektu.</p>',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop',
    date: '2026-04-15'
  },
  {
    title: 'Mongolsko přejímá český systém značení turistických tras',
    slug: 'mongolsko-ceske-znaceni-tras',
    category: 'Ocenění',
    author: 'Mgr. Pavel Horák',
    perex: 'Unikátní český systém turistického značení, který funguje přes 130 let, expanduje do Asie. Mongolsko podepsalo memorandum s Klubem českých turistů.',
    content: '<p><strong>Český systém značení turistických tras patří mezi nejstarší a nejpropracovanější na světě. Nyní ho přebírá Mongolsko — první asijská země, která se rozhodla využít osvědčený středoevropský model.</strong></p><h2>130 let tradice</h2><p>Klub českých turistů (KČT) značí trasy od roku 1889. Charakteristické trojbarevné značky — červená, modrá, zelená a žlutá — se staly součástí české krajiny a inspirovaly značení v řadě evropských zemí.</p><p>Memorandum mezi KČT a Mongolian Walking Association podepsali zástupci obou organizací v Praze. Mongolsko plánuje vyznačit prvních 500 kilometrů tras v okolí Ulánbátaru a v národních parcích.</p><h2>Proč zrovna české značení?</h2><p>„Český systém je geniální ve své jednoduchosti. Tři barvy na bílém podkladu, jasná logika vedení tras — to je něco, co funguje v jakémkoliv terénu a klimatu," vysvětluje mongolský velvyslanec v Praze.</p><p>Projekt zahrnuje i školení mongolských dobrovolníků v Česku. První skupina dvaceti značkařů absolvovala kurz v Krkonoších a Beskydech.</p>',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&h=600&fit=crop',
    date: '2026-04-14'
  },
  {
    title: 'Praha zakazuje podomní prodej energetických služeb',
    slug: 'praha-zakaz-podomni-prodej-energii',
    category: 'Paragrafy',
    author: 'JUDr. Martin Dvořák',
    perex: 'Hlavní město reaguje na stovky stížností podvedených seniorů. Nová vyhláška chrání Pražany před agresivními obchodními praktikami.',
    content: '<p><strong>Pražský magistrát schválil vyhlášku zakazující podomní prodej energetických služeb na celém území hlavního města. Reaguje tak na vlnu podvodů, které postihly zejména starší občany.</strong></p><h2>Stovky podvedených</h2><p>Podle dat Energetického regulačního úřadu bylo jen v Praze za poslední rok podáno přes 800 stížností na nekalé praktiky podomních prodejců energií. Senioři často podepsali nevýhodné smlouvy pod nátlakem, s pokutami za předčasné ukončení dosahujícími desítek tisíc korun.</p><p>„Lidé se báli otevřít dveře vlastního bytu. To je nepřijatelný stav," říká radní pro oblast bezpečnosti.</p><h2>Co vyhláška mění</h2><p>Od účinnosti vyhlášky je zakázáno nabízet energetické služby formou podomního prodeje. Porušení hrozí pokutou až 500 tisíc korun. Vyhláška se vztahuje na elektřinu, plyn i teplo.</p><p>Podobnou regulaci zvažují i další česká města — Brno, Ostrava a Plzeň připravují vlastní vyhlášky inspirované pražským vzorem.</p>',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
    date: '2026-04-13'
  },
  {
    title: 'Výstaviště Praha restaurovalo hrob architekta Průmyslového paláce',
    slug: 'vystaviste-hrob-munzberger',
    category: 'Art',
    author: 'Tereza Malá',
    perex: 'Zapomenutý hrob Bedřicha Münzbergera na Olšanských hřbitovech se dočkal obnovy. Architekt navrhl ikonický Průmyslový palác v roce 1891.',
    content: '<p><strong>Výstaviště Praha adoptovalo a kompletně zrestaurovalo hrobku svého zakladatelského architekta Bedřicha Münzbergera na Olšanském hřbitově. Hrob byl desítky let zanedbaný a hrozilo mu zřícení.</strong></p><h2>Architekt, který dal Praze tvář</h2><p>Bedřich Münzberger (1846-1928) navrhl Průmyslový palác pro Zemskou jubilejní výstavu v roce 1891. Budova z oceli a skla byla tehdy jednou z největších v Evropě a dodnes je dominantou holešovického Výstaviště.</p><p>Münzberger také projektoval řadu dalších pražských staveb včetně Zemské banky a několika obytných domů na Vinohradech. Přesto upadl v zapomnění — jeho hrob zarůstal a náhrobek se rozpadal.</p><h2>Dva roky restaurování</h2><p>Restaurátorské práce trvaly dva roky. Kamenný náhrobek byl kompletně rozebrán, vyčištěn a znovu sestaven. Chybějící prvky doplnili kameníci podle historických fotografií.</p><p>„Je to náš dluh vůči člověku, bez kterého by Výstaviště neexistovalo," říká ředitel Výstaviště Praha.</p>',
    image: 'https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=1200&h=600&fit=crop',
    date: '2026-04-12'
  },
  {
    title: 'Český výzkum: Inflace může trvat dalších 10 let',
    slug: 'cesky-vyzkum-inflace-prognoza',
    category: 'Věda',
    author: 'Mgr. Pavel Horák',
    perex: 'Ekonomové z CERGE-EI přicházejí s kontroverzní studií. Strukturální změny v ekonomice naznačují dlouhodobě vyšší cenovou hladinu.',
    content: '<p><strong>Tým ekonomů z pražského CERGE-EI publikoval studii, která předpovídá období zvýšené inflace trvající až jednu dekádu. Příčinou nejsou jednorázové šoky, ale hluboké strukturální změny v globální ekonomice.</strong></p><h2>Tři pilíře rostoucích cen</h2><p>Studie identifikuje tři hlavní faktory: deglobalizaci dodavatelských řetězců, demografické změny (stárnutí populace a nedostatek pracovní síly) a náklady zelené transformace.</p><p>„Éra levného zboží z Číny končí. Přesouvání výroby zpět do Evropy znamená vyšší náklady, které se promítnou do cen," vysvětluje hlavní autor studie profesor Karel Novotný.</p><h2>Dopady na české domácnosti</h2><p>Podle modelu budou nejvíce zasaženy domácnosti se středními příjmy. Ceny potravin a energií porostou rychleji než mzdy, což povede k poklesu reálné kupní síly.</p><p>Studie doporučuje vládě zaměřit se na produktivitu práce a investice do automatizace jako hlavní nástroje pro kompenzaci inflačních tlaků.</p>',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    date: '2026-04-11'
  },
  {
    title: 'Nová inscenace v Disku: Mohou introverti dělat divadlo?',
    slug: 'disk-introverti-divadlo',
    category: 'Art',
    author: 'Tereza Malá',
    perex: 'Studenti DAMU přicházejí s provokativní inscenací, která zkoumá vztah introvertních osobností k performativnímu umění.',
    content: '<p><strong>Divadlo DISK, scéna studentů DAMU, uvádí novou inscenaci s provokativním názvem „Introverti". Sedm studentů herectví otevřeně mluví o svém boji s extrovertní povahou divadelního řemesla.</strong></p><h2>Osobní výpovědi na jevišti</h2><p>Inscenace kombinuje dokumentární divadlo s performancí. Herci na scéně sdílejí své skutečné zkušenosti — úzkost před vystoupením, potřebu samoty po představení, rozpor mezi touhou tvořit a strachem z publika.</p><p>„Divadlo je ze své podstaty extrovertní umění. Ale co když nejsilnější příběhy vypráví ti, kteří normálně mlčí?" ptá se režisérka Markéta Černá.</p><h2>Překvapivé reakce</h2><p>Premiéra vyvolala silnou odezvu. Diváci po představení často zůstávali v sále a sdíleli vlastní zkušenosti s introverzí. Několik psychologů inscenaci doporučilo jako terapeutický materiál.</p><p>Inscenace se hraje do konce sezony v Divadle DISK na Karlově náměstí. Vstupenky jsou vyprodané na měsíc dopředu.</p>',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=600&fit=crop',
    date: '2026-04-10'
  },
  {
    title: 'Americké putování Dvořáka a Sládka: Nová výstava v Příbrami',
    slug: 'dvorak-sladek-americke-putovani',
    category: 'Speciály',
    author: 'Lucie Petrová',
    perex: 'Památník Antonína Dvořáka ve Vysoké u Příbrami otevírá výstavu o cestách dvou českých velikánů do Nového světa.',
    content: '<p><strong>Nová výstava v Památníku Antonína Dvořáka mapuje paralelní příběhy skladatele Antonína Dvořáka a básníka Josefa Václava Sládka v Americe. Oba Čechy spojoval New York, oba hledali inspiraci za oceánem — a oba se vrátili proměnění.</strong></p><h2>Dvořák v New Yorku</h2><p>Antonín Dvořák strávil v Americe tři roky (1892-1895) jako ředitel Národní konzervatoře v New Yorku. Vznikla zde jeho nejslavnější symfonie „Z Nového světa" i Violoncellový koncert h moll.</p><p>Výstava představuje dosud nepublikované dopisy, ve kterých Dvořák popisuje své dojmy z amerického života — od fascinace spirituály a indiánskou hudbou po stesk po české krajině.</p><h2>Sládek — první český Američan</h2><p>Básník Josef Václav Sládek pobýval v Americe ještě před Dvořákem. Pracoval na farmách, v továrnách i jako novinář. Jeho americká zkušenost zásadně ovlivnila českou literaturu — přinesl do ní sociální citlivost a realismus.</p><p>Výstava je přístupná do konce října a zahrnuje interaktivní mapu cest obou umělců po Spojených státech.</p>',
    image: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=1200&h=600&fit=crop',
    date: '2026-04-09'
  },
  {
    title: 'Aloisovy ponožky: Jak dárek může změnit život pečujícím',
    slug: 'aloisovy-ponozky-nadacni-fond',
    category: 'Rozhovory',
    author: 'Lucie Petrová',
    perex: 'Nadační fond Seňorina prodává ponožky s příběhem. Výtěžek pomáhá rodinám, které pečují o blízké s Alzheimerovou chorobou.',
    content: '<p><strong>V Česku žije přes 180 tisíc lidí s demencí. O většinu z nich pečují rodinní příslušníci — často na úkor vlastního zdraví, kariéry i vztahů. Nadační fond Seňorina jim pomáhá netradiční cestou.</strong></p><h2>Ponožky, které vypráví příběh</h2><p>E-shop Nadačního fondu nabízí designové ponožky navržené českými umělci. Každý pár nese jméno reálného člověka s Alzheimerovou chorobou a krátký příběh z jeho života — z doby, kdy byl ještě zdravý.</p><p>„Chceme, aby si lidé uvědomili, že za diagnózou je vždycky člověk s bohatým životem, vzpomínkami a příběhem," říká zakladatelka fondu Jana Kotalíková.</p><h2>Kam jdou peníze</h2><p>Výtěžek z prodeje financuje odlehčovací služby — tedy možnost, aby si pečující mohli na pár hodin či dní odpočinout, zatímco o jejich blízkého se postará profesionál.</p><p>Za tři roky existence projekt podpořil přes 400 pečujících rodin a prodal 25 tisíc párů ponožek. Loni fond získal cenu Neziskovka roku.</p>',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=600&fit=crop',
    date: '2026-04-08'
  },
  {
    title: 'Startup NEVAJGLUJ řeší problém nedopalků v českých obcích',
    slug: 'nevajgluj-system-nedopalky',
    category: 'Tech',
    author: 'Jan Kořínek',
    perex: 'Český startup přináší komplexní řešení pro obce — od speciálních popelníků po recyklaci filtrů. Za rok sesbírali přes 2 miliony nedopalků.',
    content: '<p><strong>Nedopalky cigaret jsou nejčastějším odpadem na světě. Jeden nedopalek kontaminuje až 40 litrů vody a jeho rozklad trvá až 12 let. Český startup NEVAJGLUJ to chce změnit.</strong></p><h2>Systém pro obce</h2><p>NEVAJGLUJ nabízí obcím kompletní službu: instalaci designových pouličních popelníků, pravidelný svoz a recyklaci sesbíraných nedopalků. Filtry se zpracovávají na izolační materiál.</p><p>„Obce platí měsíční paušál a my se postaráme o vše — od instalace po recyklaci. Není to jen o čistotě, ale i o ochraně vodních zdrojů," vysvětluje CEO Filip Krejčí.</p><h2>Čísla mluví jasně</h2><p>Za první rok fungování systém pokrývá 45 obcí a měst. Sesbíráno bylo přes 2 miliony nedopalků, což odpovídá 80 milionům litrů ochráněné vody.</p><p>Praha pilotně testuje systém na Praze 1 a 7. Výsledky jsou tak pozitivní, že magistrát plánuje rozšíření na celé město do konce roku.</p>',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=600&fit=crop',
    date: '2026-04-07'
  }
];

const insert = db.prepare(`INSERT INTO articles (title, slug, perex, content, category, featured_image, author, published_at, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`);

let count = 0;
articles.forEach(a => {
  try {
    insert.run(a.title, a.slug, a.perex, a.content, a.category, a.image, a.author, a.date);
    count++;
    console.log(`OK ${a.category}: ${a.title}`);
  } catch(e) {
    console.log(`Skip: ${a.title} (${e.message})`);
  }
});
console.log(`\nImportovano ${count} novych clanku.`);
console.log(`Celkem v DB: ${db.prepare('SELECT COUNT(*) as c FROM articles').get().c}`);
