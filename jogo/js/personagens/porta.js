// =====================================================================
//  PORTA (a saída da fase, em amarelo)
// =====================================================================

// Completa a porta com os valores padrão (chamada quando a fase carrega)
function prepararPorta(porta) {
  definirPadrao(porta, 'largura', 30);
  definirPadrao(porta, 'altura', 50);
  definirPadrao(porta, 'foge', []);
  porta.xInicial = porta.x;
  porta.yInicial = porta.y;
  porta.fugas = 0;            // quantas vezes a porta já fugiu
}

// Chamada quando o jogador morre: a porta volta pro lugar de origem
function resetarPorta() {
  fase.porta.x = fase.porta.xInicial;
  fase.porta.y = fase.porta.yInicial;
  fase.porta.fugas = 0;
}

function verificarPorta() {
  const porta = fase.porta;

  // A porta foge se o jogador chegar a menos de 90px dela
  const centroJogador = jogador.x + jogador.largura / 2;
  const centroPorta = porta.x + porta.largura / 2;
  const distancia = Math.abs(centroJogador - centroPorta);

  if (porta.fugas < porta.foge.length && distancia < 90) {
    const novoLugar = porta.foge[porta.fugas];
    porta.x = novoLugar.x;
    porta.y = novoLugar.y;
    porta.fugas++;
  }

  if (colidiu(jogador, porta)) {
    passarDeFase();
  }
}

function desenharPorta(porta) {
  var portal1 = obterImagem('img/porta/portal_frame_1.png');
  var portal2 = obterImagem('img/porta/portal_frame_2.png');

  var tempo = Math.floor(performance.now() / 250);
  var portalAtual = tempo % 2 === 0 ? portal1 : portal2;

  var largura = 50;
  var altura = 100;

  var x = porta.x + porta.largura / 2 - largura / 2;
  var y = porta.y + porta.altura - altura;

  if (imagemPronta(portalAtual)) {
    ctx.drawImage(portalAtual, x, y, largura, altura);
  } else {
    desenharRetangulo(porta, '#ffd60a');
  }
}
