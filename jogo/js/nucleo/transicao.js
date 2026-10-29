// =====================================================================
//  TRANSIÇÃO ENTRE FASES (estilo MOSAICO)
//  1) "fechando": quadradinhos pretos/vermelhos vão crescendo pela tela em ordem aleatória
//  2) "cartao":   tela preta com "FASE X" entrando pela esquerda e o nome pela direita
//  3) "abrindo":  os quadradinhos encolhem e somem, mostrando a fase nova
//  Durante a transição o jogo fica parado (nada se mexe, a espada não bate).
//  O tempo da transição NÃO conta pontos (a fase nova nasce congelada).
// =====================================================================
const TRANSICAO_FECHAR = 40;    // frames do mosaico fechando (60 frames = 1 segundo)
const TRANSICAO_CARTAO = 75;    // frames mostrando "FASE X"
const TRANSICAO_ABRIR = 40;     // frames do mosaico abrindo
const TRANSICAO_TAMANHO = 50;   // tamanho de cada quadradinho em pixels

const transicao = {
  ativa: false,
  etapa: '',          // 'fechando', 'cartao' ou 'abrindo'
  tempo: 0,           // frames dentro da etapa atual
  proximaFase: 0,     // índice da fase que vai carregar (FASES.length = acabou o jogo)
  pontosGanhos: 0,    // pontos da fase que acabou de ser concluída (aparece no cartão)
  quadrados: []       // cada um: { x, y, atraso, cor }
};

// Cria a grade de quadradinhos, cada um com um atraso aleatório (0 a 0.5)
function criarQuadradosDaTransicao() {
  const t = TRANSICAO_TAMANHO;
  const lista = [];
  for (let y = 0; y < ALTURA_TELA; y += t) {
    for (let x = 0; x < LARGURA_TELA; x += t) {
      lista.push({
        x: x,
        y: y,
        atraso: Math.random() * 0.5,
        cor: Math.random() < 0.25 ? '#8b1e2b' : '#000'      // alguns vermelho-escuros
      });
    }
  }
  transicao.quadrados = lista;
}

// Começa a transição. Chamada pelo passarDeFase().
function iniciarTransicao(proximaFase, pontosGanhos) {
  if (transicao.ativa) return;
  transicao.ativa = true;
  transicao.etapa = 'fechando';
  transicao.tempo = 0;
  transicao.proximaFase = proximaFase;
  transicao.pontosGanhos = pontosGanhos;
  criarQuadradosDaTransicao();
}

// Roda uma vez por frame no lugar do atualizarJogo() enquanto a transição está ativa
function atualizarTransicao() {
  transicao.tempo++;

  if (transicao.etapa === 'fechando' && transicao.tempo >= TRANSICAO_FECHAR) {
    if (transicao.proximaFase >= FASES.length) {      // era a última fase
      transicao.ativa = false;
      terminarJogo();
      return;
    }
    carregarFase(transicao.proximaFase);              // a tela está coberta, dá pra trocar
    transicao.etapa = 'cartao';
    transicao.tempo = 0;
  } else if (transicao.etapa === 'cartao' && transicao.tempo >= TRANSICAO_CARTAO) {
    criarQuadradosDaTransicao();                      // novos atrasos pra abertura ser diferente
    transicao.etapa = 'abrindo';
    transicao.tempo = 0;
  } else if (transicao.etapa === 'abrindo' && transicao.tempo >= TRANSICAO_ABRIR) {
    transicao.ativa = false;
    transicao.etapa = '';
  }
}

// Segura o valor entre 0 e 1
function limitar01(v) {
  return Math.max(0, Math.min(1, v));
}

// Começa rápido e termina devagar
function suavizarSaida(t) {
  return 1 - Math.pow(1 - t, 3);
}

// progresso: 0 = nenhum quadrado, 1 = tela toda coberta
function desenharMosaico(progresso) {
  const t = TRANSICAO_TAMANHO;
  for (let i = 0; i < transicao.quadrados.length; i++) {
    const q = transicao.quadrados[i];
    const crescimento = suavizarSaida(limitar01((progresso - q.atraso) / 0.5));
    if (crescimento <= 0) continue;

    const lado = Math.ceil(t * crescimento) + 1;          // +1 evita frestinhas entre os quadrados
    ctx.fillStyle = q.cor;
    ctx.fillRect(q.x + (t - lado) / 2, q.y + (t - lado) / 2, lado, lado);
  }
}

function desenharCartaoDaFase() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA);

  // Entrada (primeiros 20 frames) e saída (últimos 15 frames) dos textos
  const entrada = suavizarSaida(limitar01(transicao.tempo / 20));
  const saida = limitar01((transicao.tempo - (TRANSICAO_CARTAO - 15)) / 15);
  const alfa = 1 - saida;

  const meio = LARGURA_TELA / 2;
  const deslocamento = (1 - entrada) * 250;               // quanto falta pra chegar no centro

  ctx.save();
  ctx.globalAlpha = alfa;
  ctx.textAlign = 'center';

  // "FASE X" entra pela esquerda
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('FASE ' + (numeroFase + 1), meio - deslocamento, ALTURA_TELA / 2 - 10);

  // O nome da fase entra pela direita
  ctx.fillStyle = '#e63946';
  ctx.font = '24px sans-serif';
  ctx.fillText(fase.nome, meio + deslocamento, ALTURA_TELA / 2 + 30);

  // Detalhes embaixo aparecem por último
  ctx.globalAlpha = alfa * entrada;
  ctx.fillStyle = '#888';
  ctx.font = '16px sans-serif';
  ctx.fillText((numeroFase + 1) + ' / ' + FASES.length, meio, ALTURA_TELA / 2 + 60);
  ctx.fillText('+' + transicao.pontosGanhos + ' pontos', meio, ALTURA_TELA / 2 + 85);
  ctx.restore();
}

// Desenha por CIMA do jogo (chamada no loopDoJogo, depois do desenharJogo)
function desenharTransicao() {
  if (!transicao.ativa) return;

  if (transicao.etapa === 'fechando') {
    desenharMosaico(transicao.tempo / TRANSICAO_FECHAR);
  } else if (transicao.etapa === 'cartao') {
    desenharCartaoDaFase();
  } else if (transicao.etapa === 'abrindo') {
    desenharMosaico(1 - transicao.tempo / TRANSICAO_ABRIR);
  }
}