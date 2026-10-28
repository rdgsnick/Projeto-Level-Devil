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

// Bloco de pedra (usado nos tetos baixos e nas paredes)
function desenharPedra(r) {
  ctx.fillStyle = '#6b6b78';
  ctx.fillRect(r.x, r.y, r.largura, r.altura);
  ctx.strokeStyle = '#3d3d48';
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x + 1, r.y + 1, r.largura - 2, r.altura - 2);
}

// Plataforma da fase: terra com grama, ou pedra se tiver  estilo: 'pedra'
function desenharPlataforma(p) {
  if (p.estilo === 'pedra') {
    desenharPedra(p);
  } else {
    desenharChao(p);
  }
}

// Triângulos vermelhos apontando pra cima (espinhos do chão)
function desenharEspinhosParaCima(a) {
  ctx.fillStyle = '#e63946';
  for (let x = a.x; x < a.x + a.largura; x = x + 10) {
    ctx.beginPath();
    ctx.moveTo(x, a.y + a.altura);
    ctx.lineTo(x + 5, a.y);
    ctx.lineTo(x + 10, a.y + a.altura);
    ctx.fill();
  }
}

// Triângulos vermelhos apontando pra baixo (espinhos do teto)
function desenharEspinhosParaBaixo(a) {
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