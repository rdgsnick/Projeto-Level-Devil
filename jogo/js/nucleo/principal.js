// =====================================================================
//  PRINCIPAL: o "coração" do jogo (carregue este arquivo SEMPRE por último)
// =====================================================================

// Roda uma vez por frame (uns 60 por segundo)
function atualizarJogo() {
  // A fase fica PARADA (inimigos, tiros e armadilhas congelados) até o gato se mexer
  if (!faseIniciada && !jogador.morto && jogadorComecouAMexer()) iniciarFase();
  if (faseIniciada) atualizarArmadilhas();
  animarInimigos();                 // animações que terminam sozinhas (ex: explosão da bomba), até com o gato morrendo

  if (jogador.morto) {              // animação de morte: o gato só cai, sem controle
    atualizarMorte();
    return;
  }

  moverJogador();
  atualizarAtaqueEspada();
  if (faseIniciada) atualizarInimigos();
  resolverEspadaContraInimigos();   // ANTES de checar a morte: se o golpe acertou, o inimigo some primeiro
  if (verificarMorte()) return;     // se morreu, não precisa checar a porta
  verificarPorta();
}

// Retorna true se o jogador morreu neste frame
function verificarMorte() {
  // Caiu no buraco
  if (jogador.y > ALTURA_TELA) {
    morrer();
    return true;
  }

  // Encostou numa armadilha mortal
  if (armadilhaMatouJogador()) {
    morrer();
    return true;
  }

  // Encostou num inimigo vivo
  if (inimigoMatouJogador()) {
    morrer();
    return true;
  }

  return false;
}

// Loop principal: roda de novo a cada frame enquanto "jogando" for true
function loopDoJogo() {
  if (!jogando) return;

  atualizarJogo();
  if (jogando) desenharJogo();      // o jogo pode ter acabado dentro do atualizarJogo()

  requestAnimationFrame(loopDoJogo);
}

// Começa mostrando o menu
mostrarMenu();
