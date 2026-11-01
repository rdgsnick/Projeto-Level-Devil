// =====================================================================
//  INIMIGO CORREDOR
//  Corre pela plataforma e inverte em paredes, bordas e abismos.
//  Parâmetros: velocidade e direcao inicial (-1 para esquerda, 1 para direita).
//
//  Animações (desenhos em img/inimigos/corredor/):
//    parado + andando  -> se alternam enquanto ele corre (com um quiquinho por passo)
//    ataque1 -> ataque2 -> quando o gato chega perto, ele levanta e balança o taco
//  O balanço do taco é só VISUAL: quem mata o gato continua sendo o corpo (mata()).
// =====================================================================
const CORREDOR_IMAGENS = {
  parado:  obterImagem('img/inimigos/corredor/parado.png'),
  andando: obterImagem('img/inimigos/corredor/andando.png'),
  preparo: obterImagem('img/inimigos/corredor/ataque1.png'),   // levantando o taco
  golpe:   obterImagem('img/inimigos/corredor/ataque2.png')    // golpeando
};

// Pra que lado cada desenho original está virado (1 = direita, -1 = esquerda, 0 = de frente).
// Se você redesenhar alguma imagem virada pro outro lado, troque aqui.
const CORREDOR_LADO_DO_DESENHO = { parado: 0, andando: -1, preparo: 1, golpe: -1 };

function zerarAnimacaoCorredor(inimigo) {
  inimigo.tempoAnimacao = 0;      // frames andando (só anda quando a fase está rodando)
  inimigo.ataque = 'nenhum';      // 'nenhum' | 'preparo' | 'golpe'
  inimigo.tempoAtaque = 0;
  inimigo.recargaAtaque = 0;
  inimigo.virado = inimigo.direcao;
}

registrarInimigo('corredor', {
  preparar(inimigo) {
    definirPadrao(inimigo, 'largura', INIMIGO_TAMANHOS.corredor.largura);
    definirPadrao(inimigo, 'altura', INIMIGO_TAMANHOS.corredor.altura);
    definirPadrao(inimigo, 'velocidade', VELOCIDADE_CORREDOR);
    definirPadrao(inimigo, 'direcao', 1);
    inimigo.xInicial = inimigo.x;
    inimigo.yInicial = inimigo.y;
    inimigo.direcao = inimigo.direcao < 0 ? -1 : 1;
    inimigo.direcaoInicial = inimigo.direcao;
    inimigo.noChao = true;
    zerarAnimacaoCorredor(inimigo);
  },

  // Decide se o corredor deve balançar o taco (gato perto, na frente e na mesma altura)
  atualizarAtaque(inimigo) {
    if (inimigo.recargaAtaque > 0) inimigo.recargaAtaque--;

    if (inimigo.ataque === 'nenhum') {
      const dx = (jogador.x + jogador.largura / 2) - (inimigo.x + inimigo.largura / 2);
      const dy = (jogador.y + jogador.altura) - (inimigo.y + inimigo.altura);   // diferença entre os pés
      const perto = Math.abs(dx) <= CORREDOR_ATAQUE_ALCANCE_X && Math.abs(dy) <= CORREDOR_ATAQUE_ALCANCE_Y;
      if (perto && inimigo.recargaAtaque === 0 && !jogador.morto) {
        inimigo.ataque = 'preparo';
        inimigo.tempoAtaque = CORREDOR_ATAQUE_PREPARO;
        inimigo.virado = dx < 0 ? -1 : 1;           // olha pro gato enquanto ataca
      }
      return;
    }

    inimigo.tempoAtaque--;
    if (inimigo.tempoAtaque > 0) return;
    if (inimigo.ataque === 'preparo') {
      inimigo.ataque = 'golpe';
      inimigo.tempoAtaque = CORREDOR_ATAQUE_GOLPE;
    } else {
      inimigo.ataque = 'nenhum';
      inimigo.recargaAtaque = CORREDOR_ATAQUE_RECARGA;
    }
  },

  atualizar(inimigo) {
    this.atualizarAtaque(inimigo);
    inimigo.tempoAnimacao++;
    if (inimigo.ataque === 'nenhum') inimigo.virado = inimigo.direcao;   // andando: olha pra onde corre

    const anteriorX = inimigo.x;
    inimigo.x += inimigo.velocidade * inimigo.direcao;

    // Os limites laterais da tela também contam como paredes.
    if (inimigo.x < 0 || inimigo.x + inimigo.largura > LARGURA_TELA) {
      inimigo.x = anteriorX;
      inimigo.direcao *= -1;
      return;
    }

    const solidos = listarSolidos();
    for (let i = 0; i < solidos.length; i++) {
      if (colidiu(inimigo, solidos[i])) {
        inimigo.x = anteriorX;
        inimigo.direcao *= -1;
        return;
      }
    }

    // Verifica se existe chão logo adiante antes de continuar a patrulha.
    const xFrente = inimigo.direcao > 0
      ? inimigo.x + inimigo.largura + 1
      : inimigo.x - 1;
    let temChao = false;
    for (let i = 0; i < solidos.length; i++) {
      const solido = solidos[i];
      const alturaPertoDosPes = solido.y >= inimigo.y + inimigo.altura - 2 &&
        solido.y <= inimigo.y + inimigo.altura + 8;
      if (alturaPertoDosPes && xFrente >= solido.x && xFrente <= solido.x + solido.largura) {
        temChao = true;
        break;
      }
    }

    if (!temChao) {
      inimigo.x = anteriorX;
      inimigo.direcao *= -1;
    }
  },

  mata(inimigo) {
    return colidiu(jogador, inimigo);
  },

  desenhar(inimigo) {
    // Escolhe o desenho: ataque tem prioridade, senão alterna parado/andando
    let nome;
    if (inimigo.ataque === 'preparo') nome = 'preparo';
    else if (inimigo.ataque === 'golpe') nome = 'golpe';
    else nome = Math.floor(inimigo.tempoAnimacao / CORREDOR_FRAMES_POR_PASSO) % 2 === 0 ? 'andando' : 'parado';

    const imagem = CORREDOR_IMAGENS[nome];
    if (!imagemPronta(imagem)) {
      desenharRetangulo(inimigo, '#d35400');      // plano B: a imagem não carregou
      return;
    }

    const altura = CORREDOR_ALTURA_SPRITE;
    const largura = altura * imagem.naturalWidth / imagem.naturalHeight;
    const ladoOriginal = CORREDOR_LADO_DO_DESENHO[nome];
    const espelhar = ladoOriginal !== 0 && inimigo.virado !== ladoOriginal;

    // quiquinho a cada passo (só quando está andando)
    const sobe = inimigo.ataque === 'nenhum'
      ? Math.abs(Math.sin(inimigo.tempoAnimacao / CORREDOR_FRAMES_POR_PASSO * Math.PI)) * 2
      : 0;

    ctx.save();
    ctx.imageSmoothingEnabled = false;            // mantém o pixel art nítido
    ctx.translate(inimigo.x + inimigo.largura / 2, inimigo.y + inimigo.altura - sobe);   // pés do corredor
    ctx.scale(espelhar ? -1 : 1, 1);
    ctx.drawImage(imagem, -largura / 2, -altura, largura, altura);
    ctx.restore();
  },

  resetar(inimigo) {
    inimigo.x = inimigo.xInicial;
    inimigo.y = inimigo.yInicial;
    inimigo.direcao = inimigo.direcaoInicial < 0 ? -1 : 1;
    zerarAnimacaoCorredor(inimigo);
  }
});