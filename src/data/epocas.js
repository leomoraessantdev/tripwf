// Melhor época para visitar cada cidade. Estrutura por slug.
// Dados consolidados a partir de médias climatológicas (OMM/Climate-Data.org)
// e padrões turísticos das principais guias (Lonely Planet, Rick Steves, ViaTour).
//   - melhoresMeses : faixa principal recomendada
//   - descMelhor    : motivo prático da recomendação
//   - clima         : resumo do clima predominante (1 linha)
//   - altaTemporada : meses de pico de turistas e preço
//   - custoBeneficio: meses com clima ok + preços baixos (ombro de temporada)

export const EPOCA_CIDADE = {
  paris: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Clima ameno, dias longos e jardins floridos antes do pico turístico.',
    clima: 'Temperado oceânico — verões amenos, invernos frios e úmidos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  roma: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Temperaturas agradáveis e menos filas no Coliseu e Vaticano.',
    clima: 'Mediterrâneo — verões muito quentes e secos, invernos suaves.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março e Novembro'
  },
  barcelona: {
    melhoresMeses: 'Maio, Junho e Setembro',
    descMelhor: 'Sol mediterrâneo, mar ainda agradável e ruas menos lotadas.',
    clima: 'Mediterrâneo — verões quentes, invernos amenos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  amsterdam: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Tulipas em flor, dias longos e cafés com mesas na rua.',
    clima: 'Oceânico — chuvoso o ano todo, verões frescos.',
    altaTemporada: 'Julho, Agosto e Páscoa',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  praga: {
    melhoresMeses: 'Maio, Junho e Setembro',
    descMelhor: 'Clima agradável, jardins abertos e menos turistas na Ponte Carlos.',
    clima: 'Continental — verões quentes, invernos rigorosos com neve.',
    altaTemporada: 'Julho, Agosto e Dezembro (mercados de Natal)',
    custoBeneficio: 'Março, Abril e Outubro'
  },
  lisboa: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Sol sem o calor sufocante do verão, miradouros vazios ao pôr do sol.',
    clima: 'Mediterrâneo atlântico — verões quentes e secos, invernos amenos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  viena: {
    melhoresMeses: 'Maio, Junho e Setembro',
    descMelhor: 'Temperaturas confortáveis para palácios, parques e cafés históricos.',
    clima: 'Continental — verões quentes, invernos frios com neve frequente.',
    altaTemporada: 'Julho, Agosto e Dezembro (Natal e Réveillon)',
    custoBeneficio: 'Abril, Outubro e Novembro'
  },
  londres: {
    melhoresMeses: 'Maio a Julho',
    descMelhor: 'Dias longos, parques verdes e mais chance de céu aberto.',
    clima: 'Oceânico — chuvoso o ano todo, verões frescos e invernos amenos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  berlim: {
    melhoresMeses: 'Maio a Setembro',
    descMelhor: 'Vida ao ar livre, biergartens lotados e festivais culturais.',
    clima: 'Continental — verões quentes e invernos rigorosos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Abril e Outubro'
  },
  madri: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Tapas em terraços, museus tranquilos e clima antes do calor extremo.',
    clima: 'Continental seco — verões muito quentes (>35 °C), invernos frios.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  atenas: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Acrópole sem calor escaldante e tavernas com mesas na rua.',
    clima: 'Mediterrâneo — verões muito quentes e secos, invernos suaves.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  istambul: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Bósforo agradável, mesquitas sem multidões e tulipas em flor em abril.',
    clima: 'Mediterrâneo / subtropical úmido — verões quentes, invernos chuvosos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  budapeste: {
    melhoresMeses: 'Maio, Junho e Setembro',
    descMelhor: 'Termas ao ar livre, cruzeiros no Danúbio e ruin bars no clima ideal.',
    clima: 'Continental — verões quentes, invernos frios e secos.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Abril, Outubro e Novembro'
  },
  florenca: {
    melhoresMeses: 'Abril a Junho',
    descMelhor: 'Toscana florida, museus tranquilos e clima perfeito antes do verão.',
    clima: 'Mediterrâneo — verões quentes e secos, invernos suaves.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Março, Outubro e Novembro'
  },
  edimburgo: {
    melhoresMeses: 'Maio a Setembro',
    descMelhor: 'Dias longuíssimos, charneca verde e mais chance de céu aberto.',
    clima: 'Oceânico frio — verões frescos e chuvosos, invernos longos e úmidos.',
    altaTemporada: 'Agosto (Festival Fringe)',
    custoBeneficio: 'Maio, Setembro e Outubro'
  },
  copenhague: {
    melhoresMeses: 'Junho a Agosto',
    descMelhor: 'Verão escandinavo: 17 h de luz, cafés em Nyhavn e Tivoli aberto.',
    clima: 'Oceânico frio — verões curtos e amenos, invernos longos e escuros.',
    altaTemporada: 'Julho e Agosto',
    custoBeneficio: 'Maio e Setembro'
  }
}
