// Bate e volta (day trips) saindo de uma cidade do roteiro.
//
// Cada item entra em cidade.atracoes com categoria 'Bate e volta' — assim é
// escolhido no planejador como qualquer atração e o custo cai em "Atrações".
// `preco` = custo estimado por pessoa da opção MAIS BARATA (transporte ida e
// volta + entrada principal), coerente com o resto do dataset (EUR/pessoa).
//
// Preços conferidos em out/2026 (sites oficiais Renfe, ALSA, Trenord, RhB,
// FlixBus + Omio). Sites oficiais das operadoras costumam ser os mais baratos:
// a Omio cobra taxa de serviço, mas compara todas as operadoras numa tela só.
// Mesclado em cidade.atracoes por data/cidades.js.

const gyg = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q).replace(/%20/g, '+')}`

export const BATE_VOLTA = {
  madri: [
    {
      id: 'madri-toledo',
      nome: 'Bate e volta: Toledo',
      preco: 23,
      duracao: 'Dia inteiro',
      categoria: 'Bate e volta',
      avaliacao: 4.8,
      local: 'Toledo, Espanha',
      linkOficial: 'https://turismo.toledo.es',
      dica: 'O ônibus ALSA sai de Plaza Elíptica (metrô L6/L11) a cada 30 min e custa metade do trem. Comprando online com antecedência sai a partir de ~€6 o trecho.',
      descricao: 'A "cidade das três culturas": catedral gótica, sinagogas e mesquitas num labirinto medieval no alto de um rochedo cercado pelo rio Tejo, a 1 hora de Madri.',
      bateVolta: {
        destino: 'Toledo',
        bandeira: '🇪🇸',
        distancia: '70 km',
        moeda: 'EUR',
        entradaPrincipal: { nome: 'Catedral Primada de Toledo', preco: 12 },
        opcoes: [
          {
            tipo: 'onibus',
            titulo: 'Ônibus ALSA',
            trajeto: 'Plaza Elíptica → Toledo',
            duracao: '~55 min',
            precoIdaVolta: 11,
            detalhe: 'Saídas a cada 30 min · a partir de ~€6 o trecho',
            omio: { de: 'madri', para: 'toledo', modal: 'onibus' },
            links: [
              { label: 'ALSA (site oficial)', url: 'https://www.alsa.com' },
              { label: 'Omio (ônibus)', url: 'https://www.omio.com/buses/madrid/toledo' }
            ]
          },
          {
            tipo: 'trem',
            titulo: 'Trem Renfe Avant',
            trajeto: 'Madrid Atocha → Toledo',
            duracao: '33 min',
            precoIdaVolta: 26,
            detalhe: 'Direto, ~1 por hora · ~€13 o trecho',
            omio: { de: 'madri', para: 'toledo', modal: 'trem' },
            links: [
              { label: 'Renfe (site oficial)', url: 'https://www.renfe.com/es/en' },
              { label: 'Omio (trem)', url: 'https://www.omio.com/trains/madrid/toledo' }
            ]
          },
          {
            tipo: 'tour',
            titulo: 'Tour guiado saindo de Madri',
            trajeto: 'Transporte + guia em português/espanhol',
            duracao: '~8 h',
            precoIdaVolta: 55,
            detalhe: 'Sem se preocupar com horários',
            links: [{ label: 'GetYourGuide', url: gyg('Toledo day trip from Madrid') }]
          }
        ],
        roteiro: [
          'Manhã: Catedral Primada (chegue na abertura, 10h)',
          'Almoço: carcamusas ou perdiz estofada perto da Plaza de Zocodover',
          'Tarde: Sinagoga de Santa María la Blanca e Mosteiro de San Juan de los Reyes',
          'Fim de tarde: Mirador del Valle para a vista clássica da cidade'
        ]
      }
    }
  ],
  milao: [
    {
      id: 'milao-lugano',
      nome: 'Bate e volta: Lugano (Suíça)',
      preco: 20,
      duracao: 'Dia inteiro',
      categoria: 'Bate e volta',
      avaliacao: 4.6,
      local: 'Lugano, Suíça',
      linkOficial: 'https://www.luganoregion.com',
      dica: 'O ônibus FlixBus é o mais barato (a partir de ~€10 o trecho). De trem, compre o bilhete regional da Trenord/TILO — o EuroCity custa o dobro e leva o mesmo tempo.',
      descricao: 'A Suíça de língua italiana a pouco mais de 1 hora de Milão: lago entre montanhas, calçadão à beira d’água e o centro histórico de Via Nassa.',
      bateVolta: {
        destino: 'Lugano',
        bandeira: '🇨🇭',
        distancia: '80 km',
        moeda: 'CHF',
        entradaPrincipal: null,
        opcoes: [
          {
            tipo: 'onibus',
            titulo: 'Ônibus FlixBus',
            trajeto: 'Milano Lampugnano → Lugano',
            duracao: '~1h15',
            precoIdaVolta: 20,
            detalhe: 'A partir de ~€10 o trecho comprando cedo',
            omio: { de: 'milao', para: 'lugano', modal: 'onibus' },
            links: [
              { label: 'FlixBus (site oficial)', url: 'https://www.flixbus.it/tratte-autobus/milano-lugano' },
              { label: 'Omio (ônibus)', url: 'https://www.omio.com/buses/milan/lugano' }
            ]
          },
          {
            tipo: 'trem',
            titulo: 'Trem regional TILO RE80',
            trajeto: 'Milano Centrale → Lugano',
            duracao: '~1h15',
            precoIdaVolta: 24,
            detalhe: 'Sem reserva, sai de hora em hora · ~€12 o trecho',
            omio: { de: 'milao', para: 'lugano', modal: 'trem' },
            links: [
              { label: 'Trenord (site oficial)', url: 'https://www.trenord.it/en/' },
              { label: 'Omio (trem)', url: 'https://www.omio.com/trains/milan/lugano' }
            ]
          },
          {
            tipo: 'tour',
            titulo: 'Tour Lago de Como + Lugano',
            trajeto: 'Ônibus + barco no Lago de Como',
            duracao: '~10 h',
            precoIdaVolta: 85,
            detalhe: 'Combina Itália e Suíça no mesmo dia',
            links: [{ label: 'GetYourGuide', url: gyg('Lake Como Lugano day trip from Milan') }]
          }
        ],
        roteiro: [
          'Manhã: Piazza della Riforma e as arcadas de Via Nassa',
          'Almoço: polenta ou risotto num grotto ticinese',
          'Tarde: Parco Ciani e passeio à beira do lago',
          'Opcional: funicular do Monte San Salvatore (~CHF 30 ida e volta)'
        ]
      }
    },
    {
      id: 'milao-bernina',
      nome: 'Bate e volta: Bernina Express (Suíça)',
      preco: 97,
      duracao: 'Dia inteiro (~14 h)',
      categoria: 'Bate e volta',
      avaliacao: 4.9,
      local: 'Tirano → St. Moritz, Suíça',
      linkOficial: 'https://www.rhb.ch/en/panoramic-trains/bernina-express',
      dica: 'Truque para economizar: o trem regional da RhB faz exatamente o mesmo trajeto Patrimônio da UNESCO sem a reserva do Bernina Express (~€34 a menos) — e as janelas abrem, ótimo para fotos.',
      descricao: 'A ferrovia mais alta dos Alpes: geleiras, o viaduto circular de Brusio e o lago branco do Passo do Bernina, saindo de Milão para St. Moritz e voltando no mesmo dia.',
      bateVolta: {
        destino: 'St. Moritz',
        bandeira: '🇨🇭',
        distancia: '160 km',
        moeda: 'CHF',
        entradaPrincipal: null,
        opcoes: [
          {
            tipo: 'trem',
            titulo: 'Por conta: Trenord + trem regional RhB',
            trajeto: 'Milano Centrale → Tirano → St. Moritz',
            duracao: '~2h30 + 2h20 cada sentido',
            precoIdaVolta: 97,
            detalhe: 'Trenord €12,50 + RhB ~€36 por trecho, sem reserva',
            omio: { de: 'milao', para: 'tirano', modal: 'trem' },
            links: [
              { label: 'Trenord Milão–Tirano', url: 'https://www.trenord.it/en/' },
              { label: 'RhB Tirano–St. Moritz', url: 'https://www.rhb.ch/en' },
              { label: 'Omio (Milão–Tirano)', url: 'https://www.omio.com/trains/milan/tirano' }
            ]
          },
          {
            tipo: 'trem',
            titulo: 'Bernina Express panorâmico',
            trajeto: 'Tirano → St. Moritz em vagão de vidro',
            duracao: '~2h20 no trecho panorâmico',
            precoIdaVolta: 131,
            detalhe: 'Mesmo trajeto + reserva obrigatória (~CHF 32) num sentido',
            links: [
              { label: 'Bernina Express (RhB oficial)', url: 'https://www.rhb.ch/en/panoramic-trains/bernina-express' },
              { label: 'Trenord Milão–Tirano', url: 'https://www.trenord.it/en/' }
            ]
          },
          {
            tipo: 'tour',
            titulo: 'Tour organizado saindo de Milão',
            trajeto: 'Ônibus até Tirano + Bernina Express + volta',
            duracao: '~13 h',
            precoIdaVolta: 145,
            detalhe: 'Reserva do trem incluída',
            links: [{ label: 'GetYourGuide', url: gyg('Bernina Express day trip from Milan') }]
          }
        ],
        roteiro: [
          'Saia de Milano Centrale no trem das ~7h20 para Tirano',
          'Manhã: Tirano → Alp Grüm, o trecho mais bonito (geleira do Palü)',
          'Almoço em St. Moritz e passeio pelo lago',
          'Tarde: volta pela mesma linha e trem para Milão à noite'
        ]
      }
    }
  ]
}
