// Dados das 16 cidades europeias com atrações turísticas e hospedagens.
// Preços em EUR. Imagens vêm de arquivos LOCAIS em /public/images, mapeados
// no manifesto src/data/imagensLocais.js — zero dependência de rede.
// Wikipedia segue sendo usada SÓ para texto auxiliar (extract no popup do
// mapa e bloco "Sobre na Wikipedia" no card de atração) — via campo `wiki`
// abaixo. Imagem em si vem 100% local.

import { linkIngresso, linkReserva } from '../utils/links.js'
import {
  IMAGENS_CIDADE,
  IMAGENS_HOSPEDAGEM,
  IMAGENS_ATRACAO
} from './imagensLocais.js'
import { EPOCA_CIDADE } from './epocas.js'

// Helpers ainda existem para compatibilidade com as definições abaixo —
// retornam array vazio. A imagem real vem do campo `wiki` (Wikipedia REST).
const aimg = () => []
const himg = () => []

// Custo médio de alimentação por dia/pessoa em EUR.
// Valores baseados em médias do Numbeo/Budget Your Trip 2024-2025 — refletem
// um almoço + jantar moderado + cafés. O usuário ainda pode economizar (street
// food, supermercado) ou gastar mais (restaurante estrelado).
const ALIMENTACAO_DIA = {
  paris:      55,  // alta
  roma:       45,
  barcelona:  40,
  amsterdam:  50,
  praga:      30,  // barata
  lisboa:     35,
  viena:      45,
  londres:    65,  // muito alta
  berlim:     40,
  madri:      40,
  atenas:     35,
  istambul:   25,  // muito barata
  budapeste:  30,
  florenca:   45,
  edimburgo:  50,
  copenhague: 70   // muito alta (mais cara da lista)
}

// Coordenadas geográficas (latitude, longitude) de cada cidade.
// Usadas no mapa interativo do roteiro (Leaflet/OpenStreetMap).
const COORDS = {
  paris:      [48.8566,  2.3522],
  roma:       [41.9028, 12.4964],
  barcelona:  [41.3851,  2.1734],
  amsterdam:  [52.3676,  4.9041],
  praga:      [50.0755, 14.4378],
  lisboa:     [38.7223, -9.1393],
  viena:      [48.2082, 16.3738],
  londres:    [51.5074, -0.1278],
  berlim:     [52.5200, 13.4050],
  madri:      [40.4168, -3.7038],
  atenas:     [37.9838, 23.7275],
  istambul:   [41.0082, 28.9784],
  budapeste:  [47.4979, 19.0402],
  florenca:   [43.7696, 11.2558],
  edimburgo:  [55.9533, -3.1883],
  copenhague: [55.6761, 12.5683]
}

// Slug do artigo na Wikipedia EN para cada cidade (usado em buscarImagemWiki)
const WIKI_CIDADE = {
  paris: 'Paris',
  roma: 'Rome',
  barcelona: 'Barcelona',
  amsterdam: 'Amsterdam',
  praga: 'Prague',
  lisboa: 'Lisbon',
  viena: 'Vienna',
  londres: 'London',
  berlim: 'Berlin',
  madri: 'Madrid',
  atenas: 'Athens',
  istambul: 'Istanbul',
  budapeste: 'Budapest',
  florenca: 'Florence',
  edimburgo: 'Edinburgh',
  copenhague: 'Copenhagen'
}

// Slug do artigo na Wikipedia EN para cada atração (chave = id da atração).
// Usado APENAS para texto (popup do mapa, expander "Sobre na Wikipedia").
// Imagem da atração vem 100% de arquivo local — ver IMAGENS_ATRACAO.
// Slugs com underscore exato — testados em https://en.wikipedia.org/wiki/<slug>.
const WIKI_ATRACAO = {
  // Paris
  'paris-eiffel': 'Eiffel_Tower',
  'paris-louvre': 'Louvre',
  'paris-notre-dame': 'Notre-Dame_de_Paris',
  'paris-montmartre': 'Sacré-Cœur,_Paris',
  'paris-versailles': 'Palace_of_Versailles',
  // Roma
  'roma-coliseu': 'Colosseum',
  'roma-vaticano': 'Sistine_Chapel',
  'roma-trevi': 'Trevi_Fountain',
  'roma-pantheon': 'Pantheon,_Rome',
  'roma-trastevere': 'Trastevere',
  // Barcelona
  'barcelona-sagrada': 'Sagrada_Família',
  'barcelona-guell': 'Park_Güell',
  'barcelona-gotico': 'Gothic_Quarter,_Barcelona',
  'barcelona-casa-batllo': 'Casa_Batlló',
  'barcelona-barceloneta': 'La_Barceloneta',
  // Amsterdam
  'amsterdam-canais': 'Canals_of_Amsterdam',
  'amsterdam-vangogh': 'Van_Gogh_Museum',
  'amsterdam-anne': 'Anne_Frank_House',
  'amsterdam-rijks': 'Rijksmuseum',
  'amsterdam-jordaan': 'Jordaan',
  // Praga
  'praga-castelo': 'Prague_Castle',
  'praga-carlos': 'Charles_Bridge',
  'praga-relogio': 'Prague_astronomical_clock',
  'praga-cerveja': 'Pilsner_Urquell_Brewery',
  'praga-judaico': 'Old_New_Synagogue',
  // Lisboa
  'lisboa-belem': 'Belém_Tower',
  'lisboa-castelo': 'São_Jorge_Castle',
  'lisboa-alfama': 'Alfama',
  'lisboa-sintra': 'Pena_Palace',
  'lisboa-bondinho': 'Tram_28_(Lisbon)',
  // Viena
  'viena-schonbrunn': 'Schönbrunn_Palace',
  'viena-stephans': "St._Stephen's_Cathedral,_Vienna",
  'viena-belvedere': 'Belvedere,_Vienna',
  'viena-opera': 'Vienna_State_Opera',
  'viena-cafes': 'Café_Central_(Vienna)',
  // Londres
  'londres-bigben': 'Big_Ben',
  'londres-british': 'British_Museum',
  'londres-tower': 'Tower_of_London',
  'londres-camden': 'Camden_Market',
  'londres-eye': 'London_Eye',
  // Berlim
  'berlim-brandemburgo': 'Brandenburg_Gate',
  'berlim-muro': 'East_Side_Gallery',
  'berlim-pergamon': 'Museum_Island',
  'berlim-reichstag': 'Reichstag_building',
  'berlim-kreuzberg': 'Kreuzberg',
  // Madri
  'madri-prado': 'Museo_del_Prado',
  'madri-palacio': 'Royal_Palace_of_Madrid',
  'madri-retiro': 'Buen_Retiro_Park',
  'madri-tapas': 'La_Latina,_Madrid',
  'madri-flamenco': 'Flamenco',
  // Atenas
  'atenas-acropole': 'Parthenon',
  'atenas-museu': 'National_Archaeological_Museum,_Athens',
  'atenas-plaka': 'Plaka',
  'atenas-sounion': 'Cape_Sounion',
  'atenas-comida': 'Greek_cuisine',
  // Istambul
  'istambul-hagia': 'Hagia_Sophia',
  'istambul-mesquita': 'Sultan_Ahmed_Mosque',
  'istambul-topkapi': 'Topkapı_Palace',
  'istambul-bazar': 'Grand_Bazaar,_Istanbul',
  'istambul-bosforo': 'Bosporus',
  // Budapeste
  'budapeste-parlamento': 'Hungarian_Parliament_Building',
  'budapeste-bastiao': "Fisherman's_Bastion",
  'budapeste-termas': 'Széchenyi_thermal_bath',
  'budapeste-ruin': 'Szimpla_Kert',
  'budapeste-cruzeiro': 'Danube',
  // Florença
  'florenca-duomo': 'Florence_Cathedral',
  'florenca-uffizi': 'Uffizi',
  'florenca-david': 'David_(Michelangelo)',
  'florenca-vecchio': 'Ponte_Vecchio',
  'florenca-toscana': 'Tuscany',
  // Edimburgo
  'edimburgo-castelo': 'Edinburgh_Castle',
  'edimburgo-royalmile': 'Royal_Mile',
  'edimburgo-arthur': "Arthur's_Seat",
  'edimburgo-fantasmas': 'Edinburgh_Vaults',
  'edimburgo-whisky': 'Scotch_whisky',
  // Copenhague
  'copenhague-nyhavn': 'Nyhavn',
  'copenhague-sereia': 'The_Little_Mermaid_(statue)',
  'copenhague-tivoli': 'Tivoli_Gardens',
  'copenhague-christiania': 'Freetown_Christiania',
  'copenhague-canais': 'Cycling_in_Copenhagen'
}

export const cidades = [
  {
    slug: 'paris',
    nome: 'Paris',
    pais: 'França',
    bandeira: '🇫🇷',
    imagens: [],
    descricao:
      'A Cidade Luz combina arte, gastronomia e romance. Caminhe pelas margens do Sena, perca-se em Montmartre e descubra por que Paris encanta gerações de viajantes.',
    destaques: ['Torre Eiffel', 'Museu do Louvre', 'Notre-Dame', 'Montmartre'],
    custoMedioDia: 80,
    atracoes: [
      {
        id: 'paris-eiffel',
        nome: 'Torre Eiffel',
        imagens: aimg('1543349689-9a4d426bee8e', 'paris'),
        preco: 28, duracao: '2-3 horas', categoria: 'Monumento',
        descricao: 'Símbolo eterno de Paris com vistas panorâmicas inesquecíveis dos três níveis de observação.'
      },
      {
        id: 'paris-louvre',
        nome: 'Museu do Louvre',
        imagens: aimg('1565099824688-e93eb20fe622', 'paris'),
        preco: 22, duracao: '4-5 horas', categoria: 'Museu',
        descricao: 'O maior museu de arte do mundo, lar da Mona Lisa e de obras-primas que atravessam séculos.'
      },
      {
        id: 'paris-notre-dame',
        nome: 'Notre-Dame e Île de la Cité',
        imagens: aimg('1550340499-a6c60fc8287c', 'paris'),
        preco: 0, duracao: '1-2 horas', categoria: 'Histórico',
        descricao: 'Caminhada pela ilha histórica do coração de Paris, com visita externa à icônica catedral gótica.'
      },
      {
        id: 'paris-montmartre',
        nome: 'Montmartre e Sacré-Cœur',
        imagens: aimg('1431274172761-fca41d930114', 'paris'),
        preco: 0, duracao: '3 horas', categoria: 'Bairro',
        descricao: 'O bairro boêmio dos artistas, com ruelas charmosas e a vista mais bonita da cidade.'
      },
      {
        id: 'paris-versailles',
        nome: 'Palácio de Versalhes',
        imagens: aimg('1591289009723-aef022f8a1c4', 'paris'),
        preco: 32, duracao: 'Dia inteiro', categoria: 'Histórico',
        descricao: 'A residência dos reis franceses com salões dourados, jardins simétricos e o Salão dos Espelhos.'
      }
    ],
    hospedagens: [
      { id: 'paris-h1', nome: 'Le Marais Boutique Hotel', imagens: himg('medio', 'paris'), precoNoite: 180, avaliacao: 4.6, tipo: 'Hotel', bairro: 'Le Marais', comodidades: ['Wi-Fi', 'Café da manhã', 'Ar-condicionado'] },
      { id: 'paris-h2', nome: 'Saint-Germain Charme Apartments', imagens: himg('apartamento', 'paris'), precoNoite: 145, avaliacao: 4.4, tipo: 'Apartamento', bairro: 'Saint-Germain', comodidades: ['Cozinha', 'Wi-Fi', 'Máquina de lavar'] },
      { id: 'paris-h3', nome: 'Generator Paris Hostel', imagens: himg('hostel', 'paris'), precoNoite: 48, avaliacao: 4.2, tipo: 'Hostel', bairro: '10ème Arrondissement', comodidades: ['Wi-Fi', 'Bar', 'Lavanderia'] },
      { id: 'paris-h4', nome: 'Hôtel de Crillon Luxury', imagens: himg('luxo', 'paris'), precoNoite: 420, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Place de la Concorde', comodidades: ['Spa', 'Restaurante estrelado', 'Concierge 24h'] }
    ]
  },
  {
    slug: 'roma',
    nome: 'Roma',
    pais: 'Itália',
    bandeira: '🇮🇹',
    imagens: [],
    descricao:
      'A Cidade Eterna é um museu a céu aberto. Gladiadores, papas e imperadores deixaram marcas em cada esquina, entre cafés, gelaterias e piazzas iluminadas.',
    destaques: ['Coliseu', 'Vaticano', 'Fontana di Trevi', 'Pantheon'],
    custoMedioDia: 70,
    atracoes: [
      { id: 'roma-coliseu', nome: 'Coliseu e Fórum Romano', imagens: aimg('1552832230-c0197dd311b5', 'roma'), preco: 24, duracao: '4 horas', categoria: 'Histórico', descricao: 'O anfiteatro mais famoso do mundo e o coração político da Roma Antiga em uma única visita.' },
      { id: 'roma-vaticano', nome: 'Museus Vaticanos e Capela Sistina', imagens: aimg('1531572753322-ad063cecc140', 'roma'), preco: 30, duracao: '4-5 horas', categoria: 'Museu', descricao: 'Tesouros papais em galerias intermináveis até chegar ao teto pintado por Michelangelo.' },
      { id: 'roma-trevi', nome: 'Fontana di Trevi', imagens: aimg('1525874684015-58379d421a52', 'roma'), preco: 0, duracao: '30 minutos', categoria: 'Monumento', descricao: 'Jogue uma moeda e garanta sua volta a Roma diante da fonte barroca mais famosa do mundo.' },
      { id: 'roma-pantheon', nome: 'Pantheon e Piazza Navona', imagens: aimg('1539037116277-4db20889f2d4', 'roma'), preco: 5, duracao: '2 horas', categoria: 'Histórico', descricao: 'Templo romano perfeitamente preservado e a praça barroca com fontes de Bernini.' },
      { id: 'roma-trastevere', nome: 'Tour Gastronômico em Trastevere', imagens: aimg('1467003909585-2f8a72700288', 'roma'), preco: 65, duracao: '3 horas', categoria: 'Gastronomia', descricao: 'Caminhada por trattorias autênticas com degustação de cacio e pepe, suppli e vinhos locais.' }
    ],
    hospedagens: [
      { id: 'roma-h1', nome: 'Hotel Artemide', imagens: himg('medio', 'roma'), precoNoite: 165, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Via Nazionale', comodidades: ['Spa', 'Café da manhã', 'Wi-Fi'] },
      { id: 'roma-h2', nome: 'Trastevere Stylish Apartment', imagens: himg('apartamento', 'roma'), precoNoite: 110, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Trastevere', comodidades: ['Cozinha', 'Wi-Fi', 'Varanda'] },
      { id: 'roma-h3', nome: 'The Beehive Hostel', imagens: himg('hostel', 'roma'), precoNoite: 38, avaliacao: 4.3, tipo: 'Hostel', bairro: 'Termini', comodidades: ['Café da manhã vegano', 'Wi-Fi', 'Jardim'] },
      { id: 'roma-h4', nome: 'Hassler Roma', imagens: himg('luxo', 'roma'), precoNoite: 380, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Piazza di Spagna', comodidades: ['Vista da cidade', 'Restaurante estrelado', 'Spa'] }
    ]
  },
  {
    slug: 'barcelona',
    nome: 'Barcelona',
    pais: 'Espanha',
    bandeira: '🇪🇸',
    imagens: [],
    descricao:
      'A capital catalã mistura praia, modernismo e tapas em proporções perfeitas. Caminhe por Las Ramblas e descubra a genialidade arquitetônica de Gaudí.',
    destaques: ['Sagrada Família', 'Park Güell', 'Las Ramblas', 'Bairro Gótico'],
    custoMedioDia: 60,
    atracoes: [
      { id: 'barcelona-sagrada', nome: 'Sagrada Família', imagens: aimg('1583422409516-2895a77efded', 'barcelona'), preco: 26, duracao: '2 horas', categoria: 'Monumento', descricao: 'A obra-prima inacabada de Gaudí, com vitrais que transformam a luz em pura emoção.' },
      { id: 'barcelona-guell', nome: 'Park Güell', imagens: aimg('1539037116277-4db20889f2d4', 'barcelona'), preco: 18, duracao: '2-3 horas', categoria: 'Parque', descricao: 'Mosaicos coloridos e formas orgânicas em um parque que parece um conto de fadas urbano.' },
      { id: 'barcelona-gotico', nome: 'Bairro Gótico', imagens: aimg('1464790719320-516ecd75af6c', 'barcelona'), preco: 0, duracao: '3 horas', categoria: 'Bairro', descricao: 'Ruelas medievais, praças escondidas e a Catedral de Barcelona em um labirinto histórico.' },
      { id: 'barcelona-casa-batllo', nome: 'Casa Batlló', imagens: aimg('1551867633-194f125bdde0', 'barcelona'), preco: 35, duracao: '1.5 horas', categoria: 'Monumento', descricao: 'A casa mais excêntrica do Passeig de Gràcia, com fachada em forma de dragão escamado.' },
      { id: 'barcelona-barceloneta', nome: 'Praia de Barceloneta', imagens: aimg('1492571350019-22de08371fd3', 'barcelona'), preco: 0, duracao: '2-4 horas', categoria: 'Praia', descricao: 'Areia mediterrânea, chiringuitos e a melhor paella à beira-mar da cidade.' }
    ],
    hospedagens: [
      { id: 'barcelona-h1', nome: 'Hotel Casa Fuster', imagens: himg('medio', 'barcelona'), precoNoite: 220, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Passeig de Gràcia', comodidades: ['Rooftop', 'Piscina', 'Wi-Fi'] },
      { id: 'barcelona-h2', nome: 'Gòtic Boutique Apartment', imagens: himg('apartamento', 'barcelona'), precoNoite: 95, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Bairro Gótico', comodidades: ['Cozinha', 'Wi-Fi', 'Ar-condicionado'] },
      { id: 'barcelona-h3', nome: 'Kabul Party Hostel', imagens: himg('hostel', 'barcelona'), precoNoite: 32, avaliacao: 4.1, tipo: 'Hostel', bairro: 'Plaça Reial', comodidades: ['Bar', 'Wi-Fi', 'Tour grátis'] },
      { id: 'barcelona-h4', nome: 'W Barcelona', imagens: himg('luxo', 'barcelona'), precoNoite: 320, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Barceloneta', comodidades: ['Vista do mar', 'Spa', 'Piscina infinita'] }
    ]
  },
  {
    slug: 'amsterdam',
    nome: 'Amsterdam',
    pais: 'Holanda',
    bandeira: '🇳🇱',
    imagens: [],
    descricao:
      'A cidade dos canais pedala por suas próprias regras. Casas estreitas tortas, museus geniais e uma vida noturna eclética em meio a tulipas.',
    destaques: ['Canais', 'Museu Van Gogh', 'Casa de Anne Frank', 'Vondelpark'],
    custoMedioDia: 75,
    atracoes: [
      { id: 'amsterdam-canais', nome: 'Passeio de barco pelos Canais', imagens: aimg('1576924542622-772579f3c9bf', 'amsterdam'), preco: 22, duracao: '1 hora', categoria: 'Passeio', descricao: 'Veja a UNESCO de outra perspectiva navegando pelos famosos canais do século XVII.' },
      { id: 'amsterdam-vangogh', nome: 'Museu Van Gogh', imagens: aimg('1499856871958-5b9627545d1a', 'amsterdam'), preco: 22, duracao: '2-3 horas', categoria: 'Museu', descricao: 'A maior coleção do mundo das obras do mestre holandês, dos girassóis ao quarto em Arles.' },
      { id: 'amsterdam-anne', nome: 'Casa de Anne Frank', imagens: aimg('1591794665242-eaee93f4f31a', 'amsterdam'), preco: 16, duracao: '1.5 horas', categoria: 'Histórico', descricao: 'O esconderijo onde Anne escreveu seu diário, transformado em museu emocionante.' },
      { id: 'amsterdam-rijks', nome: 'Rijksmuseum', imagens: aimg('1565963571555-4ce0d3a5c5c4', 'amsterdam'), preco: 22, duracao: '3 horas', categoria: 'Museu', descricao: 'A "Ronda da Noite" de Rembrandt e a Era de Ouro holandesa em um dos maiores museus da Europa.' },
      { id: 'amsterdam-jordaan', nome: 'Bairro Jordaan e Vondelpark', imagens: aimg('1534351450181-ea9f78427fe8', 'amsterdam'), preco: 0, duracao: '4 horas', categoria: 'Bairro', descricao: 'O bairro mais charmoso da cidade e o pulmão verde de Amsterdam para um dia tranquilo.' }
    ],
    hospedagens: [
      { id: 'amsterdam-h1', nome: 'Pulitzer Amsterdam', imagens: himg('medio', 'amsterdam'), precoNoite: 240, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Prinsengracht', comodidades: ['Vista do canal', 'Restaurante', 'Wi-Fi'] },
      { id: 'amsterdam-h2', nome: 'Canal House Apartment', imagens: himg('apartamento', 'amsterdam'), precoNoite: 140, avaliacao: 4.4, tipo: 'Apartamento', bairro: 'Jordaan', comodidades: ['Cozinha', 'Vista do canal', 'Wi-Fi'] },
      { id: 'amsterdam-h3', nome: 'ClinkNOORD Hostel', imagens: himg('hostel', 'amsterdam'), precoNoite: 42, avaliacao: 4.2, tipo: 'Hostel', bairro: 'Amsterdam Noord', comodidades: ['Wi-Fi', 'Bar', 'Café da manhã'] },
      { id: 'amsterdam-h4', nome: 'Waldorf Astoria Amsterdam', imagens: himg('luxo', 'amsterdam'), precoNoite: 410, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Herengracht', comodidades: ['Spa', 'Restaurante estrelado', 'Concierge'] }
    ]
  },
  {
    slug: 'praga',
    nome: 'Praga',
    pais: 'República Tcheca',
    bandeira: '🇨🇿',
    imagens: [],
    descricao:
      'A cidade dos cem pináculos transporta o visitante para um conto de fadas medieval. Castelos, pontes e cervejarias a preços ainda generosos.',
    destaques: ['Castelo de Praga', 'Ponte Carlos', 'Praça Velha', 'Relógio Astronômico'],
    custoMedioDia: 45,
    atracoes: [
      { id: 'praga-castelo', nome: 'Castelo de Praga', imagens: aimg('1519677584237-752f8853252e', 'praga'), preco: 18, duracao: '3-4 horas', categoria: 'Histórico', descricao: 'O maior complexo de castelo do mundo, com a deslumbrante Catedral de São Vito.' },
      { id: 'praga-carlos', nome: 'Ponte Carlos', imagens: aimg('1519677100203-a0e668c92439', 'praga'), preco: 0, duracao: '1 hora', categoria: 'Monumento', descricao: 'Atravesse a ponte gótica adornada com 30 estátuas barrocas com vista da Cidade Velha.' },
      { id: 'praga-relogio', nome: 'Relógio Astronômico', imagens: aimg('1592906209472-a36b1f3782ef', 'praga'), preco: 0, duracao: '30 minutos', categoria: 'Monumento', descricao: 'Veja o desfile dos 12 apóstolos a cada hora cheia, um espetáculo medieval mantido desde 1410.' },
      { id: 'praga-cerveja', nome: 'Tour de Cervejarias Tradicionais', imagens: aimg('1518176258769-f227c798150e', 'praga'), preco: 35, duracao: '3 horas', categoria: 'Gastronomia', descricao: 'Conheça a cultura da Pilsner em cervejarias centenárias com degustações guiadas.' },
      { id: 'praga-judaico', nome: 'Bairro Judaico', imagens: aimg('1567696911980-2eed69a46042', 'praga'), preco: 14, duracao: '2 horas', categoria: 'Histórico', descricao: 'Sinagogas centenárias e o Cemitério Judaico Antigo contam séculos de história europeia.' }
    ],
    hospedagens: [
      { id: 'praga-h1', nome: 'Augustine Prague Hotel', imagens: himg('medio', 'praga'), precoNoite: 195, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Malá Strana', comodidades: ['Spa', 'Jardim', 'Wi-Fi'] },
      { id: 'praga-h2', nome: 'Old Town Charme Apartment', imagens: himg('apartamento', 'praga'), precoNoite: 75, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Staré Město', comodidades: ['Cozinha', 'Wi-Fi', 'Próximo à Praça'] },
      { id: 'praga-h3', nome: 'Hostel One Home', imagens: himg('hostel', 'praga'), precoNoite: 22, avaliacao: 4.4, tipo: 'Hostel', bairro: 'Vinohrady', comodidades: ['Jantar grátis', 'Wi-Fi', 'Tour grátis'] },
      { id: 'praga-h4', nome: 'Four Seasons Prague', imagens: himg('luxo', 'praga'), precoNoite: 360, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Margem do Vltava', comodidades: ['Vista do castelo', 'Restaurante', 'Spa'] }
    ]
  },
  {
    slug: 'lisboa',
    nome: 'Lisboa',
    pais: 'Portugal',
    bandeira: '🇵🇹',
    imagens: [],
    descricao:
      'A capital portuguesa é luz, fado e azulejos sobre sete colinas. Pasteis de Belém, bondinhos amarelos e mirantes com vista para o Tejo.',
    destaques: ['Torre de Belém', 'Bairro Alto', 'Castelo de São Jorge', 'Sintra'],
    custoMedioDia: 55,
    atracoes: [
      { id: 'lisboa-belem', nome: 'Torre de Belém e Mosteiro dos Jerónimos', imagens: aimg('1525207934022-21e0bcdcd80d', 'lisboa'), preco: 16, duracao: '3 horas', categoria: 'Histórico', descricao: 'Joias do estilo manuelino que celebram a Era dos Descobrimentos. Não esqueça os pastéis!' },
      { id: 'lisboa-castelo', nome: 'Castelo de São Jorge', imagens: aimg('1582719478250-c89cae4dc85b', 'lisboa'), preco: 15, duracao: '2 horas', categoria: 'Histórico', descricao: 'Fortaleza moura com a vista mais privilegiada da cidade e dos sete morros lisboetas.' },
      { id: 'lisboa-alfama', nome: 'Alfama e Tour de Fado', imagens: aimg('1558961363-fa8fdf82db35', 'lisboa'), preco: 45, duracao: '3 horas', categoria: 'Cultural', descricao: 'Caminhe pelo bairro mais antigo e termine a noite ouvindo fado em uma casa tradicional.' },
      { id: 'lisboa-sintra', nome: 'Bate-volta a Sintra', imagens: aimg('1577005062466-b3ab17a16949', 'lisboa'), preco: 55, duracao: 'Dia inteiro', categoria: 'Passeio', descricao: 'Palácio da Pena, Quinta da Regaleira e Cabo da Roca em uma única excursão guiada.' },
      { id: 'lisboa-bondinho', nome: 'Bondinho 28 e Mirantes', imagens: aimg('1518560208933-c1d97d2dc6c7', 'lisboa'), preco: 3, duracao: '2 horas', categoria: 'Passeio', descricao: 'Suba e desça as colinas no clássico elétrico amarelo passando pelos pontos mais icônicos.' }
    ],
    hospedagens: [
      { id: 'lisboa-h1', nome: 'Memmo Alfama Hotel', imagens: himg('medio', 'lisboa'), precoNoite: 175, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Alfama', comodidades: ['Piscina com vista', 'Bar de vinhos', 'Wi-Fi'] },
      { id: 'lisboa-h2', nome: 'Chiado Charme Apartment', imagens: himg('apartamento', 'lisboa'), precoNoite: 90, avaliacao: 4.6, tipo: 'Apartamento', bairro: 'Chiado', comodidades: ['Cozinha', 'Varanda', 'Wi-Fi'] },
      { id: 'lisboa-h3', nome: 'Lisbon Destination Hostel', imagens: himg('hostel', 'lisboa'), precoNoite: 28, avaliacao: 4.4, tipo: 'Hostel', bairro: 'Rossio', comodidades: ['Café da manhã', 'Wi-Fi', 'Lounge'] },
      { id: 'lisboa-h4', nome: 'Bairro Alto Hotel', imagens: himg('luxo', 'lisboa'), precoNoite: 290, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Bairro Alto', comodidades: ['Rooftop', 'Spa', 'Restaurante'] }
    ]
  },
  {
    slug: 'viena',
    nome: 'Viena',
    pais: 'Áustria',
    bandeira: '🇦🇹',
    imagens: [],
    descricao:
      'A capital imperial da música e da elegância. Palácios habsburgos, cafés históricos com Sachertorte e ópera todas as noites.',
    destaques: ['Palácio Schönbrunn', 'Catedral de Santo Estêvão', 'Belvedere', 'Ringstrasse'],
    custoMedioDia: 75,
    atracoes: [
      { id: 'viena-schonbrunn', nome: 'Palácio de Schönbrunn', imagens: aimg('1516550893923-42d28e5677af', 'viena'), preco: 26, duracao: '4 horas', categoria: 'Histórico', descricao: 'A Versalhes austríaca, residência de verão dos Habsburgo com 1.441 cômodos e jardins.' },
      { id: 'viena-stephans', nome: 'Catedral de Santo Estêvão', imagens: aimg('1564506243793-87293ce75ab5', 'viena'), preco: 6, duracao: '1.5 horas', categoria: 'Monumento', descricao: 'O símbolo de Viena, com telhado de azulejos coloridos e vista panorâmica da torre sul.' },
      { id: 'viena-belvedere', nome: 'Palácio Belvedere e "O Beijo"', imagens: aimg('1581873372796-635b67ca2008', 'viena'), preco: 17, duracao: '2-3 horas', categoria: 'Museu', descricao: 'Veja "O Beijo" de Klimt e outras obras-primas em um palácio barroco com vistas magníficas.' },
      { id: 'viena-opera', nome: 'Noite na Ópera Estatal', imagens: aimg('1503095396549-807759245b35', 'viena'), preco: 90, duracao: '3 horas', categoria: 'Cultural', descricao: 'Uma das casas de ópera mais prestigiadas do mundo, com programação operística diária.' },
      { id: 'viena-cafes', nome: 'Tour dos Cafés Históricos', imagens: aimg('1495474472287-4d71bcdd2085', 'viena'), preco: 40, duracao: '2.5 horas', categoria: 'Gastronomia', descricao: 'Café Central, Sacher e Demel: a cultura cafeeira vienense é Patrimônio da Humanidade.' }
    ],
    hospedagens: [
      { id: 'viena-h1', nome: 'Hotel Sacher Wien', imagens: himg('luxo', 'viena'), precoNoite: 380, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Innere Stadt', comodidades: ['Spa', 'Café Sacher', 'Concierge'] },
      { id: 'viena-h2', nome: 'Hotel Topazz', imagens: himg('medio', 'viena'), precoNoite: 175, avaliacao: 4.6, tipo: 'Hotel', bairro: 'Centro Histórico', comodidades: ['Café da manhã', 'Bar', 'Wi-Fi'] },
      { id: 'viena-h3', nome: 'Vienna Stylish Apartment', imagens: himg('apartamento', 'viena'), precoNoite: 95, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Neubau', comodidades: ['Cozinha', 'Wi-Fi', 'Máquina de lavar'] },
      { id: 'viena-h4', nome: "Wombat's City Hostel", imagens: himg('hostel', 'viena'), precoNoite: 36, avaliacao: 4.3, tipo: 'Hostel', bairro: 'Naschmarkt', comodidades: ['Bar', 'Wi-Fi', 'Café da manhã'] }
    ]
  },
  {
    slug: 'londres',
    nome: 'Londres',
    pais: 'Reino Unido',
    bandeira: '🇬🇧',
    imagens: [],
    descricao:
      'Tradição e modernidade dividem o mesmo guarda-chuva. Pubs centenários, museus gratuitos e um skyline que muda a cada estação.',
    destaques: ['Big Ben', 'British Museum', 'Tower Bridge', 'Camden Market'],
    custoMedioDia: 95,
    atracoes: [
      { id: 'londres-bigben', nome: 'Big Ben e Westminster', imagens: aimg('1513635269975-59663e0ac1ad', 'londres'), preco: 0, duracao: '2 horas', categoria: 'Monumento', descricao: 'O cartão postal mais fotografado da cidade, ao lado da Abadia de Westminster e do Parlamento.' },
      { id: 'londres-british', nome: 'British Museum', imagens: aimg('1599992094479-13c8f0ed1f12', 'londres'), preco: 0, duracao: '4 horas', categoria: 'Museu', descricao: 'Da Pedra de Roseta às esculturas do Partenon, um dos maiores museus do mundo é gratuito.' },
      { id: 'londres-tower', nome: 'Tower of London e Tower Bridge', imagens: aimg('1486325212027-8081e485255e', 'londres'), preco: 35, duracao: '3-4 horas', categoria: 'Histórico', descricao: 'Veja as joias da coroa britânica e atravesse a ponte vitoriana mais famosa do mundo.' },
      { id: 'londres-camden', nome: 'Camden Market', imagens: aimg('1571679654681-ba01b9e1e117', 'londres'), preco: 0, duracao: '3 horas', categoria: 'Bairro', descricao: 'O mercado mais alternativo da cidade, com street food do mundo todo e moda independente.' },
      { id: 'londres-eye', nome: 'London Eye e Cruzeiro pelo Tâmisa', imagens: aimg('1486299267070-83823f5c2d3a', 'londres'), preco: 38, duracao: '2 horas', categoria: 'Passeio', descricao: 'Vista 360º do alto da roda gigante e cruzeiro panorâmico pelo coração de Londres.' }
    ],
    hospedagens: [
      { id: 'londres-h1', nome: 'The Ned London', imagens: himg('luxo', 'londres'), precoNoite: 320, avaliacao: 4.7, tipo: 'Hotel', bairro: 'City of London', comodidades: ['Rooftop', 'Spa', '8 restaurantes'] },
      { id: 'londres-h2', nome: 'Citadines Holborn', imagens: himg('medio', 'londres'), precoNoite: 175, avaliacao: 4.5, tipo: 'Hotel', bairro: 'Holborn', comodidades: ['Cozinha', 'Wi-Fi', 'Academia'] },
      { id: 'londres-h3', nome: 'Notting Hill Apartment', imagens: himg('apartamento', 'londres'), precoNoite: 130, avaliacao: 4.6, tipo: 'Apartamento', bairro: 'Notting Hill', comodidades: ['Cozinha', 'Wi-Fi', 'Aquecimento'] },
      { id: 'londres-h4', nome: 'YHA London Central', imagens: himg('hostel', 'londres'), precoNoite: 45, avaliacao: 4.2, tipo: 'Hostel', bairro: 'Marylebone', comodidades: ['Café da manhã', 'Wi-Fi', 'Cozinha'] }
    ]
  },
  {
    slug: 'berlim',
    nome: 'Berlim',
    pais: 'Alemanha',
    bandeira: '🇩🇪',
    imagens: [],
    descricao:
      'História recente, arte urbana e clubes que abrem no domingo de manhã. Uma cidade em reinvenção constante onde o passado nunca está longe.',
    destaques: ['Portão de Brandemburgo', 'Muro de Berlim', 'Museu Pergamon', 'Reichstag'],
    custoMedioDia: 60,
    atracoes: [
      { id: 'berlim-brandemburgo', nome: 'Portão de Brandemburgo', imagens: aimg('1560969184-10fe8719e047', 'berlim'), preco: 0, duracao: '1 hora', categoria: 'Monumento', descricao: 'Símbolo da reunificação alemã e ponto de partida para entender a história moderna da cidade.' },
      { id: 'berlim-muro', nome: 'East Side Gallery e Muro de Berlim', imagens: aimg('1587330979470-3016b6702d89', 'berlim'), preco: 0, duracao: '2 horas', categoria: 'Histórico', descricao: '1,3 km do antigo muro transformados na maior galeria de arte ao ar livre do mundo.' },
      { id: 'berlim-pergamon', nome: 'Ilha dos Museus', imagens: aimg('1599992094479-13c8f0ed1f12', 'berlim'), preco: 19, duracao: '3-4 horas', categoria: 'Museu', descricao: 'Cinco museus de classe mundial em uma única ilha do rio Spree, Patrimônio da Humanidade.' },
      { id: 'berlim-reichstag', nome: 'Reichstag e cúpula de vidro', imagens: aimg('1597100174833-fa1ce5076a87', 'berlim'), preco: 0, duracao: '1.5 horas', categoria: 'Histórico', descricao: 'Suba à cúpula projetada por Norman Foster com vistas 360º do parlamento alemão (gratuito com reserva).' },
      { id: 'berlim-kreuzberg', nome: 'Tour gastronômico em Kreuzberg', imagens: aimg('1467003909585-2f8a72700288', 'berlim'), preco: 50, duracao: '3 horas', categoria: 'Gastronomia', descricao: 'Currywurst, döner, mercado turco e cervejas artesanais no bairro mais multicultural da cidade.' }
    ],
    hospedagens: [
      { id: 'berlim-h1', nome: 'Hotel Adlon Kempinski', imagens: himg('luxo', 'berlim'), precoNoite: 350, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Mitte', comodidades: ['Spa', 'Vista do portão', 'Restaurante estrelado'] },
      { id: 'berlim-h2', nome: '25hours Hotel Bikini', imagens: himg('medio', 'berlim'), precoNoite: 165, avaliacao: 4.6, tipo: 'Hotel', bairro: 'Charlottenburg', comodidades: ['Vista do zoo', 'Sauna', 'Bar'] },
      { id: 'berlim-h3', nome: 'Kreuzberg Loft Apartment', imagens: himg('apartamento', 'berlim'), precoNoite: 80, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Kreuzberg', comodidades: ['Cozinha', 'Wi-Fi', 'Bicicleta'] },
      { id: 'berlim-h4', nome: 'Generator Berlin Mitte', imagens: himg('hostel', 'berlim'), precoNoite: 30, avaliacao: 4.3, tipo: 'Hostel', bairro: 'Mitte', comodidades: ['Bar', 'Wi-Fi', 'Eventos'] }
    ]
  },
  {
    slug: 'madri',
    nome: 'Madri',
    pais: 'Espanha',
    bandeira: '🇪🇸',
    imagens: [],
    descricao:
      'A capital espanhola que nunca dorme. Tapas até o amanhecer, museus de classe mundial e o melhor parque urbano da Europa.',
    destaques: ['Museu do Prado', 'Palácio Real', 'Parque Retiro', 'Plaza Mayor'],
    custoMedioDia: 65,
    atracoes: [
      { id: 'madri-prado', nome: 'Museu do Prado', imagens: aimg('1543783207-ec64e4d95325', 'madri'), preco: 15, duracao: '3-4 horas', categoria: 'Museu', descricao: 'Velázquez, Goya e El Greco em um dos museus de pintura mais importantes do mundo.' },
      { id: 'madri-palacio', nome: 'Palácio Real', imagens: aimg('1591794665242-eaee93f4f31a', 'madri'), preco: 14, duracao: '2-3 horas', categoria: 'Histórico', descricao: 'O maior palácio real ainda em funcionamento na Europa Ocidental, com 3.418 cômodos.' },
      { id: 'madri-retiro', nome: 'Parque do Retiro', imagens: aimg('1574169208507-84376144848b', 'madri'), preco: 0, duracao: '2-3 horas', categoria: 'Parque', descricao: 'O pulmão verde de Madri, com lago para passeios de barco e o Palácio de Cristal.' },
      { id: 'madri-tapas', nome: 'Tour de Tapas em La Latina', imagens: aimg('1467003909585-2f8a72700288', 'madri'), preco: 60, duracao: '3.5 horas', categoria: 'Gastronomia', descricao: 'Tortilla, jamón ibérico e vermute em bares centenários no bairro mais autêntico da cidade.' },
      { id: 'madri-flamenco', nome: 'Show de Flamenco Autêntico', imagens: aimg('1503095396549-807759245b35', 'madri'), preco: 50, duracao: '1.5 horas', categoria: 'Cultural', descricao: 'Sinta a paixão andaluza em um tablao tradicional com tapas e bebidas inclusas.' }
    ],
    hospedagens: [
      { id: 'madri-h1', nome: 'Four Seasons Madrid', imagens: himg('luxo', 'madri'), precoNoite: 410, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Centro', comodidades: ['Rooftop', 'Spa', 'Piscina'] },
      { id: 'madri-h2', nome: 'Only YOU Boutique Hotel', imagens: himg('medio', 'madri'), precoNoite: 175, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Chueca', comodidades: ['Café da manhã', 'Bar', 'Wi-Fi'] },
      { id: 'madri-h3', nome: 'Malasaña Cool Apartment', imagens: himg('apartamento', 'madri'), precoNoite: 85, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Malasaña', comodidades: ['Cozinha', 'Wi-Fi', 'Varanda'] },
      { id: 'madri-h4', nome: 'TOC Hostel Madrid', imagens: himg('hostel', 'madri'), precoNoite: 32, avaliacao: 4.3, tipo: 'Hostel', bairro: 'Sol', comodidades: ['Wi-Fi', 'Bar', 'Lavanderia'] }
    ]
  },
  {
    slug: 'atenas',
    nome: 'Atenas',
    pais: 'Grécia',
    bandeira: '🇬🇷',
    imagens: [],
    descricao:
      'O berço da democracia e da filosofia ocidental. Templos de mármore branco contrastam com o caos delicioso de uma capital mediterrânea.',
    destaques: ['Acrópole', 'Plaka', 'Museu Arqueológico', 'Cabo Sounion'],
    custoMedioDia: 55,
    atracoes: [
      { id: 'atenas-acropole', nome: 'Acrópole e Partenon', imagens: aimg('1555993539-1732b0258235', 'atenas'), preco: 20, duracao: '3 horas', categoria: 'Histórico', descricao: 'O templo mais famoso da Grécia Antiga sobre a colina sagrada com vista de toda a cidade.' },
      { id: 'atenas-museu', nome: 'Museu Arqueológico Nacional', imagens: aimg('1599992094479-13c8f0ed1f12', 'atenas'), preco: 12, duracao: '3 horas', categoria: 'Museu', descricao: 'A maior coleção de artefatos da Antiguidade grega, da Máscara de Agamenon ao Mecanismo de Antikythera.' },
      { id: 'atenas-plaka', nome: 'Plaka e Monastiraki', imagens: aimg('1530841344095-502fb33d97f2', 'atenas'), preco: 0, duracao: '3 horas', categoria: 'Bairro', descricao: 'Os bairros mais antigos da cidade, com tavernas, lojas de antiguidades e ruas de paralelepípedo.' },
      { id: 'atenas-sounion', nome: 'Bate-volta a Cabo Sounion', imagens: aimg('1602343984991-92d3e2f8b73c', 'atenas'), preco: 65, duracao: '6 horas', categoria: 'Passeio', descricao: 'Templo de Poseidon à beira-mar com o pôr-do-sol mais famoso da Grécia continental.' },
      { id: 'atenas-comida', nome: 'Tour de Comida Grega', imagens: aimg('1467003909585-2f8a72700288', 'atenas'), preco: 55, duracao: '3 horas', categoria: 'Gastronomia', descricao: 'Souvlaki, moussaka, gyros e ouzo em mercados e tavernas tradicionais.' }
    ],
    hospedagens: [
      { id: 'atenas-h1', nome: 'Hotel Grande Bretagne', imagens: himg('luxo', 'atenas'), precoNoite: 380, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Syntagma', comodidades: ['Vista da Acrópole', 'Spa', 'Rooftop'] },
      { id: 'atenas-h2', nome: 'Plaka Boutique Hotel', imagens: himg('medio', 'atenas'), precoNoite: 130, avaliacao: 4.6, tipo: 'Hotel', bairro: 'Plaka', comodidades: ['Café da manhã', 'Terraço', 'Wi-Fi'] },
      { id: 'atenas-h3', nome: 'Acropolis View Apartment', imagens: himg('apartamento', 'atenas'), precoNoite: 75, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Koukaki', comodidades: ['Cozinha', 'Vista', 'Wi-Fi'] },
      { id: 'atenas-h4', nome: 'City Circus Athens', imagens: himg('hostel', 'atenas'), precoNoite: 28, avaliacao: 4.5, tipo: 'Hostel', bairro: 'Psirri', comodidades: ['Café da manhã', 'Wi-Fi', 'Bar'] }
    ]
  },
  {
    slug: 'istambul',
    nome: 'Istambul',
    pais: 'Turquia',
    bandeira: '🇹🇷',
    imagens: [],
    descricao:
      'A única cidade construída em dois continentes. Mesquitas, bazares e o Bósforo separando culturas, religiões e épocas.',
    destaques: ['Hagia Sophia', 'Mesquita Azul', 'Grande Bazar', 'Bósforo'],
    custoMedioDia: 40,
    atracoes: [
      { id: 'istambul-hagia', nome: 'Hagia Sophia', imagens: aimg('1524231757912-21f4fe3a7200', 'istambul'), preco: 25, duracao: '2 horas', categoria: 'Histórico', descricao: 'O monumento mais importante da cidade, basílica bizantina e mesquita otomana em uma só.' },
      { id: 'istambul-mesquita', nome: 'Mesquita Azul', imagens: aimg('1602152915003-e8c9a5b2da18', 'istambul'), preco: 0, duracao: '1 hora', categoria: 'Monumento', descricao: 'Famosa pelos 20 mil azulejos de İznik que dão à mesquita seu apelido carinhoso.' },
      { id: 'istambul-topkapi', nome: 'Palácio de Topkapı', imagens: aimg('1567552451533-c2eb18acd0a5', 'istambul'), preco: 30, duracao: '3 horas', categoria: 'Histórico', descricao: 'Residência dos sultões otomanos por 400 anos, com tesouros, harém e jardins suspensos.' },
      { id: 'istambul-bazar', nome: 'Grande Bazar e Bazar das Especiarias', imagens: aimg('1571679654681-ba01b9e1e117', 'istambul'), preco: 0, duracao: '3 horas', categoria: 'Cultural', descricao: 'Mais de 4 mil lojas em um dos mercados cobertos mais antigos e maiores do mundo.' },
      { id: 'istambul-bosforo', nome: 'Cruzeiro pelo Bósforo', imagens: aimg('1531574744066-0c3f15c19e54', 'istambul'), preco: 30, duracao: '2.5 horas', categoria: 'Passeio', descricao: 'Navegue entre Europa e Ásia avistando palácios, fortalezas e mansões otomanas.' }
    ],
    hospedagens: [
      { id: 'istambul-h1', nome: 'Çırağan Palace Kempinski', imagens: himg('luxo', 'istambul'), precoNoite: 420, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Beşiktaş', comodidades: ['Vista do Bósforo', 'Spa', 'Piscina'] },
      { id: 'istambul-h2', nome: 'Hotel Empress Zoe', imagens: himg('medio', 'istambul'), precoNoite: 110, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Sultanahmet', comodidades: ['Café da manhã', 'Jardim', 'Wi-Fi'] },
      { id: 'istambul-h3', nome: 'Galata View Apartment', imagens: himg('apartamento', 'istambul'), precoNoite: 65, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Galata', comodidades: ['Cozinha', 'Vista da torre', 'Wi-Fi'] },
      { id: 'istambul-h4', nome: 'Cheers Hostel', imagens: himg('hostel', 'istambul'), precoNoite: 18, avaliacao: 4.4, tipo: 'Hostel', bairro: 'Sultanahmet', comodidades: ['Rooftop', 'Café da manhã', 'Wi-Fi'] }
    ]
  },
  {
    slug: 'budapeste',
    nome: 'Budapeste',
    pais: 'Hungria',
    bandeira: '🇭🇺',
    imagens: [],
    descricao:
      'Buda e Peste, separadas pelo Danúbio e unidas por pontes que iluminam a noite. Termas otomanas, ruin bars e goulash em fogo lento.',
    destaques: ['Parlamento', 'Bastião dos Pescadores', 'Termas Széchenyi', 'Ruin Bars'],
    custoMedioDia: 50,
    atracoes: [
      { id: 'budapeste-parlamento', nome: 'Parlamento Húngaro', imagens: aimg('1549893072-4bc678117f45', 'budapeste'), preco: 22, duracao: '2 horas', categoria: 'Monumento', descricao: 'O terceiro maior parlamento do mundo, neogótico, ainda mais espetacular iluminado à noite.' },
      { id: 'budapeste-bastiao', nome: 'Castelo de Buda e Bastião dos Pescadores', imagens: aimg('1551867633-194f125bdde0', 'budapeste'), preco: 12, duracao: '3 horas', categoria: 'Histórico', descricao: 'Vista panorâmica de toda Peste a partir do alto da colina histórica de Buda.' },
      { id: 'budapeste-termas', nome: 'Termas Széchenyi', imagens: aimg('1559339352-11d035aa65de', 'budapeste'), preco: 28, duracao: '3 horas', categoria: 'Bem-estar', descricao: 'O maior complexo termal da Europa, com 18 piscinas em um palácio amarelo neobarroco.' },
      { id: 'budapeste-ruin', nome: 'Tour pelos Ruin Bars', imagens: aimg('1518176258769-f227c798150e', 'budapeste'), preco: 35, duracao: '3 horas', categoria: 'Cultural', descricao: 'Bares montados em prédios abandonados do bairro judeu, símbolo da boemia local.' },
      { id: 'budapeste-cruzeiro', nome: 'Cruzeiro Noturno pelo Danúbio', imagens: aimg('1531574744066-0c3f15c19e54', 'budapeste'), preco: 25, duracao: '1.5 hora', categoria: 'Passeio', descricao: 'Veja o Parlamento e a Ponte das Correntes iluminados durante um jantar a bordo.' }
    ],
    hospedagens: [
      { id: 'budapeste-h1', nome: 'Four Seasons Gresham Palace', imagens: himg('luxo', 'budapeste'), precoNoite: 390, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Belváros', comodidades: ['Vista do Danúbio', 'Spa', 'Restaurante'] },
      { id: 'budapeste-h2', nome: 'Hotel Rum Budapest', imagens: himg('medio', 'budapeste'), precoNoite: 130, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Centro', comodidades: ['Rooftop', 'Café da manhã', 'Bar'] },
      { id: 'budapeste-h3', nome: 'District 7 Apartment', imagens: himg('apartamento', 'budapeste'), precoNoite: 60, avaliacao: 4.5, tipo: 'Apartamento', bairro: 'Bairro Judeu', comodidades: ['Cozinha', 'Wi-Fi', 'Próximo aos ruin bars'] },
      { id: 'budapeste-h4', nome: 'Maverick City Lodge', imagens: himg('hostel', 'budapeste'), precoNoite: 22, avaliacao: 4.4, tipo: 'Hostel', bairro: 'Bairro Judeu', comodidades: ['Wi-Fi', 'Bar', 'Café da manhã'] }
    ]
  },
  {
    slug: 'florenca',
    nome: 'Florença',
    pais: 'Itália',
    bandeira: '🇮🇹',
    imagens: [],
    descricao:
      'O berço do Renascimento, onde Michelangelo, Botticelli e Leonardo deixaram suas marcas. Toscana à mesa, mármore nas igrejas e couro no mercado.',
    destaques: ['Duomo', 'Galeria Uffizi', 'Ponte Vecchio', 'David de Michelangelo'],
    custoMedioDia: 70,
    atracoes: [
      { id: 'florenca-duomo', nome: 'Duomo de Florença', imagens: aimg('1543429776-2782fc8e1acd', 'florenca'), preco: 20, duracao: '2 horas', categoria: 'Monumento', descricao: 'A icônica cúpula de Brunelleschi e o batistério com as Portas do Paraíso de Ghiberti.' },
      { id: 'florenca-uffizi', nome: 'Galeria Uffizi', imagens: aimg('1565099824688-e93eb20fe622', 'florenca'), preco: 26, duracao: '3-4 horas', categoria: 'Museu', descricao: '"O Nascimento de Vênus" de Botticelli e a maior coleção de arte renascentista do mundo.' },
      { id: 'florenca-david', nome: "Galleria dell'Accademia (David)", imagens: aimg('1531572753322-ad063cecc140', 'florenca'), preco: 16, duracao: '1.5 hora', categoria: 'Museu', descricao: 'O David original de Michelangelo, escultura de 5 metros que define a perfeição clássica.' },
      { id: 'florenca-vecchio', nome: 'Ponte Vecchio e Oltrarno', imagens: aimg('1533929736458-ca588d08c8be', 'florenca'), preco: 0, duracao: '2 horas', categoria: 'Bairro', descricao: 'A ponte mais famosa da cidade, com joalherias seculares, e o lado mais autêntico de Florença.' },
      { id: 'florenca-toscana', nome: 'Tour de Vinhos pela Toscana', imagens: aimg('1467003909585-2f8a72700288', 'florenca'), preco: 95, duracao: 'Dia inteiro', categoria: 'Gastronomia', descricao: 'Chianti, San Gimignano e Siena com degustação em vinícolas centenárias.' }
    ],
    hospedagens: [
      { id: 'florenca-h1', nome: 'Four Seasons Firenze', imagens: himg('luxo', 'florenca'), precoNoite: 460, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Centro Storico', comodidades: ['Spa', 'Jardim renascentista', 'Piscina'] },
      { id: 'florenca-h2', nome: 'Hotel Lungarno', imagens: himg('medio', 'florenca'), precoNoite: 220, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Oltrarno', comodidades: ['Vista do Arno', 'Café da manhã', 'Wi-Fi'] },
      { id: 'florenca-h3', nome: 'Tuscany Style Apartment', imagens: himg('apartamento', 'florenca'), precoNoite: 105, avaliacao: 4.6, tipo: 'Apartamento', bairro: 'Santa Croce', comodidades: ['Cozinha', 'Varanda', 'Wi-Fi'] },
      { id: 'florenca-h4', nome: 'Plus Florence', imagens: himg('hostel', 'florenca'), precoNoite: 38, avaliacao: 4.3, tipo: 'Hostel', bairro: 'San Marco', comodidades: ['Piscina', 'Sauna', 'Wi-Fi'] }
    ]
  },
  {
    slug: 'edimburgo',
    nome: 'Edimburgo',
    pais: 'Escócia',
    bandeira: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    imagens: [],
    descricao:
      'Pedra escura, gaitas-de-fole e neblina sobre o castelo. A capital escocesa parece um cenário de Harry Potter — porque é.',
    destaques: ['Castelo de Edimburgo', 'Royal Mile', "Arthur's Seat", 'Old Town'],
    custoMedioDia: 70,
    atracoes: [
      { id: 'edimburgo-castelo', nome: 'Castelo de Edimburgo', imagens: aimg('1506377585622-bedcbb027afc', 'edimburgo'), preco: 22, duracao: '3 horas', categoria: 'Histórico', descricao: 'A fortaleza no topo de uma rocha vulcânica que domina a cidade há mais de 900 anos.' },
      { id: 'edimburgo-royalmile', nome: 'Royal Mile e Old Town', imagens: aimg('1564506243793-87293ce75ab5', 'edimburgo'), preco: 0, duracao: '3 horas', categoria: 'Bairro', descricao: 'A rua medieval que conecta o castelo ao palácio real, ladeada por closes (becos) misteriosos.' },
      { id: 'edimburgo-arthur', nome: "Trilha de Arthur's Seat", imagens: aimg('1530841344095-502fb33d97f2', 'edimburgo'), preco: 0, duracao: '3 horas', categoria: 'Natureza', descricao: 'Suba ao topo do antigo vulcão e tenha a melhor vista de Edimburgo e do Mar do Norte.' },
      { id: 'edimburgo-fantasmas', nome: 'Tour dos Fantasmas', imagens: aimg('1518176258769-f227c798150e', 'edimburgo'), preco: 28, duracao: '2 horas', categoria: 'Cultural', descricao: 'Subterrâneos, cemitérios e histórias macabras na cidade que inspirou Edgar Allan Poe e J.K. Rowling.' },
      { id: 'edimburgo-whisky', nome: 'Scotch Whisky Experience', imagens: aimg('1574913270497-e4ec0e35ab56', 'edimburgo'), preco: 45, duracao: '2 horas', categoria: 'Gastronomia', descricao: 'Aprenda sobre as cinco regiões produtoras com a maior coleção de whisky do mundo.' }
    ],
    hospedagens: [
      { id: 'edimburgo-h1', nome: 'The Balmoral Hotel', imagens: himg('luxo', 'edimburgo'), precoNoite: 380, avaliacao: 4.8, tipo: 'Hotel', bairro: 'Princes Street', comodidades: ['Spa', 'Restaurante estrelado', 'Concierge'] },
      { id: 'edimburgo-h2', nome: 'The Witchery by the Castle', imagens: himg('medio', 'edimburgo'), precoNoite: 290, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Royal Mile', comodidades: ['Decoração gótica', 'Restaurante', 'Wi-Fi'] },
      { id: 'edimburgo-h3', nome: 'Old Town Charme Apartment', imagens: himg('apartamento', 'edimburgo'), precoNoite: 110, avaliacao: 4.6, tipo: 'Apartamento', bairro: 'Old Town', comodidades: ['Cozinha', 'Vista do castelo', 'Wi-Fi'] },
      { id: 'edimburgo-h4', nome: 'Castle Rock Hostel', imagens: himg('hostel', 'edimburgo'), precoNoite: 30, avaliacao: 4.5, tipo: 'Hostel', bairro: 'Royal Mile', comodidades: ['Wi-Fi', 'Cozinha', 'Lounge'] }
    ]
  },
  {
    slug: 'copenhague',
    nome: 'Copenhague',
    pais: 'Dinamarca',
    bandeira: '🇩🇰',
    imagens: [],
    descricao:
      'Bicicletas, design escandinavo e hygge para todos os lados. A capital dinamarquesa é o exemplo perfeito de qualidade de vida nórdica.',
    destaques: ['Nyhavn', 'Pequena Sereia', 'Tivoli', 'Christiania'],
    custoMedioDia: 95,
    atracoes: [
      { id: 'copenhague-nyhavn', nome: 'Nyhavn', imagens: aimg('1513622470522-26c3c8a854bc', 'copenhague'), preco: 0, duracao: '2 horas', categoria: 'Bairro', descricao: 'O porto colorido do século XVII com casinhas alinhadas e barcos históricos atracados.' },
      { id: 'copenhague-sereia', nome: 'Pequena Sereia e Castelo Amalienborg', imagens: aimg('1593340405893-d75e74e6e5b6', 'copenhague'), preco: 0, duracao: '2 horas', categoria: 'Monumento', descricao: 'A estátua icônica de Andersen e o palácio real onde acontece a troca da guarda diariamente.' },
      { id: 'copenhague-tivoli', nome: 'Jardins de Tivoli', imagens: aimg('1571935441005-16cea051b78e', 'copenhague'), preco: 22, duracao: '4 horas', categoria: 'Parque', descricao: 'O segundo parque de diversões mais antigo do mundo, que inspirou Walt Disney.' },
      { id: 'copenhague-christiania', nome: 'Bairro Livre de Christiania', imagens: aimg('1571679654681-ba01b9e1e117', 'copenhague'), preco: 0, duracao: '2 horas', categoria: 'Bairro', descricao: 'Comunidade alternativa fundada em 1971 com arte, música e regras próprias.' },
      { id: 'copenhague-canais', nome: 'Tour de Bicicleta pela Cidade', imagens: aimg('1495474472287-4d71bcdd2085', 'copenhague'), preco: 38, duracao: '3 horas', categoria: 'Passeio', descricao: 'Conheça Copenhague como os locais: sobre duas rodas, a cidade mais ciclável da Europa.' }
    ],
    hospedagens: [
      { id: 'copenhague-h1', nome: "Hotel d'Angleterre", imagens: himg('luxo', 'copenhague'), precoNoite: 480, avaliacao: 4.9, tipo: 'Hotel', bairro: 'Kongens Nytorv', comodidades: ['Spa', 'Restaurante estrelado', 'Concierge'] },
      { id: 'copenhague-h2', nome: 'Hotel SP34', imagens: himg('medio', 'copenhague'), precoNoite: 210, avaliacao: 4.7, tipo: 'Hotel', bairro: 'Latin Quarter', comodidades: ['Vinho de boas-vindas', 'Sauna', 'Wi-Fi'] },
      { id: 'copenhague-h3', nome: 'Vesterbro Design Apartment', imagens: himg('apartamento', 'copenhague'), precoNoite: 130, avaliacao: 4.6, tipo: 'Apartamento', bairro: 'Vesterbro', comodidades: ['Cozinha', 'Bicicleta', 'Wi-Fi'] },
      { id: 'copenhague-h4', nome: 'Generator Copenhagen', imagens: himg('hostel', 'copenhague'), precoNoite: 45, avaliacao: 4.3, tipo: 'Hostel', bairro: 'Centro', comodidades: ['Bar', 'Wi-Fi', 'Café da manhã'] }
    ]
  }
]

// Pós-processamento — IMAGENS 100% LOCAIS:
//   - `imagem` → path do arquivo real em /public/images (manifesto
//     imagensLocais.js). Null quando o arquivo ainda não foi dropado;
//     nesse caso o componente Imagem mostra bloco neutro cream.
//   - `wiki` → slug Wikipedia mantido APENAS para texto auxiliar
//     (popup do mapa em cidade, expander "Sobre na Wikipedia" em atração).
//     NÃO é mais usado para imagem. Hospedagem não tem wiki — texto
//     Wikipedia de hotel não existe no fluxo do app.
cidades.forEach((cidade) => {
  cidade.wiki = WIKI_CIDADE[cidade.slug] || null
  cidade.imagem = IMAGENS_CIDADE[cidade.slug] || null
  cidade.imagemThumb = cidade.imagem
  const coord = COORDS[cidade.slug]
  cidade.lat = coord ? coord[0] : null
  cidade.lng = coord ? coord[1] : null
  // Custo de alimentação por dia (média realista). Valor padrão se não mapeado.
  cidade.custoAlimentacaoDia = ALIMENTACAO_DIA[cidade.slug] ?? 40
  cidade.epoca = EPOCA_CIDADE[cidade.slug] || null

  cidade.atracoes.forEach((a) => {
    a.cidade = cidade.nome
    a.pais = cidade.pais
    a.wiki = WIKI_ATRACAO[a.id] || null
    a.imagem = IMAGENS_ATRACAO[a.id] || null
    a.linkIngresso = linkIngresso(a.nome, cidade.nome)
  })
  cidade.hospedagens.forEach((h) => {
    h.cidade = cidade.nome
    h.pais = cidade.pais
    h.imagem = IMAGENS_HOSPEDAGEM[h.id] || null
    h.linkReserva = linkReserva(h.nome, cidade.nome)
  })
})

export const buscarCidade = (slug) => cidades.find((c) => c.slug === slug)
