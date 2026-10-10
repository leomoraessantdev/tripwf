// Hotéis da rede Accor por cidade (ibis budget → Sofitel + hostels JO&JOE).
//
// Nome, código (`codigo`), nota e bairro vêm do catálogo oficial ALL Accor
// (JSON-LD das páginas de destino, coletado em out/2026) — o código abre a
// página de reserva DO HOTEL já com check-in, noites e hóspedes.
//
// `precoNoite` = tarifa pública média em EUR para quarto duplo (hostel: por
// cama) fora da alta temporada, calibrada com tarifas reais observadas no
// ALL Accor (ex.: ibis Porto ≈ R$310/noite ≈ €53). A temporada ajusta o valor
// no cálculo da viagem; o preço exato aparece no link com as datas.
//
// `destino` (ACCOR_DESTINO) é o slug da busca por cidade, usado como fallback.
// Mesclados em cidade.hospedagens por data/cidades.js.

export const ACCOR_DESTINO = {
  paris: 'paris-france',
  roma: 'rome-italy',
  barcelona: 'barcelona-spain',
  amsterdam: 'amsterdam-netherlands',
  praga: 'prague-czech-republic',
  lisboa: 'lisbon-portugal',
  viena: 'vienna-austria',
  londres: 'london-united-kingdom',
  berlim: 'berlin-germany',
  madri: 'madrid-spain',
  atenas: 'athens-greece',
  istambul: 'istanbul-turkey',
  budapeste: 'budapest-hungary',
  florenca: 'florence-italy',
  edimburgo: 'edinburgh-united-kingdom',
  copenhague: 'copenhagen-denmark',
  milao: 'milan-italy',
  porto: 'porto-portugal'
}

const BUDGET = ['Wi-Fi', 'Ar-condicionado', 'Café da manhã (à parte)']
const IBIS = ['Wi-Fi', 'Bar 24h', 'Café da manhã (à parte)']
const STYLES = ['Café da manhã incluso', 'Wi-Fi', 'Ar-condicionado']
const MEDIO = ['Café da manhã', 'Wi-Fi', 'Academia']
const HOSTEL = ['Cozinha compartilhada', 'Wi-Fi', 'Quartos privativos também']

const h = (id, codigo, nome, marca, precoNoite, avaliacao, bairro, comodidades, tipo = 'Hotel') =>
  ({ id, codigo, nome, marca, precoNoite, avaliacao, tipo, bairro, comodidades })

export const HOTEIS_ACCOR = {
  paris: [
    h('paris-accor-ibis-budget', '4982', 'ibis budget Paris La Villette 19th', 'ibis budget', 72, 4.2, 'La Villette (19ème)', BUDGET),
    h('paris-accor-ibis', '1400', 'ibis Paris Tour Eiffel Cambronne 15ème', 'ibis', 115, 4.3, '15ème (Torre Eiffel)', IBIS),
    h('paris-accor-ibis-styles', 'B625', 'ibis Styles Paris Gare de Lyon Bastille', 'ibis Styles', 120, 4.6, 'Bastille / Gare de Lyon', STYLES),
    h('paris-accor-novotel', '0785', 'Novotel Paris Les Halles', 'Novotel', 220, 4.5, 'Les Halles (1er)', MEDIO),
    h('paris-accor-sofitel', '1295', 'Sofitel Paris le Faubourg', 'Sofitel', 480, 4.7, 'Faubourg Saint-Honoré', ['Spa', 'Concierge 24h', 'Restaurante'])
  ],
  roma: [
    h('roma-accor-jojo', 'B730', 'JO&JOE Roma', 'JO&JOE', 40, 4.5, 'Quattro Fontane (Termini)', HOSTEL, 'Hostel'),
    h('roma-accor-mercure-termini', 'B834', 'Mercure Roma Centro Termini', 'Mercure', 120, 4.2, 'Termini', MEDIO),
    h('roma-accor-mercure-colosseo', '2909', 'Mercure Rome Colosseum Centre', 'Mercure', 140, 4.5, 'Colosseo (Via Labicana)', ['A pé do Coliseu', 'Café da manhã', 'Wi-Fi']),
    h('roma-accor-sofitel', '1312', 'Sofitel Roma Villa Borghese', 'Sofitel', 330, 4.7, 'Villa Borghese', ['Rooftop com vista', 'Restaurante', 'Concierge 24h'])
  ],
  barcelona: [
    h('barcelona-accor-ibis-budget', 'C2N3', 'ibis budget Barcelona Center', 'ibis budget', 65, 4.4, 'Poblenou', BUDGET),
    h('barcelona-accor-ibis', '7567', 'ibis Barcelona Centro (Sagrada Família)', 'ibis', 85, 4.6, 'Eixample (Sagrada Família)', IBIS),
    h('barcelona-accor-ibis-styles', '9898', 'ibis Styles Barcelona Centre', 'ibis Styles', 100, 4.6, 'Eixample (Passeig de Gràcia)', STYLES),
    h('barcelona-accor-novotel', '5560', 'Novotel Barcelona City', 'Novotel', 120, 4.3, 'Glòries / Poblenou', ['Piscina no rooftop', 'Academia', 'Wi-Fi']),
    h('barcelona-accor-sofitel', '7341', 'Sofitel Barcelona Skipper', 'Sofitel', 260, 4.8, 'Port Olímpic (praia)', ['2 piscinas', 'Spa', 'A 2 min da praia'])
  ],
  amsterdam: [
    h('amsterdam-accor-ibis-stopera', '3044', 'ibis Amsterdam Centre Stopera', 'ibis', 115, 4.4, 'Waterlooplein', IBIS),
    h('amsterdam-accor-ibis', '1556', 'ibis Amsterdam Centre', 'ibis', 125, 4.3, 'Centraal Station', IBIS),
    h('amsterdam-accor-ibis-styles', '9137', 'ibis Styles Amsterdam Central Station', 'ibis Styles', 130, 4.3, 'Centraal Station', STYLES),
    h('amsterdam-accor-sofitel', '2783', 'Sofitel Legend The Grand Amsterdam', 'Sofitel', 480, 4.8, 'Centrum', ['Prédio histórico', 'Spa', 'Restaurante'])
  ],
  praga: [
    h('praga-accor-ibis-wenceslas', '3195', 'ibis Praha Wenceslas Square', 'ibis', 62, 4.5, 'Nové Město', IBIS),
    h('praga-accor-ibis', '5477', 'ibis Praha Old Town', 'ibis', 68, 4.5, 'Na Poříčí (Staré Město)', IBIS),
    h('praga-accor-novotel', '3194', 'Novotel Praha Wenceslas Square', 'Novotel', 88, 4.5, 'Nové Město', ['Piscina coberta', 'Sauna', 'Wi-Fi'])
  ],
  lisboa: [
    h('lisboa-accor-ibis-saldanha', '2117', 'ibis Lisboa Centro Saldanha', 'ibis', 70, 4.6, 'Saldanha', IBIS),
    h('lisboa-accor-ibis', '3137', 'ibis Lisboa Centro Liberdade', 'ibis', 75, 4.6, 'Avenida da Liberdade', IBIS),
    h('lisboa-accor-ibis-styles', 'A146', 'ibis Styles Lisboa Centro Liberdade NE', 'ibis Styles', 82, 4.6, 'Avenida da Liberdade', STYLES),
    h('lisboa-accor-novotel', '0784', 'Novotel Lisboa', 'Novotel', 95, 4.2, 'Praça de Espanha', ['Piscina externa', 'Academia', 'Wi-Fi']),
    h('lisboa-accor-sofitel', '1319', 'Sofitel Lisbon Liberdade', 'Sofitel', 200, 4.6, 'Avenida da Liberdade', ['Concierge 24h', 'Restaurante', 'Bar'])
  ],
  viena: [
    h('viena-accor-jojo', 'B677', 'JO&JOE Vienna', 'JO&JOE', 35, 4.4, 'Westbahnhof (Europaplatz)', HOSTEL, 'Hostel'),
    h('viena-accor-ibis-budget', '7098', 'ibis budget Wien Messe', 'ibis budget', 55, 4.1, 'Leopoldstadt (Messe)', BUDGET),
    h('viena-accor-ibis', '8564', 'ibis Wien Hauptbahnhof', 'ibis', 72, 4.7, 'Hauptbahnhof', IBIS),
    h('viena-accor-novotel', '6154', 'Novotel Wien City', 'Novotel', 115, 4.4, 'Leopoldstadt', ['Bar no rooftop', 'Café da manhã', 'Wi-Fi']),
    h('viena-accor-so', '6599', 'SO/ Vienna', 'SO/', 230, 4.6, 'Canal do Danúbio', ['Restaurante panorâmico', 'Spa', 'Concierge 24h'])
  ],
  londres: [
    h('londres-accor-ibis', '7943', 'ibis London Blackfriars', 'ibis', 140, 4.5, 'Southwark (Blackfriars)', IBIS),
    h('londres-accor-ibis-styles', '7465', 'ibis Styles London Southwark - near Borough Market', 'ibis Styles', 145, 4.6, 'Borough Market', STYLES),
    h('londres-accor-novotel', '3107', 'Novotel London Tower Bridge', 'Novotel', 200, 4.6, 'Tower Hill', MEDIO),
    h('londres-accor-sofitel', '3144', 'Sofitel London St James', 'Sofitel', 450, 4.8, "St James's", ['Spa', 'Restaurante', 'Concierge 24h'])
  ],
  berlim: [
    h('berlim-accor-ibis-budget', '5513', 'ibis budget Berlin Alexanderplatz', 'ibis budget', 55, 4.4, 'Alexanderplatz', BUDGET),
    h('berlim-accor-ibis', '0357', 'ibis Berlin Mitte', 'ibis', 72, 4.5, 'Mitte / Prenzlauer Berg', IBIS),
    h('berlim-accor-novotel', '3278', 'Novotel Berlin Mitte', 'Novotel', 110, 4.5, 'Mitte (Fischerinsel)', ['Sauna', 'Café da manhã', 'Wi-Fi'])
  ],
  madri: [
    h('madri-accor-ibis-budget', 'A0F2', 'ibis budget Madrid Centro Lavapies', 'ibis budget', 55, 4.2, 'Lavapiés', BUDGET),
    h('madri-accor-ibis', '7438', 'ibis Madrid Centro las Ventas', 'ibis', 68, 4.5, 'Ventas (metrô L2/L5)', IBIS),
    h('madri-accor-ibis-styles', '8052', 'ibis Styles Madrid Prado', 'ibis Styles', 95, 4.7, 'Barrio de las Letras', ['Café da manhã incluso', 'Wi-Fi', 'A pé do Prado']),
    h('madri-accor-mercure', '9618', 'Mercure Madrid Centro', 'Mercure', 110, 4.3, 'Barrio de las Letras', MEDIO),
    h('madri-accor-novotel', '9298', 'Novotel Madrid Center', 'Novotel', 115, 4.5, 'Retiro', ['Terraço no rooftop', 'Academia', 'Wi-Fi'])
  ],
  atenas: [
    h('atenas-accor-ibis-styles', 'B448', 'ibis Styles Athens Routes', 'ibis Styles', 80, 4.7, 'Neos Kosmos (perto da Acrópole)', ['Café da manhã incluso', 'Academia', 'Wi-Fi']),
    h('atenas-accor-novotel', '0866', 'Novotel Athènes', 'Novotel', 100, 3.9, 'Metaxourgeio', ['Piscina no rooftop', 'Vista da Acrópole', 'Wi-Fi']),
    h('atenas-accor-mgallery', 'B3X8', 'Athens Capital Hotel - MGallery Collection', 'MGallery', 230, 4.8, 'Praça Syntagma', ['Rooftop', 'Spa', 'Restaurante'])
  ],
  istambul: [
    h('istambul-accor-mercure', 'B4D8', 'Mercure Istanbul Sirkeci', 'Mercure', 80, 4.6, 'Sirkeci (Cidade Velha)', MEDIO),
    h('istambul-accor-novotel', '8654', 'Novotel Istanbul Bosphorus', 'Novotel', 110, 4.7, 'Karaköy', ['Piscina coberta', 'Spa', 'Vista do Bósforo']),
    h('istambul-accor-swissotel', 'A5D2', 'Swissôtel The Bosphorus - Istanbul', 'Swissôtel', 260, 4.7, 'Beşiktaş', ['Spa', 'Piscinas', 'Vista do Bósforo'])
  ],
  budapeste: [
    h('budapeste-accor-jojo', 'C0A8', 'JO&JOE Budapest', 'JO&JOE', 28, 4.3, 'Bairro Judeu (Dohány utca)', HOSTEL, 'Hostel'),
    h('budapeste-accor-ibis', '2078', 'ibis Budapest Centrum', 'ibis', 55, 4.5, 'Ráday utca (Ferencváros)', IBIS),
    h('budapeste-accor-ibis-castle', 'B427', 'ibis Budapest Castle Hill', 'ibis', 60, 4.5, 'Buda (Colina do Castelo)', IBIS),
    h('budapeste-accor-novotel', '6151', 'Novotel Budapest Danube', 'Novotel', 95, 4.5, 'Buda (vista do Parlamento)', ['Vista do Danúbio', 'Sauna', 'Wi-Fi'])
  ],
  florenca: [
    h('florenca-accor-ibis', '3728', 'ibis Florence North Airport', 'ibis', 70, 4.0, 'Osmannoro (8 km do centro, perto do aeroporto)', ['Estacionamento grátis', 'Wi-Fi', 'Recepção 24h']),
    h('florenca-accor-mercure', '9131', 'Mercure Florence Center', 'Mercure', 140, 4.7, 'Santa Maria Novella', ['Pátio interno', 'Café da manhã', 'Wi-Fi'])
  ],
  edimburgo: [
    h('edimburgo-accor-ibis', '2039', 'ibis Edinburgh Centre Royal Mile', 'ibis', 110, 4.4, 'Old Town (Hunter Square)', IBIS),
    h('edimburgo-accor-ibis-styles', '9058', 'ibis Styles Edinburgh St Andrew Square', 'ibis Styles', 120, 4.7, 'New Town (St Andrew Square)', STYLES),
    h('edimburgo-accor-novotel', '3271', 'Novotel Edinburgh Centre', 'Novotel', 130, 4.4, 'Lauriston', ['Piscina coberta', 'Café da manhã', 'Wi-Fi'])
  ],
  copenhague: [
    h('copenhague-accor-ibis-styles', 'B5E3', 'ibis Styles Copenhagen Orestad', 'ibis Styles', 95, 4.7, 'Ørestad (15 min de metrô)', ['Café da manhã incluso', 'Wi-Fi', 'Metrô na porta'])
  ],
  milao: [
    h('milao-accor-ibis-styles', 'A024', 'ibis Styles Milano Centro', 'ibis Styles', 80, 3.9, 'Stazione Centrale', STYLES),
    h('milao-accor-ibis', '0933', 'ibis Milano Centro', 'ibis', 85, 4.3, 'Stazione Centrale', IBIS),
    h('milao-accor-mercure', '7926', 'Mercure Milano Solari', 'Mercure', 110, 4.0, 'Tortona / Navigli', MEDIO)
  ],
  porto: [
    h('porto-accor-ibis-budget', '5106', 'ibis budget Porto Gaia', 'ibis budget', 45, 4.5, 'Afurada (Vila Nova de Gaia)', BUDGET),
    h('porto-accor-ibis-sao-bento', '3344', 'ibis Porto Centro São Bento', 'ibis', 55, 4.3, 'Baixa (Rua da Alegria)', IBIS),
    h('porto-accor-ibis', 'A7J9', 'ibis Porto Centro Mercado do Bolhão', 'ibis', 58, 4.5, 'Bolhão', IBIS),
    h('porto-accor-novotel', '1050', 'Novotel Porto Gaia', 'Novotel', 80, 4.4, 'Afurada (Vila Nova de Gaia)', ['Piscina externa', 'Estacionamento', 'Wi-Fi']),
    h('porto-accor-mercure', 'B2L7', 'Mercure Porto Centro Aliados', 'Mercure', 95, 4.8, 'Aliados', ['Piscina aquecida', 'Jardim', 'Academia'])
  ]
}
