// =====================================================================
//  INIMIGO VOADOR
//  Patrulha horizontalmente e dispara projéteis letais.
//  Parâmetros: velocidade, distanciaPatrulha, limites, intervaloDisparo,
//  velocidadeProjetil e direcaoDisparo ('jogador', 'frenteBaixo' ou
//  'lequeBaixo').
// =====================================================================
registrarInimigo('voador', {
  preparar(inimigo) {
    definirPadrao(inimigo, 'largura', INIMIGO_TAMANHOS.voador.largura);
    definirPadrao(inimigo, 'altura', INIMIGO_TAMANHOS.voador.altura);
    definirPadrao(inimigo, 'velocidade', VELOCIDADE_VOADOR);
    definirPadrao(inimigo, 'distanciaPatrulha', 100);
    definirPadrao(inimigo, 'intervaloDisparo', INTERVALO_DISPARO_VOADOR);
    definirPadrao(inimigo, 'velocidadeProjetil', 4);
    definirPadrao(inimigo, 'direcaoDisparo', fase.direcaoDisparoInimigos || 'jogador');
    inimigo.xInicial = inimigo.x;
    inimigo.yInicial = inimigo.y;
    inimigo.limiteEsquerdo = inimigo.limiteEsquerdo === undefined
      ? Math.max(0, inimigo.x - inimigo.distanciaPatrulha)
      : inimigo.limiteEsquerdo;
    inimigo.limiteDireito = inimigo.limiteDireito === undefined
      ? Math.min(LARGURA_TELA - inimigo.largura, inimigo.x + inimigo.distanciaPatrulha)
      : inimigo.limiteDireito;
    inimigo.direcao = inimigo.direcao === -1 ? -1 : 1;
    inimigo.direcaoInicial = inimigo.direcao;
    inimigo.contadorDisparo = 0;
    inimigo.projeteis = [];
  },

  atualizar(inimigo) {
    // Patrulha entre os limites configurados e inverte ao alcançá-los.
    inimigo.x += inimigo.velocidade * inimigo.direcao;
    if (inimigo.x <= inimigo.limiteEsquerdo || inimigo.x >= inimigo.limiteDireito) {
      inimigo.x = Math.max(inimigo.limiteEsquerdo, Math.min(inimigo.x, inimigo.limiteDireito));
      inimigo.direcao *= -1;
    }

    inimigo.contadorDisparo++;
    if (inimigo.contadorDisparo >= inimigo.intervaloDisparo) {
      inimigo.contadorDisparo = 0;
      this.disparar(inimigo);
    }

    // Remove projéteis que já saíram da área visível.
    for (let i = inimigo.projeteis.length - 1; i >= 0; i--) {
      const projetil = inimigo.projeteis[i];
      projetil.x += projetil.vx;
      projetil.y += projetil.vy;
      if (projetil.x + projetil.largura < 0 || projetil.x > LARGURA_TELA ||
          projetil.y + projetil.altura < 0 || projetil.y > ALTURA_TELA) {
        inimigo.projeteis.splice(i, 1);
      }
    }
  },

  disparar(inimigo) {
    const origemX = inimigo.x + inimigo.largura / 2 - 4;
    const origemY = inimigo.y + inimigo.altura / 2 - 4;

    if (inimigo.direcaoDisparo === 'lequeBaixo') {
      // Dispara sete projéteis em leque, cobrindo o chão da esquerda à direita.
      const quantidade = 7;
      const anguloInicial = Math.PI / 7;
      const passoAngular = (Math.PI - anguloInicial * 2) / (quantidade - 1);

      for (let i = 0; i < quantidade; i++) {
        const angulo = anguloInicial + passoAngular * i;
        inimigo.projeteis.push({
          x: origemX,
          y: origemY,
          largura: 8,
          altura: 8,
          vx: Math.cos(angulo) * inimigo.velocidadeProjetil,
          vy: Math.sin(angulo) * inimigo.velocidadeProjetil
        });
      }
      return;
    }

    const projetil = {
      x: origemX,
      y: origemY,
      largura: 8,
      altura: 8,
      vx: 0,
      vy: 0
    };

    // O disparo pode mirar no jogador ou seguir para frente e para baixo.
    if (inimigo.direcaoDisparo === 'frenteBaixo') {
      projetil.vx = inimigo.velocidadeProjetil * inimigo.direcao;
      projetil.vy = inimigo.velocidadeProjetil * 0.5;
    } else {
      const dx = jogador.x + jogador.largura / 2 - (projetil.x + projetil.largura / 2);
      const dy = jogador.y + jogador.altura / 2 - (projetil.y + projetil.altura / 2);
      const distancia = Math.sqrt(dx * dx + dy * dy) || 1;
      projetil.vx = dx / distancia * inimigo.velocidadeProjetil;
      projetil.vy = dy / distancia * inimigo.velocidadeProjetil;
    }

    inimigo.projeteis.push(projetil);
  },

  mata(inimigo) {
    for (let i = 0; i < inimigo.projeteis.length; i++) {
      if (colidiu(jogador, inimigo.projeteis[i])) return true;
    }
    return colidiu(jogador, inimigo);
  },

  desenhar(inimigo) {
    desenharRetangulo(inimigo, '#8e44ad');
    for (let i = 0; i < inimigo.projeteis.length; i++) {
      desenharRetangulo(inimigo.projeteis[i], '#ff9f1c');
    }
  },

  resetar(inimigo) {
    inimigo.x = inimigo.xInicial;
    inimigo.y = inimigo.yInicial;
    inimigo.direcao = inimigo.direcaoInicial;
    inimigo.contadorDisparo = 0;
    inimigo.projeteis = [];
  }
});
