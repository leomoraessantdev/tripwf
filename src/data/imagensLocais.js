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

// ----- Cidades (16 de 16) -----
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
  copenhague: enc('cities', 'Copenhagen.jpg')
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
  'copenhague-h4': enc('hotels', 'generator-hostel-conpenhagen.jpg')
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
  'copenhague-canais':       enc('attractions', 'tour-de-bicicleta-copenhagen.jpg')
}
