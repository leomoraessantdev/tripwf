// =============================================================
// Manifesto de imagens LOCAIS do TripWF
// =============================================================
//
// Cada cidade, hospedagem e atração mapeia a UM arquivo real em
// /public/images. Helper `enc(pasta, arquivo)` aplica encodeURI()
// para garantir que caracteres especiais (ç, ó, é, ô, Ò, …) virem
// %XX no URL — browser fetcha corretamente em qualquer sistema.
//
// Para adicionar uma imagem ausente:
//   1. Salve o arquivo em /public/images/{tipo}/<nome>.<ext>
//   2. Adicione a linha aqui: 'id': enc('tipo', 'nome.ext')
// Suporta .jpg, .webp, .avif, .png.

const enc = (pasta, arquivo) => arquivo ? `/images/${pasta}/${encodeURI(arquivo)}` : null

// ----- Cidades (18 de 18) -----
export const IMAGENS_CIDADE = {
  paris:      enc('cities', 'paris.jpg'),
  roma:       enc('cities', 'roma.jpg'),
  barcelona:  enc('cities', 'barcelona.jpg'),
  amsterdam:  enc('cities', 'amsterdam.jpg'),
  praga:      enc('cities', 'praga.jpg'),
  lisboa:     enc('cities', 'lisboa.jpg'),
  viena:      enc('cities', 'viena.jpg'),
  londres:    enc('cities', 'londres.jpg'),
  berlim:     enc('cities', 'berlim.jpg'),
  madri:      enc('cities', 'madri.jpg'),
  atenas:     enc('cities', 'atenas.jpg'),
  istambul:   enc('cities', 'Istambul.jpg'),
  budapeste:  enc('cities', 'budapeste.jpg'),
  florenca:   enc('cities', 'florenca.jpg'),
  edimburgo:  enc('cities', 'edimburgo.jpg'),
  copenhague: enc('cities', 'Copenhagen.jpg'),
  // ----- Milão, Porto, bate e volta e Accor (scripts/baixar-imagens-milao-porto-accor.mjs) -----
  'milao': enc('cities', 'milao.jpg'),
  'porto': enc('cities', 'porto.jpg')
}

// ----- Hospedagens (64 de 64) -----
export const IMAGENS_HOSPEDAGEM = {
  // Paris
  'paris-h1':     enc('hotels', 'hotellemarais.jpg'),
  'paris-h2':     enc('hotels', 'saintgermainhotel.jpg'),
  'paris-h3':     enc('hotels', 'generatorhotel.webp'),
  'paris-h4':     enc('hotels', 'hotel-de-crillon-paris.jpg'),
  // Roma
  'roma-h1':      enc('hotels', 'hotel-artemide-roma.jpg'),
  'roma-h2':      enc('hotels', 'trastevere-stylish-good-vibes-apartment-roma.jpg'),
  'roma-h3':      enc('hotels', 'beehive-hotel-roma.webp'),
  'roma-h4':      enc('hotels', 'hassler-hotel-roma.jpg'),
  // Barcelona
  'barcelona-h1': enc('hotels', 'casa-fuster-barcelona.jpg'),
  'barcelona-h2': enc('hotels', 'gotic-boutique-barcelona.jpg'),
  'barcelona-h3': enc('hotels', 'kabul-party-barcelona.webp'),
  'barcelona-h4': enc('hotels', 'barceloneta-barcelona.webp'),
  // Amsterdam
  'amsterdam-h1': enc('hotels', 'pulitzer-amsterdam.jpg'),
  'amsterdam-h2': enc('hotels', 'canal-house-apartment-amsterdam.avif'),
  'amsterdam-h3': enc('hotels', 'clink-hostel-amsterdam.webp'),
  'amsterdam-h4': enc('hotels', 'amsterdam-waldorf-astoria.webp'),
  // Praga
  'praga-h1':     enc('hotels', 'augustine-prague-hotel-praga.jpg'),
  'praga-h2':     enc('hotels', 'praga-old-town-square-apartments.jpg'),
  'praga-h3':     enc('hotels', 'hostel-one-home-praga.webp'),
  'praga-h4':     enc('hotels', 'four-seasons-praga.png'),
  // Lisboa
  'lisboa-h1':    enc('hotels', 'memmo-alfama-lisboa.jpg'),
  'lisboa-h2':    enc('hotels', 'lisbon-charming-apartments-lisboa.jpg'),
  'lisboa-h3':    enc('hotels', 'hostel-lisboa.jpg'),
  'lisboa-h4':    enc('hotels', 'bairro-alto-hotel-lisboa.jpg'),
  // Viena
  'viena-h1':     enc('hotels', 'hotel-sacher-wien-viena.jpg'),
  'viena-h2':     enc('hotels', 'hotel-topazz-viena.jpg'),
  'viena-h3':     enc('hotels', 'vienna-stylish-apartment-viena.jpg'),
  'viena-h4':     enc('hotels', 'wombat-viena.webp'),
  // Londres
  'londres-h1':   enc('hotels', 'the-ned-londres.webp'),
  'londres-h2':   enc('hotels', 'londres-citadines-holborn.jpg'),
  'londres-h3':   enc('hotels', 'notting-hill-londres.jpg'),
  'londres-h4':   enc('hotels', 'YHA-londres.jpg'),
  // Berlim
  'berlim-h1':    enc('hotels', 'berlim-hotel-adlon.jpg'),
  'berlim-h2':    enc('hotels', '25hours-bikini-berlim.jpg'),
  'berlim-h3':    enc('hotels', 'kreuzberg-loft-apartment-berlim.avif'),
  'berlim-h4':    enc('hotels', 'generator-hotel-berlim.jpg'),
  // Madri
  'madri-h1':     enc('hotels', 'four-seasons-hotel-madrid.jpg'),
  'madri-h2':     enc('hotels', 'only-you-boutique-hotel-madrid.jpg'),
  'madri-h3':     enc('hotels', 'malasana-apartment-madrid.avif'),
  'madri-h4':     enc('hotels', 'TOC-hostel-madrid.jpg'),
  // Atenas
  'atenas-h1':    enc('hotels', 'atenas-hotel-bretagne.jpg'),
  'atenas-h2':    enc('hotels', 'plaka-boutique-atenas.jpg'),
  'atenas-h3':    enc('hotels', 'acropolis-apartment-atenas.webp'),
  'atenas-h4':    enc('hotels', 'city-circus-atenas.jpg'),
  // Istambul
  'istambul-h1':  enc('hotels', 'palace-kempinski-istambul.jpg'),
  'istambul-h2':  enc('hotels', 'hotel-empress-zoe-istambul.jpg'),
  'istambul-h3':  enc('hotels', 'galata-apartment-istambul.avif'),
  'istambul-h4':  enc('hotels', 'cheers-hostel-istambul.jpg'),
  // Budapeste
  'budapeste-h1': enc('hotels', 'budapeste-four-seasons.jpg'),
  'budapeste-h2': enc('hotels', 'hotel-rum-budapeste.webp'),
  'budapeste-h3': enc('hotels', 'district7-apartment-budapeste.avif'),
  'budapeste-h4': enc('hotels', 'Maverick-City-Lodge-in-Budapest.jpg'),
  // Florença
  'florenca-h1':  enc('hotels', 'four-seasons-firenze-florenca.avif'),
  'florenca-h2':  enc('hotels', 'hotel-lungarno-florenca.jpg'),
  'florenca-h3':  enc('hotels', 'tuscany-styly-apartment-florenca.jpg'),
  'florenca-h4':  enc('hotels', 'plus-florence-florenca.webp'),
  // Edimburgo
  'edimburgo-h1': enc('hotels', 'balmoral-hotel-edimburgo.jpg'),
  'edimburgo-h2': enc('hotels', 'witchery-castle-edimburgo.jpg'),
  'edimburgo-h3': enc('hotels', 'old-town-charme-edimburgo.jpg'),
  'edimburgo-h4': enc('hotels', 'catle-rock-hostel-edimburgo.jpg'),
  // Copenhague
  'copenhague-h1': enc('hotels', 'hotel-d-angleterre-copenhagen.jpg'),
  'copenhague-h2': enc('hotels', 'hotel-sp34-copenhagen.jpg'),
  'copenhague-h3': enc('hotels', 'vesterbro-desing-apartment-copenhagen.jpg'),
  'copenhague-h4': enc('hotels', 'generator-hostel-conpenhagen.jpg'),
  // ----- Expansão das 6 cidades (imagens baixadas via scripts/baixar-imagens-novas.mjs) -----
  // Madri
  'madri-h5':  enc('hotels', 'mandarin-oriental-ritz-madrid.jpg'),
  'madri-h6':  enc('hotels', 'westin-palace-madrid.jpg'),
  'madri-h7':  enc('hotels', 'dear-hotel-plaza-espana-madrid.jpg'),
  'madri-h8':  enc('hotels', 'the-hat-puerta-del-sol-madrid.jpg'),
  'madri-h9':  enc('hotels', 'ok-hostel-la-latina-madrid.jpg'),
  'madri-h10': enc('hotels', 'chamberi-apartment-madrid.jpg'),
  // Barcelona
  'barcelona-h5':  enc('hotels', 'hotel-arts-barcelona.jpg'),
  'barcelona-h6':  enc('hotels', 'el-palace-barcelona.jpg'),
  'barcelona-h7':  enc('hotels', 'majestic-passeig-gracia-barcelona.jpg'),
  'barcelona-h8':  enc('hotels', 'generator-gracia-barcelona.jpg'),
  'barcelona-h9':  enc('hotels', 'st-christophers-ramblas-barcelona.jpg'),
  'barcelona-h10': enc('hotels', 'eixample-apartment-barcelona.jpg'),
  // Florença
  'florenca-h5':  enc('hotels', 'st-regis-florence-florenca.jpg'),
  'florenca-h6':  enc('hotels', 'hotel-savoy-repubblica-florenca.jpg'),
  'florenca-h7':  enc('hotels', 'hotel-davanzati-florenca.jpg'),
  'florenca-h8':  enc('hotels', 'ostello-bello-san-lorenzo-florenca.jpg'),
  'florenca-h9':  enc('hotels', 'oltrarno-apartment-florenca.jpg'),
  'florenca-h10': enc('hotels', 'duomo-view-apartment-florenca.jpg'),
  // Roma
  'roma-h5':  enc('hotels', 'st-regis-rome-roma.jpg'),
  'roma-h6':  enc('hotels', 'hotel-eden-roma.jpg'),
  'roma-h7':  enc('hotels', 'hotel-quirinale-roma.jpg'),
  'roma-h8':  enc('hotels', 'albergo-del-senato-roma.jpg'),
  'roma-h9':  enc('hotels', 'yellow-hostel-repubblica-roma.jpg'),
  'roma-h10': enc('hotels', 'monti-apartment-roma.jpg'),
  // Budapeste
  'budapeste-h5':  enc('hotels', 'hotel-gellert-budapeste.jpg'),
  'budapeste-h6':  enc('hotels', 'corinthia-budapeste.jpg'),
  'budapeste-h7':  enc('hotels', 'anantara-new-york-palace-budapeste.jpg'),
  'budapeste-h8':  enc('hotels', 'wombats-vaci-budapeste.jpg'),
  'budapeste-h9':  enc('hotels', 'danube-view-apartment-budapeste.jpg'),
  'budapeste-h10': enc('hotels', 'andrassy-boutique-budapeste.jpg'),
  // Atenas
  'atenas-h5':  enc('hotels', 'king-george-atenas.jpg'),
  'atenas-h6':  enc('hotels', 'electra-palace-plaka-atenas.jpg'),
  'atenas-h7':  enc('hotels', 'herodion-hotel-atenas.jpg'),
  'atenas-h8':  enc('hotels', 'athens-backpackers-makrygianni-atenas.jpg'),
  'atenas-h9':  enc('hotels', 'monastiraki-loft-atenas.jpg'),
  'atenas-h10': enc('hotels', 'kolonaki-apartment-atenas.jpg'),
  // ----- Milão, Porto, bate e volta e Accor (scripts/baixar-imagens-milao-porto-accor.mjs) -----
  'milao-h1': enc('hotels', 'milao-h1.jpg'),
  'milao-h2': enc('hotels', 'milao-h2.jpg'),
  'milao-h3': enc('hotels', 'milao-h3.jpg'),
  'porto-h1': enc('hotels', 'porto-h1.jpg'),
  'porto-h2': enc('hotels', 'porto-h2.jpg'),
  'porto-h3': enc('hotels', 'porto-h3.jpg'),
  'paris-accor-ibis': enc('hotels', 'paris-accor-ibis.jpg'),
  'paris-accor-novotel': enc('hotels', 'paris-accor-novotel.jpg'),
  'paris-accor-sofitel': enc('hotels', 'paris-accor-sofitel.jpg'),
  'roma-accor-mercure-termini': enc('hotels', 'roma-accor-mercure-termini.jpg'),
  'roma-accor-mercure-colosseo': enc('hotels', 'roma-accor-mercure-colosseo.jpg'),
  'roma-accor-sofitel': enc('hotels', 'roma-accor-sofitel.jpg'),
  'barcelona-accor-ibis': enc('hotels', 'barcelona-accor-ibis.jpg'),
  'barcelona-accor-novotel': enc('hotels', 'barcelona-accor-novotel.jpg'),
  'amsterdam-accor-ibis': enc('hotels', 'amsterdam-accor-ibis.jpg'),
  'amsterdam-accor-sofitel': enc('hotels', 'amsterdam-accor-sofitel.jpg'),
  'praga-accor-ibis': enc('hotels', 'praga-accor-ibis.jpg'),
  'praga-accor-novotel': enc('hotels', 'praga-accor-novotel.jpg'),
  'lisboa-accor-ibis': enc('hotels', 'lisboa-accor-ibis.jpg'),
  'lisboa-accor-novotel': enc('hotels', 'lisboa-accor-novotel.jpg'),
  'lisboa-accor-sofitel': enc('hotels', 'lisboa-accor-sofitel.jpg'),
  'viena-accor-ibis': enc('hotels', 'viena-accor-ibis.jpg'),
  'viena-accor-novotel': enc('hotels', 'viena-accor-novotel.jpg'),
  'londres-accor-ibis': enc('hotels', 'londres-accor-ibis.jpg'),
  'londres-accor-novotel': enc('hotels', 'londres-accor-novotel.jpg'),
  'londres-accor-sofitel': enc('hotels', 'londres-accor-sofitel.jpg'),
  'berlim-accor-ibis': enc('hotels', 'berlim-accor-ibis.jpg'),
  'berlim-accor-novotel': enc('hotels', 'berlim-accor-novotel.jpg'),
  'berlim-accor-sofitel': enc('hotels', 'berlim-accor-sofitel.jpg'),
  'madri-accor-ibis': enc('hotels', 'madri-accor-ibis.jpg'),
  'madri-accor-ibis-styles': enc('hotels', 'madri-accor-ibis-styles.jpg'),
  'madri-accor-novotel': enc('hotels', 'madri-accor-novotel.jpg'),
  'atenas-accor-ibis-styles': enc('hotels', 'atenas-accor-ibis-styles.jpg'),
  'atenas-accor-novotel': enc('hotels', 'atenas-accor-novotel.jpg'),
  'istambul-accor-mercure': enc('hotels', 'istambul-accor-mercure.jpg'),
  'istambul-accor-novotel': enc('hotels', 'istambul-accor-novotel.jpg'),
  'istambul-accor-swissotel': enc('hotels', 'istambul-accor-swissotel.jpg'),
  'budapeste-accor-ibis': enc('hotels', 'budapeste-accor-ibis.jpg'),
  'budapeste-accor-novotel': enc('hotels', 'budapeste-accor-novotel.jpg'),
  'budapeste-accor-sofitel': enc('hotels', 'budapeste-accor-sofitel.jpg'),
  'florenca-accor-mercure': enc('hotels', 'florenca-accor-mercure.jpg'),
  'florenca-accor-ibis': enc('hotels', 'florenca-accor-ibis.jpg'),
  'edimburgo-accor-ibis': enc('hotels', 'edimburgo-accor-ibis.jpg'),
  'edimburgo-accor-novotel': enc('hotels', 'edimburgo-accor-novotel.jpg'),
  'copenhague-accor-ibis-styles': enc('hotels', 'copenhague-accor-ibis-styles.jpg'),
  'milao-accor-ibis': enc('hotels', 'milao-accor-ibis.jpg'),
  'milao-accor-ibis-styles': enc('hotels', 'milao-accor-ibis-styles.jpg'),
  'milao-accor-mercure': enc('hotels', 'milao-accor-mercure.jpg'),
  'porto-accor-ibis': enc('hotels', 'porto-accor-ibis.jpg'),
  'porto-accor-mercure': enc('hotels', 'porto-accor-mercure.jpg'),
  'porto-accor-novotel': enc('hotels', 'porto-accor-novotel.jpg'),
  // ----- Milão, Porto, bate e volta e Accor (scripts/baixar-imagens-milao-porto-accor.mjs) -----
  'paris-accor-ibis-budget': enc('hotels', 'paris-accor-ibis-budget.jpg'),
  'paris-accor-ibis-styles': enc('hotels', 'paris-accor-ibis-styles.jpg'),
  'roma-accor-jojo': enc('hotels', 'roma-accor-jojo.jpg'),
  'barcelona-accor-ibis-budget': enc('hotels', 'barcelona-accor-ibis-budget.jpg'),
  'barcelona-accor-ibis-styles': enc('hotels', 'barcelona-accor-ibis-styles.jpg'),
  'amsterdam-accor-ibis-stopera': enc('hotels', 'amsterdam-accor-ibis-stopera.jpg'),
  'amsterdam-accor-ibis-styles': enc('hotels', 'amsterdam-accor-ibis-styles.jpg'),
  'praga-accor-ibis-wenceslas': enc('hotels', 'praga-accor-ibis-wenceslas.jpg'),
  'lisboa-accor-ibis-saldanha': enc('hotels', 'lisboa-accor-ibis-saldanha.jpg'),
  'lisboa-accor-ibis-styles': enc('hotels', 'lisboa-accor-ibis-styles.jpg'),
  'viena-accor-jojo': enc('hotels', 'viena-accor-jojo.jpg'),
  'viena-accor-ibis-budget': enc('hotels', 'viena-accor-ibis-budget.jpg'),
  'londres-accor-ibis-styles': enc('hotels', 'londres-accor-ibis-styles.jpg'),
  'berlim-accor-ibis-budget': enc('hotels', 'berlim-accor-ibis-budget.jpg'),
  'madri-accor-ibis-budget': enc('hotels', 'madri-accor-ibis-budget.jpg'),
  'madri-accor-mercure': enc('hotels', 'madri-accor-mercure.jpg'),
  'budapeste-accor-jojo': enc('hotels', 'budapeste-accor-jojo.jpg'),
  'budapeste-accor-ibis-castle': enc('hotels', 'budapeste-accor-ibis-castle.jpg'),
  'edimburgo-accor-ibis-styles': enc('hotels', 'edimburgo-accor-ibis-styles.jpg'),
  'porto-accor-ibis-budget': enc('hotels', 'porto-accor-ibis-budget.jpg'),
  'porto-accor-ibis-sao-bento': enc('hotels', 'porto-accor-ibis-sao-bento.jpg'),
  // ----- Milão, Porto, bate e volta e Accor (scripts/baixar-imagens-milao-porto-accor.mjs) -----
  'atenas-accor-mgallery': enc('hotels', 'atenas-accor-mgallery.jpg')
}

// ----- Atrações (80 de 80) -----
export const IMAGENS_ATRACAO = {
  // Paris
  'paris-eiffel':       enc('attractions', 'torreEiffel.jpg'),
  'paris-louvre':       enc('attractions', 'paris-museu-louvre.jpg'),
  'paris-notre-dame':   enc('attractions', 'paris-notre-dame.jpg'),
  'paris-montmartre':   enc('attractions', 'paris-montmartre.jpg'),
  'paris-versailles':   enc('attractions', 'paris-palacio-versalhes.jpg'),
  // Roma
  'roma-coliseu':       enc('attractions', 'coliseu.jpg'),
  'roma-vaticano':      enc('attractions', 'museus-vaticanos.jpg'),
  'roma-trevi':         enc('attractions', 'roma-fontana-di-Trevi.jpg'),
  'roma-pantheon':      enc('attractions', 'roma-pantheon.jpg'),
  'roma-trastevere':    enc('hotels', 'tour-Trastevere-Roma.webp'), // arquivo está em hotels/
  // Barcelona
  'barcelona-sagrada':     enc('attractions', 'barcelona-sagrada-familia.jpg'),
  'barcelona-guell':       enc('attractions', 'barcelona-park-guell.jpg'),
  'barcelona-gotico':      enc('attractions', 'barcelona-bairro-gotico.jpg'),
  'barcelona-casa-batllo': enc('attractions', 'barcelona-casa-bastllo.jpg'),
  'barcelona-barceloneta': enc('attractions', 'barcelona-praia-barceloneta.jpg'),
  // Amsterdam
  'amsterdam-canais':   enc('attractions', 'Um-dos-passeios-de-barco-nos-canais-de-Amsterdam.jpg'),
  'amsterdam-vangogh':  enc('attractions', 'van-gogh-museum-amsterdam.jpg'),
  'amsterdam-anne':     enc('attractions', 'Visita-a-Casa-de-Anne-Frank-Amsterdam.jpg'),
  'amsterdam-rijks':    enc('attractions', 'amsterdam-rijksmuseum.jpg'),
  'amsterdam-jordaan':  enc('attractions', 'jordaan-amsterdam.jpg'),
  // Praga
  'praga-castelo':      enc('attractions', 'praga-castelo.jpg'),
  'praga-carlos':       enc('attractions', 'praga-ponte-carlos.jpg'),
  'praga-relogio':      enc('attractions', 'praga-relogio-astronomico.jpg'),
  'praga-cerveja':      enc('attractions', 'tour-cerverjaria-praga.avif'),
  'praga-judaico':      enc('attractions', 'praga-bairro-judaico.jpg'),
  // Lisboa
  'lisboa-belem':       enc('attractions', 'lisboa-Mosteiro_dos_Jeronimos.jpg'),
  'lisboa-castelo':     enc('attractions', 'lisboa-castelo-sao-jorge.jpg'),
  'lisboa-alfama':      enc('attractions', 'lisboa-alfama-fado.jpg'),
  'lisboa-sintra':      enc('attractions', 'lisboa-bate-volta-sintra.jpg'),
  'lisboa-bondinho':    enc('attractions', 'bondinho28-lisboa.png'),
  // Viena
  'viena-schonbrunn':   enc('attractions', 'viena-palacio-de-schonbrunn.jpg'),
  'viena-stephans':     enc('attractions', 'viena-catedral-santo-estevao.jpg'),
  'viena-belvedere':    enc('attractions', 'viena-palacio-belvedere.jpg'),
  'viena-opera':        enc('attractions', 'viena-noite-opera.jpg'),
  'viena-cafes':        enc('attractions', 'tour-cafe-viena.jpg'),
  // Londres
  'londres-bigben':     enc('attractions', 'londres-big-ben.jpg'),
  'londres-british':    enc('attractions', 'londres-british-museum.jpg'),
  'londres-tower':      enc('attractions', 'tower-bridge-londres.jpg'),
  'londres-camden':     enc('attractions', 'londres-camden-market.jpg'),
  'londres-eye':        enc('attractions', 'londres-london-eye.jpg'),
  // Berlim
  'berlim-brandemburgo': enc('attractions', 'berlim-portao-de-brandemburgo.jpg'),
  'berlim-muro':         enc('attractions', 'berlim-east-side-gallery.jpg'),
  'berlim-pergamon':     enc('attractions', 'berlim-ilha-dos-museus.jpg'),
  'berlim-reichstag':    enc('attractions', 'cupula-de-vidro-berlim.webp'),
  'berlim-kreuzberg':    enc('attractions', 'tour-gastronomico-berlim.jpg'),
  // Madri
  'madri-prado':        enc('attractions', 'madri-Museu-do-Prado.jpg'),
  'madri-palacio':      enc('attractions', 'madri-palacio-real-de-madri.jpg'),
  'madri-retiro':       enc('attractions', 'parque-do-retiro-madrid.jpg'),
  'madri-tapas':        enc('attractions', 'tour-tapas-lalatina-madrid.jpg'),
  'madri-flamenco':     enc('attractions', 'madri-show-flamenco.jpg'),
  // Atenas
  'atenas-acropole':    enc('attractions', 'atenas-acropole-partenon.jpg'),
  'atenas-museu':       enc('attractions', 'atenas-museu-arqueologico.jpg'),
  'atenas-plaka':       enc('attractions', 'plaza-monastiraki-atenas.webp'),
  'atenas-sounion':     enc('attractions', 'cabo-sounion-atenas.jpg'),
  'atenas-comida':      enc('attractions', 'tour-comida-grega-atenas.jpg'),
  // Istambul
  'istambul-hagia':     enc('attractions', 'istambul-Hagia-Sophia.jpg'),
  'istambul-mesquita':  enc('attractions', 'istambul-mesquita-azul.jpg'),
  'istambul-topkapi':   enc('attractions', 'palacio-topkapi-istambul.jpg'),
  'istambul-bazar':     enc('attractions', 'istambul-bazar-das-especiarias.jpg'),
  'istambul-bosforo':   enc('attractions', 'cruzeiro-bosforo-istambul.jpg'),
  // Budapeste
  'budapeste-parlamento': enc('attractions', 'budapeste-Budapest-Parliament.jpg'),
  'budapeste-bastiao':    enc('attractions', 'budapeste-castelo-buda-bastiao-pecadores.jpg'),
  'budapeste-termas':     enc('attractions', 'termas-szechenyi-budapeste.jpg'),
  'budapeste-ruin':       enc('attractions', 'ruin-bars-budapeste.jpg'),
  'budapeste-cruzeiro':   enc('attractions', 'cruzeiro-danubio-budapeste.jpg'),
  // Florença
  'florenca-duomo':     enc('attractions', 'florenca-duomo.jpg'),
  'florenca-uffizi':    enc('attractions', 'interior-da-galleria-degli-uffizi-florenca.jpg'),
  'florenca-david':     enc('attractions', 'galleria-dellaccademia-david-florenca.jpg'),
  'florenca-vecchio':   enc('attractions', 'florenca-ponte-veccheio.jpg'),
  'florenca-toscana':   enc('attractions', 'tour-vinhos-florenca.jpg'),
  // Edimburgo
  'edimburgo-castelo':   enc('attractions', 'edimburgo-castelo-edimbugo.jpg'),
  'edimburgo-royalmile': enc('attractions', 'royal-mile-edimburgo.jpg'),
  'edimburgo-arthur':    enc('attractions', 'trilha-arthurseat-edimburgo.jpg'),
  'edimburgo-fantasmas': enc('attractions', 'tour-fantasmas-edimburgo.jpg'),
  'edimburgo-whisky':    enc('attractions', 'scotch-whisky-edimburgo.jpg'),
  // Copenhague
  'copenhague-nyhavn':       enc('attractions', 'nyhavn-conpenhage.webp'),
  'copenhague-sereia':       enc('attractions', 'copenhagen-pequena-sereia.jpg'),
  'copenhague-tivoli':       enc('attractions', 'jardins-tivoli-copenhagen.jpg'),
  'copenhague-christiania':  enc('attractions', 'Entree_de_Christiania-conpenhagen.jpg'),
  'copenhague-canais':       enc('attractions', 'tour-de-bicicleta-copenhagen.jpg'),
  // ----- Expansão das 6 cidades (imagens baixadas via scripts/baixar-imagens-novas.mjs) -----
  // Madri
  'madri-reina-sofia':       enc('attractions', 'madri-museu-reina-sofia.jpg'),
  'madri-thyssen':           enc('attractions', 'madri-museu-thyssen.jpg'),
  'madri-plaza-mayor':       enc('attractions', 'madri-plaza-mayor.jpg'),
  'madri-bernabeu':          enc('attractions', 'madri-estadio-bernabeu.jpg'),
  'madri-mercado-san-miguel': enc('attractions', 'madri-mercado-san-miguel.jpg'),
  'madri-templo-debod':      enc('attractions', 'madri-templo-debod.jpg'),
  'madri-gran-via':          enc('attractions', 'madri-gran-via.jpg'),
  // Barcelona
  'barcelona-pedrera':       enc('attractions', 'barcelona-casa-mila-pedrera.jpg'),
  'barcelona-picasso':       enc('attractions', 'barcelona-museu-picasso.jpg'),
  'barcelona-montjuic':      enc('attractions', 'barcelona-montjuic.jpg'),
  'barcelona-camp-nou':      enc('attractions', 'barcelona-camp-nou.jpg'),
  'barcelona-boqueria':      enc('attractions', 'barcelona-la-boqueria.jpg'),
  'barcelona-tibidabo':      enc('attractions', 'barcelona-tibidabo.jpg'),
  'barcelona-palau':         enc('attractions', 'barcelona-palau-musica.jpg'),
  // Florença
  'florenca-pitti':          enc('attractions', 'florenca-palazzo-pitti.jpg'),
  'florenca-signoria':       enc('attractions', 'florenca-palazzo-vecchio.jpg'),
  'florenca-michelangelo':   enc('attractions', 'florenca-piazzale-michelangelo.jpg'),
  'florenca-santa-croce':    enc('attractions', 'florenca-santa-croce.jpg'),
  'florenca-mercato':        enc('attractions', 'florenca-mercato-centrale.jpg'),
  'florenca-bargello':       enc('attractions', 'florenca-bargello.jpg'),
  'florenca-fiesole':        enc('attractions', 'florenca-fiesole.jpg'),
  // Roma
  'roma-borghese':           enc('attractions', 'roma-galleria-borghese.jpg'),
  'roma-castel':             enc('attractions', 'roma-castel-santangelo.jpg'),
  'roma-espanha':            enc('attractions', 'roma-spanish-steps.jpg'),
  'roma-san-pietro':         enc('attractions', 'roma-san-pietro.jpg'),
  'roma-catacumbas':         enc('attractions', 'roma-catacumbas-callisto.jpg'),
  'roma-campo-fiori':        enc('attractions', 'roma-campo-de-fiori.jpg'),
  'roma-appia':              enc('attractions', 'roma-via-appia.jpg'),
  // Budapeste
  'budapeste-matthias':      enc('attractions', 'budapeste-igreja-matthias.jpg'),
  'budapeste-gellert':       enc('attractions', 'budapeste-colina-gellert.jpg'),
  'budapeste-sinagoga':      enc('attractions', 'budapeste-sinagoga-dohany.jpg'),
  'budapeste-basilica':      enc('attractions', 'budapeste-basilica-santo-estevao.jpg'),
  'budapeste-mercado':       enc('attractions', 'budapeste-mercado-central.jpg'),
  'budapeste-herois':        enc('attractions', 'budapeste-praca-herois.jpg'),
  'budapeste-opera':         enc('attractions', 'budapeste-opera-hungara.jpg'),
  // Atenas
  'atenas-museu-acropole':   enc('attractions', 'atenas-museu-acropole.jpg'),
  'atenas-agora':            enc('attractions', 'atenas-agora-antiga.jpg'),
  'atenas-licabeto':         enc('attractions', 'atenas-monte-licabeto.jpg'),
  'atenas-zeus':             enc('attractions', 'atenas-templo-zeus.jpg'),
  'atenas-syntagma':         enc('attractions', 'atenas-praca-syntagma.jpg'),
  'atenas-anafiotika':       enc('attractions', 'atenas-anafiotika.jpg'),
  'atenas-panatenaico':      enc('attractions', 'atenas-estadio-panatenaico.jpg'),
  // ----- Milão, Porto, bate e volta e Accor (scripts/baixar-imagens-milao-porto-accor.mjs) -----
  'milao-duomo': enc('attractions', 'milao-duomo.jpg'),
  'milao-cenacolo': enc('attractions', 'milao-cenacolo.jpg'),
  'milao-galleria': enc('attractions', 'milao-galleria.jpg'),
  'milao-sforzesco': enc('attractions', 'milao-sforzesco.jpg'),
  'milao-brera': enc('attractions', 'milao-brera.jpg'),
  'milao-scala': enc('attractions', 'milao-scala.jpg'),
  'milao-navigli': enc('attractions', 'milao-navigli.jpg'),
  'milao-porta-nuova': enc('attractions', 'milao-porta-nuova.jpg'),
  'milao-san-siro': enc('attractions', 'milao-san-siro.jpg'),
  'porto-ribeira': enc('attractions', 'porto-ribeira.jpg'),
  'porto-lello': enc('attractions', 'porto-lello.jpg'),
  'porto-caves': enc('attractions', 'porto-caves.jpg'),
  'porto-clerigos': enc('attractions', 'porto-clerigos.jpg'),
  'porto-bolsa': enc('attractions', 'porto-bolsa.jpg'),
  'porto-sao-bento': enc('attractions', 'porto-sao-bento.jpg'),
  'porto-se': enc('attractions', 'porto-se.jpg'),
  'porto-cruzeiro': enc('attractions', 'porto-cruzeiro.jpg'),
  'porto-serralves': enc('attractions', 'porto-serralves.jpg'),
  'porto-foz': enc('attractions', 'porto-foz.jpg'),
  'madri-toledo': enc('attractions', 'madri-toledo.jpg'),
  'milao-lugano': enc('attractions', 'milao-lugano.jpg'),
  'milao-bernina': enc('attractions', 'milao-bernina.jpg')
}
