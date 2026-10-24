// =====================================================================
//  COMBATE: aqui a espada e os inimigos se encontram
//
//  Regra: um golpe de espada que encosta num inimigo remove ele na hora
//  (os inimigos têm 1 de vida). Isso vale pros três tipos:
//    - corredor: some.
//    - voador:   some junto com os tiros que ainda estavam voando.
//    - suicida:  some. Se ele já estava na contagem da explosão, a contagem
//                também some (matar antes de explodir = sem explosão).
//  Quando um inimigo some, abre vaga na tela e o próximo da fila entra
//  (isso é feito pelo atualizarInimigos, no inimigos/_registro.js).
//
//  Os TIROS dos inimigos (voador) também são atingidos pela espada: o golpe que
//  encosta num tiro faz ele sumir, e assim ele não acerta o gato.
//
//  Golpe PRA BAIXO acertando inimigo com o gato no ar = quique (pulo extra).
//  (acertar só um tiro não dá quique)
//
//  Quem mata o GATO continua sendo o inimigos/_registro.js (inimigoMatouJogador).
//  A ordem de tudo isso no frame está no nucleo/principal.js.
// =====================================================================

// Roda a cada frame, depois de atualizar a espada e os inimigos
function resolverEspadaContraInimigos() {
  if (obterHitboxEspada() === null) return;          // a espada não está machucando agora

  // de trás pra frente porque removerInimigo tira o inimigo da lista
  for (let i = fase.inimigos.length - 1; i >= 0; i--) {
    const inimigo = fase.inimigos[i];

    // 1) os tiros desse inimigo (sempre ANTES de verificar o inimigo, pro caso de ele sumir junto)
    destruirProjeteisAtingidos(inimigo);

    // 2) o inimigo em si
    if (!espadaAcerta(inimigo)) continue;

    removerInimigo(inimigo);
    if (espada.direcao === 'baixo') {
      quicarNoInimigo();
    }
  }
}

// Remove os tiros do inimigo que a espada está encostando.
// Serve pra qualquer tipo de inimigo que guarde seus tiros em inimigo.projeteis.
function destruirProjeteisAtingidos(inimigo) {
  if (!inimigo.projeteis) return;

  for (let p = inimigo.projeteis.length - 1; p >= 0; p--) {
    if (espadaAcerta(inimigo.projeteis[p])) {
      inimigo.projeteis.splice(p, 1);
    }
  }
}

// Golpe pra baixo acertou um inimigo: se o gato está no ar, ele ganha um pulo extra (quique)
function quicarNoInimigo() {
  if (ESPADA_FATOR_POGO <= 0 || jogador.noChao) return;
  jogador.vy = -fase.pulo * ESPADA_FATOR_POGO;
  jogador.noChao = false;
}
