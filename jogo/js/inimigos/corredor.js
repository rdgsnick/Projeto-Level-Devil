// =====================================================================
//  INIMIGO CORREDOR
//  Corre pela plataforma e inverte em paredes, bordas e abismos.
//  Parâmetros: velocidade e direcao inicial (-1 para esquerda, 1 para direita).
// =====================================================================
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
  },

  atualizar(inimigo) {
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
    desenharRetangulo(inimigo, '#d35400');
  },

  resetar(inimigo) {
    inimigo.x = inimigo.xInicial;
    inimigo.y = inimigo.yInicial;
    inimigo.direcao = inimigo.direcaoInicial < 0 ? -1 : 1;
  }
});
