// =====================================================================
//  DESENHO NA TELA
// =====================================================================
function desenharRetangulo(r, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(r.x, r.y, r.largura, r.altura);
}

// Imagem de fundo da fase (a fase pode ter a sua com  cenario: 'img/cenario/outro.jpg')
function desenharCenario() {
  const imagem = obterImagem(fase.cenario || CENARIO_PADRAO);
  if (imagemPronta(imagem)) {
    ctx.drawImage(imagem, 0, 0, LARGURA_TELA, ALTURA_TELA);
  } else {
    ctx.fillStyle = '#33c6ff';          // céu azul, caso a imagem não carregue
    ctx.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA);
  }
}

// Chão de terra com grama em cima
function desenharChao(r) {
  ctx.fillStyle = '#7a4b2a';
  ctx.fillRect(r.x, r.y, r.largura, r.altura);
  ctx.fillStyle = '#3fae3a';
  ctx.fillRect(r.x, r.y, r.largura, Math.min(8, r.altura));
  ctx.fillStyle = '#2f8f2c';
  ctx.fillRect(r.x, r.y + Math.min(8, r.altura) - 2, r.largura, 2);
}

// ---------------------------------------------------------------------
//  PEDRA
//  Bloco de pedra (usado nos tetos baixos e nas paredes): pedras de tamanhos
//  diferentes, contorno escuro e musgo no topo, nas cores do desenho da pedra.
//  Ele preenche o bloco INTEIRO (o que você vê é exatamente onde o gato bate).
//  O desenho é montado uma vez por bloco e guardado, então não pesa no jogo.
// ---------------------------------------------------------------------
const PEDRA_PIXEL = 3;                                  // tamanho de cada "pixel" do desenho (maior = mais grosso)
const PEDRA_CONTORNO = '#1c0f1e';
const PEDRA_CORES = ['#6a5f5d', '#5f5656', '#564e51', '#4b444a'];   // as pedras (sorteadas)
const PEDRA_LUZ = '#7d7370';                            // quina de cima/esquerda de cada pedra
const PEDRA_SOMBRA = '#3b333a';                         // quina de baixo/direita de cada pedra
const PEDRA_MUSGO = ['#bacd35', '#8ea82b'];             // musgo claro e escuro
const PEDRA_ALTURA_FILEIRA = [5, 7];                    // altura das fileiras de pedra, em "pixels" (mínimo, máximo)
const PEDRA_LARGURA_PEDRA = [8, 16];                    // largura de cada pedra, em "pixels" (mínimo, máximo)

const PEDRAS_PRONTAS = {};

// Sorteio com semente: o mesmo bloco sempre sai igual (não fica piscando)
function sorteadorComSemente(semente) {
  let n = semente >>> 0;
  return function () {
    n = (n + 0x6D2B79F5) >>> 0;
    let t = n;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function montarPedra(r) {
  const U = PEDRA_PIXEL;
  const cols = Math.max(1, Math.ceil(r.largura / U));
  const linhas = Math.max(1, Math.ceil(r.altura / U));
  const tela = document.createElement('canvas');
  tela.width = cols * U;
  tela.height = linhas * U;
  const c = tela.getContext('2d');
  const sorteio = sorteadorComSemente(Math.round(r.x * 7 + r.y * 13 + r.largura * 17 + r.altura * 19));
  const entre = (par) => par[0] + Math.floor(sorteio() * (par[1] - par[0] + 1));
  const quadrado = (x, y, w, h, cor) => { c.fillStyle = cor; c.fillRect(x * U, y * U, w * U, h * U); };

  // fundo (cor do contorno: as frestas entre as pedras ficam escuras)
  quadrado(0, 0, cols, linhas, PEDRA_CONTORNO);

  // fileiras de pedras, cada uma começando num ponto diferente (como um muro de pedra solta)
  let y = 0;
  while (y < linhas) {
    const alt = Math.min(entre(PEDRA_ALTURA_FILEIRA), linhas - y);
    let x = -Math.floor(sorteio() * PEDRA_LARGURA_PEDRA[1]);
    while (x < cols) {
      const larg = entre(PEDRA_LARGURA_PEDRA);
      const x0 = Math.max(x, 0);
      const x1 = Math.min(x + larg, cols);
      // 1 "pixel" de fresta em volta de cada pedra
      const px = x0 + (x < 0 ? 0 : 1), py = y + 1;
      const pw = x1 - px - 0, ph = alt - 1;
      if (pw > 1 && ph > 1) {
        quadrado(px, py, pw, ph, PEDRA_CORES[Math.floor(sorteio() * PEDRA_CORES.length)]);
        quadrado(px, py, pw, 1, PEDRA_LUZ);             // luz em cima
        quadrado(px, py, 1, ph, PEDRA_LUZ);             // luz na esquerda
        quadrado(px, py + ph - 1, pw, 1, PEDRA_SOMBRA); // sombra embaixo
        quadrado(px + pw - 1, py, 1, ph, PEDRA_SOMBRA); // sombra na direita
        if (sorteio() < 0.35 && pw > 5 && ph > 3) {      // um riscadinho de brilho, como na pedra do desenho
          quadrado(px + 2, py + 2, Math.min(3, pw - 4), 1, PEDRA_LUZ);
        }
      }
      x += larg;
    }
    y += alt;
  }

  // musgo no topo, com algumas gotinhas escorrendo
  for (let i = 0; i < cols; i++) {
    const fundo = 1 + Math.floor(sorteio() * 2) + (sorteio() < 0.22 ? 2 + Math.floor(sorteio() * 2) : 0);
    quadrado(i, 0, 1, Math.min(fundo + 1, linhas), PEDRA_MUSGO[0]);
    if (sorteio() < 0.5) quadrado(i, Math.min(fundo, linhas - 1), 1, 1, PEDRA_MUSGO[1]);
  }

  // contorno escuro em volta do bloco todo
  quadrado(0, linhas - 1, cols, 1, PEDRA_CONTORNO);
  quadrado(0, 0, 1, linhas, PEDRA_CONTORNO);
  quadrado(cols - 1, 0, 1, linhas, PEDRA_CONTORNO);

  return tela;
}

function desenharPedra(r) {
  const chave = r.largura + 'x' + r.altura + '@' + r.x + ',' + r.y;
  if (!PEDRAS_PRONTAS[chave]) PEDRAS_PRONTAS[chave] = montarPedra(r);

  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.largura, r.altura);
  ctx.clip();                                   // corta o que passar do bloco (largura que não divide certinho)
  ctx.imageSmoothingEnabled = false;            // mantém o pixel art nítido
  ctx.drawImage(PEDRAS_PRONTAS[chave], r.x, r.y);
  ctx.restore();
}

// Plataforma da fase: terra com grama, ou pedra se tiver  estilo: 'pedra'
function desenharPlataforma(p) {
  if (p.estilo === 'pedra') {
    desenharPedra(p);
  } else {
    desenharChao(p);
  }
}

// Imagem do espinho (se você mudar a pasta ou o nome, é só trocar aqui)
const ESPINHO_IMAGEM = 'img/cenario/espinho.png';

// Desenha a imagem do espinho. Retorna false se a imagem ainda não carregou.
// paraBaixo = true vira a imagem de cabeça pra baixo (espinhos do teto)
function desenharSpriteDeEspinho(a, paraBaixo) {
  const imagem = obterImagem(ESPINHO_IMAGEM);
  if (!imagemPronta(imagem)) return false;

  // Quantas imagens cabem na largura do espinho, sem esticar demais
  const proporcao = imagem.naturalWidth / imagem.naturalHeight;
  const quantos = Math.max(1, Math.round(a.largura / (a.altura * proporcao)));
  const larguraCada = a.largura / quantos;

  ctx.save();
  ctx.imageSmoothingEnabled = false;      // mantém o pixel art nítido
  for (let i = 0; i < quantos; i++) {
    const centroX = a.x + i * larguraCada + larguraCada / 2;
    const centroY = a.y + a.altura / 2;

    ctx.save();
    ctx.translate(centroX, centroY);
    if (paraBaixo) ctx.scale(1, -1);
    ctx.drawImage(imagem, -larguraCada / 2, -a.altura / 2, larguraCada, a.altura);
    ctx.restore();
  }
  ctx.restore();
  return true;
}

// Espinhos do chão (apontando pra cima)
function desenharEspinhosParaCima(a) {
  if (desenharSpriteDeEspinho(a, false)) return;

  // Plano B: triângulos, caso a imagem não carregue
  ctx.fillStyle = '#e63946';
  for (let x = a.x; x < a.x + a.largura; x = x + 10) {
    ctx.beginPath();
    ctx.moveTo(x, a.y + a.altura);
    ctx.lineTo(x + 5, a.y);
    ctx.lineTo(x + 10, a.y + a.altura);
    ctx.fill();
  }
}

// Espinhos do teto (apontando pra baixo)
function desenharEspinhosParaBaixo(a) {
  if (desenharSpriteDeEspinho(a, true)) return;

  // Plano B: triângulos, caso a imagem não carregue
  ctx.fillStyle = '#e63946';
  for (let x = a.x; x < a.x + a.largura; x = x + 10) {
    ctx.beginPath();
    ctx.moveTo(x, a.y);
    ctx.lineTo(x + 10, a.y);
    ctx.lineTo(x + 5, a.y + a.altura);
    ctx.fill();
  }
}

function desenharEscuridao() {
  const centroX = jogador.x + jogador.largura / 2;
  const centroY = jogador.y + jogador.altura / 2;
  const degrade = ctx.createRadialGradient(centroX, centroY, 30, centroX, centroY, 140);
  degrade.addColorStop(0, 'rgba(0,0,0,0)');     // perto do jogador: transparente
  degrade.addColorStop(1, 'rgba(0,0,0,1)');     // longe: preto total
  ctx.fillStyle = degrade;
  ctx.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA);
}

function desenharTextos() {
  const agora = faseIniciada ? performance.now() : congeladoDesde;      // parada = o relógio não anda
  const segundos = ((agora - inicioDaFase) / 1000).toFixed(1);

  ctx.fillStyle = 'rgba(0,0,0,0.45)';          // faixa escura pro texto ficar legível em cima do céu
  ctx.fillRect(0, 0, LARGURA_TELA, 56);

  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.fillText(
    apelido + ' | Fase ' + (numeroFase + 1) + '/' + FASES.length +
    ' | Mortes: ' + mortesTotais + ' | Tempo: ' + segundos + 's | Pontos: ' + pontosTotais,
    10, 24);

  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'center';
  ctx.fillText(fase.nome, LARGURA_TELA / 2, 48);

  // Aviso enquanto a fase está parada
  if (!faseIniciada && !jogador.morto) {
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.strokeText('Mexa-se para começar', LARGURA_TELA / 2, 90);
    ctx.fillText('Mexa-se para começar', LARGURA_TELA / 2, 90);
  }
}

// Desenha tudo, na ordem: cenário, chão, armadilhas, inimigos, porta, jogador, espada, escuridão, textos
function desenharJogo() {
  ctx.clearRect(0, 0, LARGURA_TELA, ALTURA_TELA);
  desenharCenario();

  for (let i = 0; i < fase.plataformas.length; i++) {
    desenharPlataforma(fase.plataformas[i]);
  }

  desenharArmadilhas();
  desenharInimigos();
  desenharPorta(fase.porta);
  desenharJogador();
  desenharAtaqueEspada();

  if (fase.escuro) {
    desenharEscuridao();
  }

  desenharTextos();      // por último, pra ficar por cima da escuridão
}