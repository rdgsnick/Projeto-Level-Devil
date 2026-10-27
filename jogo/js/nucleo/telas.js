// =====================================================================
//  TELAS: menu, início do jogo e tela final
// =====================================================================
function mostrarMenu() {
  botaoReiniciar.style.display = 'none';
  telaFim.style.display = 'none';
  canvas.style.display = 'none';
  telaMenu.style.display = 'block';
  campoApelido.value = '';
  mostrarRanking('rankMenu');
}

function comecarJogo() {
  const texto = campoApelido.value.trim();
  if (texto.length < 2) {
    textoErro.textContent = 'Nickname precisa ter pelo menos 2 letras.';
    return;
  }

  apelido = texto;
  pontosTotais = 0;
  mortesTotais = 0;
  textoErro.textContent = '';

  telaMenu.style.display = 'none';
  canvas.style.display = 'block';
  botaoReiniciar.style.display = 'inline-block';
  document.activeElement.blur();    // tira o foco do campo de texto pra as teclas funcionarem

  // Dica pra testar: abra o index.html com ?fase=15 no final do endereço
  // pra começar direto na fase 15.
  let faseInicial = 0;
  const pedida = parseInt(new URLSearchParams(location.search).get('fase'), 10);
  if (pedida >= 1 && pedida <= FASES.length) {
    faseInicial = pedida - 1;
  }

  carregarFase(faseInicial);
  jogando = true;
  loopDoJogo();
}

function terminarJogo() {
  jogando = false;
  salvarPontuacao();

  botaoReiniciar.style.display = 'none';
  canvas.style.display = 'none';
  telaFim.style.display = 'block';
  document.getElementById('resultado').textContent =
    apelido + ': ' + pontosTotais + ' pontos, ' + mortesTotais + ' mortes';
  mostrarRanking('rankFim');
}

// ----- Botões -----
botaoJogar.onclick = comecarJogo;
botaoNovoJogador.onclick = mostrarMenu;
botaoReiniciar.onclick = function () {
  reiniciarFase();
  botaoReiniciar.blur();     // evita que apertar espaço "clique" no botão sem querer
};

campoApelido.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') comecarJogo();
});
