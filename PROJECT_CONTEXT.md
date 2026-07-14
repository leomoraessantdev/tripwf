# TripWF — Contexto Persistente do Projeto

> **Para o Claude (e quem mais reabrir o projeto):** **leia este arquivo antes de qualquer alteração futura.** Ele resume o que o TripWF é, como está montado e quais decisões já foram tomadas. Atualize-o sempre que algo estrutural mudar.

Última atualização: 2026-07-13 (Expansão de catálogo em 6 cidades, CardEconomia com gráfico de cenários + tempo economizado, favoritos, busca/filtros, 404, SEO por rota, skeleton, code splitting)

> **2026-07-13 — atualização de posicionamento:** o projeto deixou de ser apresentado como TCC e agora é peça de **portfólio profissional**. Onde este documento diz "TCC/banca", leia "portfólio/recrutadores". As regras técnicas continuam valendo.

## Novidades de 2026-07-13 (resumo)

- **Catálogo expandido em 6 cidades** (Madri, Barcelona, Florença, Roma, Budapeste, Atenas): 12 atrações + 10 hospedagens cada. Novos campos opcionais em atração: `avaliacao`, `local` (bairro), `dica` (informação útil), `linkOficial`. `AtracaoCard` renderiza todos condicionalmente — cidades não expandidas continuam funcionando sem eles.
- **Imagens novas** baixadas uma única vez da Wikipedia/Wikimedia via `scripts/baixar-imagens-novas.mjs` (resumível, backoff p/ 429; normaliza JPEG 1200px via sharp) — continuam 100% locais em runtime.
- **CardEconomia v2** (`economiaCalculada.js`): corrigido bug de economia fantasma (cidade sem hotel escolhido não gera mais "economia" de hospedagem); novos cenários `agenciaTotal` (baseline × 1.15 de taxa de operadora) e `tempo` (horas de pesquisa manual estimadas vs ~15 min no TripWF). UI ganhou gráfico de barras dos 3 cenários (agência / sem planejar / TripWF) + 3 tiles de tempo + disclaimer de metodologia.
- **Favoritos** (`hooks/useFavoritos.js` + `ui/BotaoFavorito.jsx`): coração em AtracaoCard/HospedagemCard, localStorage `tripwf-favoritos`, sync entre componentes via CustomEvent; filtro "♥ Favoritas" na PaginaCidade.
- **Busca e filtros**: DestinosGrid com busca textual + filtro por país + ordenação por custo/dia (e badge ~€X/dia no card); PaginaCidade com chips de categoria (atrações), chips de tipo + ordenação (hospedagens) via `ui/FiltroChips.jsx`.
- **404 personalizada** (`pages/Pagina404.jsx`) nas rotas `/404` e `*`; slug de cidade inválido redireciona para lá.
- **SEO**: OG/Twitter meta tags no index.html + `hooks/useTituloPagina.js` (título e description por rota).
- **Skeleton**: pulso no placeholder do componente `Imagem` enquanto o arquivo local carrega.
- **A11y**: skip-link "Pular para o conteúdo", `prefers-reduced-motion`, aria-expanded no menu mobile, aria-hidden em ícones decorativos.
- **Performance**: jsPDF/html2canvas via import dinâmico (só carregam ao exportar) + `manualChunks` (react/mapa/animação) — bundle inicial caiu de ~1,34 MB para ~346 KB.

---

## 1. Objetivo do TripWF

TripWF é o **Trabalho de Conclusão de Curso (TCC)** do usuário: um SPA de **planejamento de viagens pela Europa** que precisa ser:

- Defensável diante de uma **banca examinadora** (acadêmico, profissional, funcional do começo ao fim).
- **100% em português (BR)** na UI e nos identificadores do código.
- Operável **sem backend** (tudo em localStorage + exportação em PDF + link de compartilhamento codificado em base64url).

O usuário monta uma viagem em 4 passos (orçamento → cidades → dias → escolhas) e recebe um roteiro completo com mapa, transportes entre cidades, custos detalhados e links reais para reserva/compra de ingresso.

---

## 2. Stack utilizada

- **React 18** + **Vite 5** + **Tailwind CSS 3** (sem Next.js, sem SSR)
- **React Router DOM 6** — 5 rotas (`/`, `/cidade/:slug`, `/planejador`, `/roteiro`, `/sobre`)
- **Framer Motion** — animações de entrada
- **Leaflet** + **react-leaflet** — mapa do roteiro (tiles OpenStreetMap)
- **lucide-react** — ícones
- **jsPDF** + **html2canvas** — exportação do roteiro em PDF
- **clsx** — composição de classes
- **localStorage** — única forma de persistência (chave `viagem-europa`)
- **Wikipedia REST API** — fonte de imagens e resumos (sem chave, com CORS aberto)

Sem testes automatizados configurados. Sem TypeScript. Sem linter configurado além do JSX padrão do Vite.

---

## 3. Estrutura de pastas (`src/`)

```
src/
├─ App.jsx                  Rotas + detecção de ?v=<token> de compartilhamento
├─ main.jsx                 Entry: BrowserRouter + ViagemProvider
├─ index.css                Tailwind + classes utilitárias (btn-base, card-base, etc.)
├─ context/
│  └─ ViagemContext.jsx     Estado global da viagem (fonte única de verdade)
├─ data/
│  ├─ cidades.js            16 cidades × (~5 atrações + 4 hospedagens), preços EUR, coords, slugs wiki
│  ├─ imagensLocais.js      Manifesto id → path em /public/images (cities/hotels/attractions)
│  ├─ epocas.js             Melhor época por cidade (meses, clima, alta temporada, custo-benefício)
│  └─ scoreCidades.js       Scores 1–5 por cidade (cultural/noturna/gastronomia/segurança/clima/caminhada/intensidade)
├─ hooks/
│  ├─ useLocalStorage.js    Persistência genérica em localStorage
│  ├─ useScrollHeader.js    Alterna header transparente/sólido na home
│  ├─ useTripCost.js        Wrapper conveniente sobre totais do contexto
│  ├─ useLinkComData.js     Hook context-aware: enriquece linkIngresso/linkReserva com datas+viajantes
│  └─ useWikiResumo.js      Resumo Wikipedia (extract + descrição + URL artigo)
├─ pages/
│  ├─ PaginaInicial.jsx     Hero + grid de destinos + ComoFunciona
│  ├─ PaginaCidade.jsx      Hero + atrações + hospedagens + CTA planejador
│  ├─ PaginaPlanejador.jsx  4 passos + BudgetSummary flutuante
│  ├─ PaginaRoteiro.jsx     Resumo + Mapa + Transportes + Cidades + Reservas/Ingressos
│  └─ PaginaSobre.jsx       Institucional: hero + problema + solução + funcionalidades + stack + CTA
├─ components/
│  ├─ layout/   Header (com badge de cidades), Footer
│  ├─ home/     Hero, DestinosGrid, ComoFunciona
│  ├─ cidade/   CidadeHero, AtracaoCard, HospedagemCard, MelhorEpoca
│  ├─ planejador/
│  │   ├─ PassosIndicador    Stepper clicável
│  │   ├─ PassoOrcamento     Origem, datas, viajantes, slider €, estilo, presets + CTA "Surpreenda-me"
│  │   ├─ ModalSurpresa      Modal do Modo Surpresa: loading animado + justificativa + rota
│  │   ├─ PassoCidades       Grid 16 cidades com dias inline + ComparadorCidades expansível
│  │   ├─ ComparadorCidades  Comparador inteligente lado a lado (9 critérios + recomendação)
│  │   ├─ PassoDias          Drag-and-drop + setas (ordem alimenta o mapa)
│  │   ├─ PassoEscolhas      Accordion por cidade com auto-sugestão
│  │   ├─ BudgetSummary      Painel flutuante: Total/pessoa/dia + breakdown
│  │   └─ ResumoFlutuante    (versão alternativa, não usada atualmente)
│  ├─ roteiro/
│  │   ├─ HeroRoteiro          Hero premium: título emocional, subtítulo dinâmico, narrativa de foco/vibe, chips
│  │   ├─ ResumoRapido         Banner com 5 KPIs em emoji (cidades · noites · atrações · deslocamentos · total)
│  │   ├─ ResumoViagem         Card premium de custo total + 4 categorias com gradiente + barra orçamento (badge 🟢/🟡/🔴)
│  │   ├─ CardEconomia         Card "Quanto você economizou planejando" — baseline vs atual + breakdown + sugestão extra
│  │   ├─ SugestoesEconomia    Sugestões inteligentes para baixar o custo quando próximo/acima do orçamento
│  │   ├─ TimelineRoteiro      Timeline horizontal das cidades (foto, dias, custo, atrações, hotel)
│  │   ├─ MapaRoteiro          Leaflet/OSM com markers numerados + polyline + cards de trechos premium
│  │   ├─ TransportesTrechos   Avião/trem/ônibus/carro com tempo+preço+links reais
│  │   ├─ DeslocamentoEstimado Caminhada/dia + trechos metrô + tempo + indicador leve/moderado/intenso
│  │   ├─ CidadeRoteiro        Card detalhado por cidade
│  │   ├─ ResumoEscolhas       Cards Booking/GetYourGuide
│  │   └─ ChecklistViagem      Checklist adaptativo de preparativos com progresso e marcação persistente
│  └─ ui/       Botao, Tag, Slider, Avaliacao, Imagem, WikiExtract, ToastSalvo, ModalRetomar
└─ utils/
   ├─ formatadores.js   formatarEUR / formatarBRL (câmbio fixo 5.8) / formatarPreco
   ├─ datas.js          computarDatasCidades + formatadores (sem bug de fuso UTC)
   ├─ distancia.js      Haversine (km em linha reta)
   ├─ exportarPdf.js    html2canvas + jsPDF, multi-página
   ├─ links.js          linkIngresso (GetYourGuide), linkReserva (Booking)
   ├─ compartilhar.js   Encode/decode base64url do estado + Web Share API
   ├─ sugestoes.js      Heurística determinística (estilo + orçamento + dias)
   ├─ transportes.js    Estimativas + links Rome2Rio/Trainline/FlixBus/Google
   ├─ deslocamento.js   Estimativa heurística de caminhada/metrô/tempo + indicador de intensidade
   ├─ checklistViagem.js Gera o checklist adaptativo de preparativos a partir do roteiro
   ├─ compararCidades.js Comparador 1-a-1: 8 dimensões + recomendação ponderada pelo estilo
   ├─ narrativaRoteiro.js Gera título, subtítulo e mensagens emocionais do hero do roteiro
   ├─ sugerirEconomia.js Sugestões inteligentes p/ baixar custo (hotel → transporte → atração → dia)
   ├─ economiaCalculada.js Cálculo baseline "turista sem planejar" vs atual + breakdown por categoria
   ├─ surpreendaMe.js   Gerador automático do roteiro do Modo Surpresa (perfil → cidades+atrações+hospedagens)
   ├─ saveTracker.js    Carimbo de última edição + event bus do toast "Roteiro salvo"
   ├─ temporadas.js     Detector alta/média/baixa por cidade × mês + multiplicadores hotel/voo
   └─ wikiImagem.js     Cliente Wikipedia REST com cache + dedupe in-flight (SÓ texto)
```

---

## 4. Funcionalidades prontas

### Páginas
- **Home**: hero com imagem Wikipedia de Paris, grid completo das 16 cidades, seção “Como funciona” (4 passos), CTAs cruzados
- **Cidade individual**: hero com botão de inclusão na viagem, bloco "Melhor época para visitar" (meses recomendados + alta temporada + custo-benefício + clima), lista de atrações com preço em EUR+BRL e link de ingresso, lista de hospedagens com avaliação e link de reserva, CTA pro planejador
- **Planejador**: 4 passos com `PassosIndicador` clicável (só permite voltar a passos já visitados); botão “Próximo” bloqueado se nenhuma cidade selecionada no passo 2; `BudgetSummary` fixo no canto inferior direito durante todo o planejador
- **Roteiro** (redesign premium): bloqueia view se `dadosViagem.length === 0` (mostra estado vazio com CTA); senão renderiza barra de ações + Hero (gradient premium com narrativa dinâmica) + Resumo rápido (5 KPIs em emoji) + Investimento total + Timeline horizontal das cidades + Mapa + Transportes inter-cidade + Deslocamento intra-cidade + Cards por cidade + Reservas/ingressos + Checklist. Hero e todo o conteúdo visual fica dentro de `#roteiro-imprimir` (exportado em PDF); barra de ações fica fora.

### Funcionalidades transversais
- **Persistência**: estado completo salvo em `localStorage.viagem-europa` (orçamento, viajantes, origem, datas, estilo, cidades, dias por cidade, atrações escolhidas, hospedagem escolhida)
- **Imagens**: Wikipedia REST (cache global + dedup + thumbnail preferido sobre originalimage) com fallback para SVG colorido gerado por hash do nome
- **Datas automáticas**: data de volta calculada somando os dias por cidade a partir da data de ida; usuário pode sobrescrever
- **Cálculo de custos**:
  - Hospedagem: `precoNoite × dias`
  - Atrações: soma simples dos ingressos
  - Alimentação: `custoAlimentacaoDia × dias × viajantes` (varia por cidade — Istambul barata, Copenhague cara)
  - Transporte: `€80 × (cidades – 1)` (estimativa trem regional, fica fora dos cards por cidade)
- **Auto-sugestão** (`PassoEscolhas`): ao abrir uma cidade vazia pela 1ª vez, `sugerirEscolhas` aplica atrações + hospedagem com base no estilo do usuário; mostra ícone Sparkles + banner explicando que é apenas ponto de partida
- **Ordem sugerida do dia** (`PassoEscolhas`): dentro do accordion de cada cidade, entre Atrações e Hospedagem, mostra a lista das atrações escolhidas numeradas e distribuídas em Manhã / Tarde / Fim de tarde / Noite. Recalcula sozinha quando o usuário marca ou desmarca. Heurística pura em `utils/sugestoes.js → sugerirOrdemDia`: ordena pelo `PERIODO_NATURAL` da categoria (Monumento/Histórico cedo → Museu/Cultural depois → Bairro/Parque/Passeio no fim de tarde → Gastronomia à noite) e usa um cursor para evitar empilhar duas atrações no mesmo período. Não depende de coordenadas (atrações não têm lat/lng individual). Ícones lucide: Sunrise/Sun/Sunset/Moon
- **Mapa do roteiro**: Leaflet/OSM com markers numerados em laranja, polyline tracejada conectando cidades em ordem, popup com extract Wikipedia e link para o artigo
- **Sugestões de transporte**: 4 modos (avião ≥400km, trem <1800km, ônibus <1500km, carro <2500km) com estimativa de tempo e faixa de preço; rótulos automáticos “Mais rápido” / “Mais barato” / “Recomendado”; links comprovadamente estáveis (Google Flights, Rome2Rio coringa universal, Trainline, FlixBus, Google Maps)
- **Deslocamento estimado intra-cidade** (`utils/deslocamento.js` + `components/roteiro/DeslocamentoEstimado.jsx`): a partir das atrações escolhidas e do nº de dias por cidade, calcula caminhada/dia (km), nº de trechos de metrô/dia, tempo total de deslocamento diário e um indicador de intensidade (🟢 leve / 🟡 moderado / 🔴 intenso). Heurística determinística baseada em PERFIL_CIDADE (compacidade × modal dominante): cidades compactas+caminháveis (Florença, Edimburgo, Praga, Lisboa, Atenas, Copenhague), médias mistas (Amsterdam, Viena, Barcelona, Budapeste, Roma) e metropolitanas com metrô (Paris, Londres, Berlim, Madri, Istambul). Velocidade caminhada 4,5 km/h, metrô efetivo 18 km/h + 8 min fixos por trecho, caminhada base 2,5 km/dia + 0,5 km por atração. Sem APIs externas. Atrações não têm coordenadas próprias — daí o uso de perfil por cidade.
- **Melhor época para visitar** (`data/epocas.js` + `components/cidade/MelhorEpoca.jsx`): bloco na PaginaCidade com meses recomendados, alta temporada, melhor custo-benefício e clima predominante. Dado por slug consolidado a partir de médias climatológicas (OMM / Climate-Data.org) e guias turísticos.
- **Checklist da viagem** (`utils/checklistViagem.js` + `components/roteiro/ChecklistViagem.jsx`): bloco no fim do roteiro com lista adaptativa de preparativos (documentos, reservas, dinheiro, conexão, logística, bagagem). Itens condicionais: "Hospedagens reservadas" só aparece se houver hospedagem escolhida, "Atrações reservadas" só se houver ingresso pago, "Transporte interno" só com 2+ cidades. Texto do item "Dinheiro local" adapta às moedas reais do roteiro (EUR/GBP/CZK/TRY/HUF/DKK). Estado de marcação persiste em `localStorage` (campo `checklistConcluidos`), com botão de reset. Header mostra contador `X/Y` + barra de progresso laranja (incompleto) / verde (tudo pronto). Roteiro vindo de link compartilhado começa com checklist zerado.
- **Comparador inteligente de cidades** (`data/scoreCidades.js` + `utils/compararCidades.js` + `components/planejador/ComparadorCidades.jsx`): bloco expansível no topo do passo "Cidades". Usuário escolhe dois destinos diferentes em dropdowns e recebe 9 dimensões comparadas (custo, cultural, noturna, gastronomia, segurança, clima, caminhada, intensidade turística, custo-benefício) com barras visuais e badge "vencedora" por linha. O custo médio/dia é calculado em tempo real a partir do dataset real (hospedagem por estilo + alimentação + média dos 3 ingressos mais caros). Recomendação final ("Melhor para você") usa score composto ponderado pelo `estilo` do usuário (econômico = 65% custo · 35% qualidade; conforto = 45/55; luxo = 20/80) e alerta automaticamente se as duas cidades passam do orçamento diário. Sem APIs externas.
- **Inteligência por datas — temporadas + links pré-preenchidos** (`utils/temporadas.js` + `utils/links.js` + `hooks/useLinkComData.js`): toda a UI agora reage às datas reais da viagem. (1) `temporadas.js` lê `EPOCA_CIDADE` (parseia strings tipo "Julho e Agosto", "Março, Outubro e Novembro" → meses inteiros) e classifica a data daquela cidade como `alta` (☀️ multiplicador hotel ×1.20, voo ×1.25), `baixa` (❄️ hotel ×0.85, voo ×0.90) ou `media` (🌸 ×1.00). Multiplicadores baseados em médias agregadas Booking/Skyscanner/Trainline 2023-24. (2) `mensagemImpactoTemporada(temporada, cidadeNome)` produz frase em PT-BR: "Julho é alta temporada em Roma. Hospedagens costumam custar ~20% mais que a média anual." (3) `linkIngresso` agora aceita `{ dataInicio, dataFim }` → adiciona `date_from` e `date_to` no GetYourGuide; `linkReserva` aceita `{ dataInicio, dataFim, viajantes }` → adiciona `checkin`, `checkout`, `group_adults` no Booking (formato `?ss=...&checkin=2026-07-10&checkout=2026-07-13&group_adults=2`). Checkout = dataFim + 1 dia (saída pela manhã do dia seguinte). (4) `useLinkIngressoComData(atracao)` / `useLinkReservaComData(hospedagem)` em `hooks/useLinkComData.js` resolvem em runtime: se a cidade do item estiver em `dadosViagem`, retornam URL enriquecida; caso contrário, caem no link pré-computado de `data/cidades.js`. Aplicado em `AtracaoCard`, `HospedagemCard`, e `ResumoEscolhas`. (5) `sugestoesTransporte` ganhou parâmetro `multiplicadorTemporada` que ajusta `precoMin`/`precoMax` de todos os modos (avião/trem/ônibus/carro). `TransportesTrechos` calcula `multiplicadorVooMedio(slugA, slugB, data)` (média entre as duas cidades naquela data) e exibe alerta dentro do trecho: "Preços estimados ~25% mais altos por causa da alta temporada no destino." (6) `CidadeRoteiro` ganhou badge colorido de temporada (amber/sky/emerald) no hero ao lado do range de datas + faixa explicativa com `<Thermometer />` logo abaixo. Todos os componentes auto-atualizam quando o usuário muda a data de ida.
- **Salvamento explícito + modal de retomada** (`utils/saveTracker.js` + `components/ui/ToastSalvo.jsx` + `components/ui/ModalRetomar.jsx`): a persistência real continua acontecendo no `useLocalStorage('viagem-europa')` do `ViagemContext` — toda mudança via setter cai no localStorage automaticamente. O que foi adicionado é a **camada de feedback**: (1) `saveTracker` mantém uma chave separada `tripwf-ultima-edicao` (timestamp Date.now em ms) e expõe um event bus `CustomEvent('tripwf:salvo')`. (2) Um `useEffect` no `ViagemContext` escuta mudanças em `cidadesSelecionadas`, `orcamentoDiario`, `viajantes`, `dataIda`, `dataVolta`, `estilo`, `origem` e chama `emitirSalvamento()` com debounce de 700ms (evita flood quando o slider de orçamento é arrastado; `primeiraExecucaoRef` ignora o mount inicial). (3) `ToastSalvo` (montado globalmente em `App.jsx`) escuta o evento e mostra um toast pílula no canto inferior direito ("Roteiro salvo automaticamente ✓") por 2.2s, com spring de Framer Motion. (4) `ModalRetomar` (também global) aparece apenas em `/` quando há `cidadesSelecionadas.length > 0` e a sessão ainda não viu o modal (`sessionStorage.tripwf-modal-retomar-visto`). Mostra hero gradient primary + ícone bookmark + "há X minutos/horas/dias" (via `formatarTempoRelativo`) + 4 KPIs (cidades+bandeiras, duração+data, viajantes, orçamento), e dois CTAs: "Começar novo" (confirma antes de chamar `limparViagem`) e "Continuar roteiro" (navega para `/roteiro` + fecha). (5) Botão **💾 Salvar** explícito na barra de ações do roteiro emite o mesmo evento com texto custom "Roteiro salvo ✓" — placebo elegante: dá conforto sem trabalho redundante. Funciona offline, sem login, zero dependência externa.
- **Modo Surpresa** (`utils/surpreendaMe.js` + `components/planejador/ModalSurpresa.jsx`): CTA premium no topo do `PassoOrcamento` ("✨ Surpreenda-me") que abre um modal. O modal usa orçamento + datas + estilo + viajantes já preenchidos para gerar um roteiro completo (cidades + dias + atrações + hospedagens + ordem geográfica). Algoritmo determinístico-com-twist: cada cidade recebe um score combinando atributos do `SCORE_CIDADE` (cultural/gastronomia/segurança/clima) ponderados pelo estilo + um `custoFit` que compara `cidade.custoMedioDia` com `orcamentoDiario`; `mulberry32(semente)` adiciona jitter de ±0.06 para variar a seleção entre as N primeiras (`Math.min(6, round(totalDias/3))`) cidades elegíveis sem cair fora do top. Dias distribuídos uniformemente com sobras para as melhor pontuadas; reordenação geográfica final por longitude (Oeste → Leste) para evitar zigue-zague. Para cada cidade, `sugerirEscolhas` (reuso) preenche atrações e hospedagem segundo o estilo. UX do modal: loading 2.4s com 7 mensagens rotativas + spinner pulsante + barra de progresso (simulando IA), depois revela justificativa textual ("Escolhemos este roteiro porque você prefere conforto, tem um orçamento equilibrado e 12 dias de viagem"), 4 KPIs (cidades/dias/estilo/custo estimado), preview da rota com bandeiras+chips, alerta se passar 15% do orçamento, botões "Gerar novamente" (nova semente) e "Aplicar e ver roteiro" (navega para /roteiro via `aplicarRoteiroSurpresa` no contexto, que substitui `cidadesSelecionadas` e zera o checklist). Categorização do orçamento: baixo <€70, médio €70–180, alto >€180.
- **Quanto você economizou planejando** (`utils/economiaCalculada.js` + `components/roteiro/CardEconomia.jsx`): card premium no roteiro (entre `ResumoViagem` e `SugestoesEconomia`) que mostra estimativa de economia vs uma "viagem média sem planejamento". Baseline pessimista: hotel mais caro de cada cidade × multiplicador alta temporada (×1.20) + voo regional médio (€120/trecho) + ingressos mais caros disponíveis na cidade (top N onde N = atrações escolhidas) + alimentação inalterada. Real: `totais.custoTotal`. Indicador 🟢/🟡/🔴 por ratio `economia/baseline` (≥12% excelente, 4–12% moderado, <4% alto custo). Breakdown por categoria (hospedagem, atrações, transporte, temporada). `economiaTemporada` é exibida no breakdown mas NÃO somada no total — já está implícita em `economiaHospedagem` (baseline usa mult 1.20). Badges qualitativos construídos pelos dados: "Hospedagens mais eficientes", "Melhor distribuição do roteiro" (2-5 cidades), "Transporte otimizado", "Menor impacto de alta temporada", "X atrações gratuitas no roteiro". Top sugestão extra: percorre todas as cidades, calcula maior ganho de trocar hotel atual pelo mais barato disponível ("Você poderia economizar mais €X trocando o hotel de Paris"). UI usa mesmo gradient premium do `ResumoViagem`/`HeroRoteiro` (continuidade visual) + blob verde no canto + 3 cards de comparação (Viagem média / Seu roteiro / Economia). Função pura, sem rede. Não renderiza se `economiaTotal < 1`.
- **Sugestões inteligentes de economia** (`utils/sugerirEconomia.js` + `components/roteiro/SugestoesEconomia.jsx`): card no roteiro que aparece apenas quando o custo total está próximo (≥ 90%) ou acima do orçamento. Gera até 5 sugestões reais a partir do dataset, em ordem de menor → maior impacto na experiência: (1) trocar hotel por mais barato na mesma cidade, (2) usar modal de transporte mais econômico entre cidades (usa `sugestoesTransporte` com cidades reais e km Haversine), (3) trocar atração paga pela atração gratuita disponível na cidade, (4) remover atração premium quando há outras pagas, (5) reduzir 1 dia na cidade com maior custo/dia. Soma economia potencial e mostra estado tri-color 🟢/🟡/🔴 (também refletido na barra de orçamento de `ResumoViagem`). Auto-atualiza via React (memo das sugestões depende de `dadosViagem`/`totais`/`dataIda`).
- **Exportar PDF**: html2canvas + jsPDF, multi-página, fundo cream
- **Compartilhar**: gera URL `?v=<base64url>` codificando o estado; usa Web Share API quando disponível, cai para clipboard, mostra feedback “Link copiado!”; ao reabrir, `App.jsx` pergunta antes de aplicar e limpa o param

### Reuso entre componentes
- `Imagem` aceita `wiki` como string OU array (cascata de slugs até achar imagem)
- `WikiExtract` é um `<details>` nativo que mostra resumo da Wikipedia
- `Botao` tem 5 variantes (primario/secundario/ghost/outline/branco) e 3 tamanhos

---

## 5. Fluxo do sistema (golden path)

1. **Home** (`/`) → usuário clica em “Começar a planejar” ou explora destinos
2. **Cidade** (opcional, `/cidade/:slug`) → conhece a cidade, marca “Adicionar à viagem”
3. **Planejador** (`/planejador`):
   1. Preenche orçamento, datas, viajantes, estilo
   2. Marca cidades no grid (com dias inline)
   3. Reordena cidades arrastando/setas → essa ordem é a ordem da viagem no mapa
   4. Para cada cidade, confirma ou ajusta a auto-sugestão de atrações + hospedagem
4. **Roteiro** (`/roteiro`):
   - Vê resumo geral, mapa, transportes entre cidades, cards detalhados, links de reserva
   - Exporta PDF ou compartilha link
5. Em qualquer momento, pode “Limpar” ou “Editar roteiro” para voltar ao planejador

### Estado global (ViagemContext)
```
orcamentoDiario  (€)
viajantes        (1–10)
origem           (texto livre, ex.: "São Paulo, Brasil")
dataIda          (YYYY-MM-DD)
dataVolta        (YYYY-MM-DD, pode ser vazio = auto)
dataVoltaEfetiva (derivado)
estilo           ('economico' | 'conforto' | 'luxo')
cidadesSelecionadas: [
  { slug, dias, atracoesEscolhidas: [], hospedagemEscolhida: id|null }
]
```

`dadosViagem` (memoizado) enriquece cada cidade com objeto completo + custos + datas.
`totais` (memoizado) agrega 4 categorias + comparação com orçamento.

---

## 6. Decisões importantes de layout e arquitetura

- **Stack aprovada em 30/04/2026** — não re-questionar React+Vite+Tailwind+localStorage+PDF.
- **Idioma**: UI, classes, nomes de variáveis e funções, comentários — tudo em **PT-BR**.
- **Imagens — 100% LOCAIS** (decisão final em 2026-05-14):
  - `src` = path do arquivo em `/public/images/{cities,hotels,attractions}/` (manifesto em `src/data/imagensLocais.js`).
  - Sem Wikipedia no pipeline visual. Sem SVG ilustrado. Sem placeholder gradiente. Sem fallback artificial.
  - Quando um ID não tem entrada no manifesto (arquivo não dropado), o componente `Imagem` renderiza apenas `bg-cream-200` neutro (sem texto, sem ícone, sem ilustração) — fica óbvio que falta arquivo, sem fingir conteúdo.
  - Cada hospedagem/atração/cidade usa o **nome real do arquivo** (não normalizado para `{id}.jpg`) — o manifesto faz a tradução. Suporta `.jpg`, `.webp`, `.avif`, `.png`.
- **Componente `Imagem`** (`src/components/ui/Imagem.jsx`): aceita `src` (string ou array de paths); renderiza `<img>` com `object-cover object-center`, `loading="lazy"`, `decoding="async"`. Em caso de falha em todos os paths da cascata, vira o bloco cream neutro.
- **Wikipedia mantém-se SÓ para texto** (popup do mapa, expander "Sobre na Wikipedia" no card de atração) — uso ortogonal ao da imagem. `useWikiResumo`, `WikiExtract` e o popup em `MapaRoteiro` continuam usando `cidade.wiki` e `a.wiki`.
- **Wikipedia slugs em EN**: muito mais artigos disponíveis e com imagem do que em PT.
- **Sem backend, sem login**: tudo localStorage + URL compartilhável + PDF. Mantém o TCC banca-friendly e independente de infraestrutura.
- **Custo de alimentação por cidade**, não global: reflete diferenças reais de custo de vida (€25 Istambul → €70 Copenhague).
- **Transporte separado dos cards por cidade**: aparece apenas no total geral e na seção “Transportes entre cidades”, com comentário explícito no código para evitar dupla contagem.
- **Parse manual de datas YYYY-MM-DD** (`utils/datas.js`): nunca usar `new Date(iso)` direto — vira UTC e quebra para usuários no Brasil.
- **Câmbio fixo EUR→BRL = 5,8** em `formatadores.js` (apenas para exibição secundária; preços canônicos em EUR).
- **Paleta**:
  - `primary-500` `#0F4C5C` (teal escuro — cor do app)
  - `accent-500` `#E36414` (laranja — ação primária)
  - `cream-100/200/300` (fundos)
  - `success` / `warning` / `danger` para feedback de orçamento
- **Tailwind utility classes customizadas** em `index.css`: `container-app`, `card-base`, `btn-base`, `input-base`, `glass`, `glass-dark`. **Reutilizar** ao invés de duplicar.
- **Cache Wikipedia compartilhado** entre `Imagem.jsx`, `WikiExtract` e `MapaRoteiro` — não dispara fetch duplicado.
- **Acessibilidade no PassoDias**: drag-and-drop tem fallback de setas ↑↓ para quem não consegue arrastar.

---

## 7. Regras para futuras alterações

1. **Sempre ler este `PROJECT_CONTEXT.md` antes de tocar em qualquer arquivo.** Se algo aqui ficou obsoleto, atualize antes de codar.
2. **Mantenha a UI em PT-BR.** Inclusive nomes de variáveis e funções novas. Espelhe o padrão de `cidadesSelecionadas`, `toggleCidade`, `setOrcamento` etc.
3. **Não introduzir backend, autenticação, banco de dados.** Persistência permanece em localStorage + PDF + link compartilhável.
4. **Imagens: APENAS arquivos locais em `/public/images/`.** Sem Wikipedia, sem SVG ilustrado, sem placeholder. Manifesto em `src/data/imagensLocais.js` mapeia cada ID ao path real do arquivo (preservando o nome original do arquivo, qualquer extensão). ID sem entrada = card mostra bloco cream-200 neutro (sem fingir conteúdo). Adicionar imagem: salva o arquivo em `/public/images/{tipo}/`, adiciona linha no manifesto correspondente. Wikipedia segue usada SÓ para texto auxiliar (popup, expander). NUNCA reintroduzir fetch de imagem.
5. **Custos**: qualquer mudança de cálculo precisa preservar a regra “transporte fora dos cards por cidade, alimentação por cidade”. Comente o motivo se mexer.
6. **Datas**: use os helpers de `utils/datas.js` (parse manual). Nunca `new Date('YYYY-MM-DD')` direto.
7. **Antes de adicionar dependência nova**, considere se Tailwind/lucide/framer-motion já cobrem.
8. **Reutilize** `Botao`, `Tag`, `Imagem`, `Avaliacao`, `WikiExtract` e as classes `card-base`/`btn-base`/`input-base`. Não duplicar estilos.
9. **ViagemContext é a fonte única de verdade**. Estado novo da viagem entra lá, não em estado local de componente.
10. **Comentários só quando o porquê não é óbvio** (ex.: bug histórico, decisão de produto, invariante sutil). O código deve se explicar por nomes.
11. **Não criar arquivos `.md` adicionais sem pedido explícito**. Este é o único arquivo de contexto do projeto.
12. **Banca-ready**: cada feature nova precisa ser demonstrável em <30s. Se exige setup, está fora do escopo do TCC.

---

## 8. Funcionalidades em andamento / pontos de atenção

Estado em 2026-05-16:

- **PDF + Leaflet** ✅ resolvido: `exportarPdf.js` adiciona `body.tripwf-exporting` antes de chamar html2canvas. CSS em `index.css` esconde `.leaflet-container` e revela `.mapa-pdf-fallback` (overlay estático já no DOM de `MapaRoteiro`, com gradient + rota textual `Paris → Roma → Lisboa` + distância total). `requestAnimationFrame` duplo garante que o CSS aplique antes do snapshot. Classe é removida no `finally`. Sem dependência externa, sem tainted canvas.
- **`Hero.jsx`** ✅ dinâmico: importa `useViagem`. Se `dadosViagem.length > 0`, mostra primeiras 3 cidades reais + total real (`totais.custoTotal`) + badge "Seu roteiro" + CTA "Ver roteiro completo". Senão mostra exemplo Paris/Roma/Lisboa com badge `Exemplo` visível. Usa `formatarEUR`/`formatarBRL` em vez de hardcoded.
- **Sugestão automática só dispara na 1ª abertura** de uma cidade. Se o usuário limpar manualmente uma escolha, não auto-preenche de novo — comportamento intencional, mas pode confundir.

---

## 9. Próximos passos (sugestões a confirmar com o usuário)

Nenhum desses está em execução; cabe ao usuário priorizar antes da banca.

1. **Polimento pré-banca** (concluído 2026-05-16)
   - ✅ Aparato debug removido de `wikiImagem.js`
   - ✅ PDF: fallback estático do mapa via `body.tripwf-exporting` + `.mapa-pdf-fallback`
   - ✅ `Hero.jsx`: preview dinâmico do roteiro real ou exemplo marcado com badge
2. **Robustez de imagens**
   - Refinar `POOL_HOSPEDAGEM` para incluir hostels reais com artigo Wikipedia
   - Considerar `wiki` específico para hospedagens que ainda caem no pool
3. **Acessibilidade**
   - Auditar foco visível em todos os controles
   - Testar leitor de tela no `PassosIndicador` e `PassoDias`
4. **UX**
   - Estado vazio do roteiro poderia mostrar preview de um roteiro de exemplo
   - Botão “Limpar” na `PaginaRoteiro` confirma antes de apagar tudo?
5. **TCC**
   - Slides / capítulos da monografia / vídeo demo
   - Checklist de demonstração para a banca

---

## 10. Como retomar trabalho (rápido)

```bash
cd C:/Users/leo_m/OneDrive/Desktop/TCC
npm install        # se necessário
npm run dev        # Vite em http://localhost:5173 (abre automaticamente)
npm run build      # build de produção
npm run preview    # preview do build
```

O estado da viagem persiste em `localStorage.viagem-europa`. Para começar do zero, abra o DevTools → Application → Local Storage e remova a chave (ou use o botão “Limpar” em `/roteiro`).
