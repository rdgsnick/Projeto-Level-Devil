// =====================================================================
//  INIMIGO SUICIDA
//  Detecta e persegue o jogador; ao chegar perto, inicia a contagem da explosão.
//  Parâmetros: velocidade, raioDeteccao, distanciaExplosao, tempoExplosao
//  e tamanhoBloco.
// =====================================================================
registrarInimigo('suicida', {
  preparar(inimigo) {
    definirPadrao(inimigo, 'largura', INIMIGO_TAMANHOS.suicida.largura);
    definirPadrao(inimigo, 'altura', INIMIGO_TAMANHOS.suicida.altura);
    definirPadrao(inimigo, 'velocidade', VELOCIDADE_SUICIDA);
    definirPadrao(inimigo, 'raioDeteccao', 180);
    definirPadrao(inimigo, 'distanciaExplosao', 28);
    definirPadrao(inimigo, 'tempoExplosao', 30);
    definirPadrao(inimigo, 'tamanhoBloco', TAMANHO_BLOCO);
    definirPadrao(inimigo, 'duracaoVisualExplosao', 12);
    inimigo.xInicial = inimigo.x;
    inimigo.yInicial = inimigo.y;
    inimigo.ativo = false;
    inimigo.explodindo = false;
    inimigo.explodiu = false;
    inimigo.contagemExplosao = 0;
    inimigo.areaResolvida = false;
    inimigo.tempoVisualExplosao = 0;
  },

  atualizar(inimigo) {
    if (inimigo.explodiu) {
      if (inimigo.tempoVisualExplosao > 0) inimigo.tempoVisualExplosao--;
      return;
    }

    // Durante a contagem, o inimigo para e aguarda a explosão.
    if (inimigo.explodindo) {
      inimigo.contagemExplosao++;
      if (inimigo.contagemExplosao >= inimigo.tempoExplosao) {
        inimigo.explodiu = true;
        inimigo.tempoVisualExplosao = inimigo.duracaoVisualExplosao;
      }
      return;
    }

    const dx = jogador.x + jogador.largura / 2 - (inimigo.x + inimigo.largura / 2);
    const dy = jogador.y + jogador.altura / 2 - (inimigo.y + inimigo.altura / 2);
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (!inimigo.ativo && distancia <= inimigo.raioDeteccao) {
      inimigo.ativo = true;
    }

    if (!inimigo.ativo) return;

    if (colidiu(jogador, inimigo) || distancia <= inimigo.distanciaExplosao) {
      inimigo.explodindo = true;
      inimigo.contagemExplosao = 0;
      return;
    }

    if (distancia > 0) {
      inimigo.x += dx / distancia * inimigo.velocidade;
      inimigo.y += dy / distancia * inimigo.velocidade;
    }
  },

  mata(inimigo) {
    if (!inimigo.explodiu || inimigo.areaResolvida) return false;
    inimigo.areaResolvida = true;
    inimigo.deveRemover = true;

    // A área quadrada se estende dois blocos a partir do centro da explosão.
    const raio = inimigo.tamanhoBloco * 2;
    const area = {
      x: inimigo.x + inimigo.largura / 2 - raio,
      y: inimigo.y + inimigo.altura / 2 - raio,
      largura: raio * 2,
      altura: raio * 2
    };
    return colidiu(jogador, area);
  },

  desenhar(inimigo) {
    if (inimigo.explodiu) {
      if (inimigo.tempoVisualExplosao > 0) {
        const raio = inimigo.tamanhoBloco * 2;
        ctx.fillStyle = 'rgba(255, 204, 0, 0.45)';
        ctx.fillRect(
          inimigo.x + inimigo.largura / 2 - raio,
          inimigo.y + inimigo.altura / 2 - raio,
          raio * 2,
          raio * 2
        );
      }
      return;
    }

    const cor = inimigo.explodindo ? '#ffcc00' : (inimigo.ativo ? '#e74c3c' : '#27ae60');
    desenharRetangulo(inimigo, cor);

    if (inimigo.explodindo) {
      const progresso = inimigo.contagemExplosao / inimigo.tempoExplosao;
      const raio = inimigo.tamanhoBloco * 2 * progresso;
      ctx.beginPath();
      ctx.arc(inimigo.x + inimigo.largura / 2, inimigo.y + inimigo.altura / 2, raio, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  },

  resetar(inimigo) {
    inimigo.x = inimigo.xInicial;
    inimigo.y = inimigo.yInicial;
    inimigo.ativo = false;
    inimigo.explodindo = false;
    inimigo.explodiu = false;
    inimigo.contagemExplosao = 0;
    inimigo.areaResolvida = false;
    inimigo.tempoVisualExplosao = 0;
  }
});
