// =============================================================
// Scores subjetivos por cidade — usado no Comparador de destinos.
// =============================================================
//
// Escala 1 a 5 (1 = baixo, 5 = alto). Custo NÃO entra aqui — é
// calculado em tempo real a partir de hospedagem + alimentação +
// atrações reais do dataset (ver utils/compararCidades.js).
//
// Critérios:
//   - cultural    densidade de museus, sítios históricos, patrimônio
//   - noturna     reputação de baladas, bares, festivais
//   - gastronomia força culinária local + cena gastronômica
//   - seguranca   percepção de segurança turística (Numbeo/OSAC 2024)
//   - clima       conforto climático médio para o turista (anual)
//   - caminhada   esforço típico para visitar (relevo + dispersão)
//   - intensidade fluxo turístico esperado (volume + filas)

export const SCORE_CIDADE = {
  paris:      { cultural: 5, noturna: 4, gastronomia: 5, seguranca: 3, clima: 3, caminhada: 4, intensidade: 5 },
  roma:       { cultural: 5, noturna: 3, gastronomia: 5, seguranca: 3, clima: 4, caminhada: 4, intensidade: 5 },
  barcelona:  { cultural: 4, noturna: 5, gastronomia: 4, seguranca: 3, clima: 5, caminhada: 3, intensidade: 4 },
  amsterdam:  { cultural: 4, noturna: 4, gastronomia: 3, seguranca: 4, clima: 3, caminhada: 3, intensidade: 5 },
  praga:      { cultural: 4, noturna: 4, gastronomia: 3, seguranca: 4, clima: 3, caminhada: 3, intensidade: 4 },
  lisboa:     { cultural: 4, noturna: 4, gastronomia: 4, seguranca: 4, clima: 5, caminhada: 4, intensidade: 4 },
  viena:      { cultural: 5, noturna: 3, gastronomia: 4, seguranca: 5, clima: 3, caminhada: 3, intensidade: 3 },
  londres:    { cultural: 5, noturna: 5, gastronomia: 3, seguranca: 4, clima: 2, caminhada: 4, intensidade: 5 },
  berlim:     { cultural: 4, noturna: 5, gastronomia: 3, seguranca: 4, clima: 2, caminhada: 3, intensidade: 4 },
  madri:      { cultural: 4, noturna: 5, gastronomia: 4, seguranca: 4, clima: 4, caminhada: 3, intensidade: 4 },
  atenas:     { cultural: 5, noturna: 3, gastronomia: 4, seguranca: 3, clima: 4, caminhada: 4, intensidade: 4 },
  istambul:   { cultural: 5, noturna: 3, gastronomia: 5, seguranca: 3, clima: 4, caminhada: 4, intensidade: 5 },
  budapeste:  { cultural: 4, noturna: 5, gastronomia: 3, seguranca: 4, clima: 3, caminhada: 3, intensidade: 4 },
  florenca:   { cultural: 5, noturna: 2, gastronomia: 5, seguranca: 4, clima: 4, caminhada: 4, intensidade: 4 },
  edimburgo:  { cultural: 4, noturna: 3, gastronomia: 3, seguranca: 5, clima: 2, caminhada: 4, intensidade: 3 },
  copenhague: { cultural: 4, noturna: 3, gastronomia: 4, seguranca: 5, clima: 2, caminhada: 3, intensidade: 3 }
}

export const SCORE_PADRAO = {
  cultural: 3, noturna: 3, gastronomia: 3, seguranca: 3,
  clima: 3, caminhada: 3, intensidade: 3
}
