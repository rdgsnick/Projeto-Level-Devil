// =====================================================================
//  TECLADO
// =====================================================================
window.addEventListener('keydown', function (e) {
  if (document.activeElement.id === 'nick') return;   // está digitando o nickname

  const tecla = e.key.toLowerCase();                   // 'ArrowUp' vira 'arrowup', 'D' vira 'd'

  // Atalho de desenvolvimento (do seu commit "Inimigos"): Ctrl+F1 passa de fase
  if (e.ctrlKey && tecla === 'f1') {
    e.preventDefault();
    if (!e.repeat && jogando && !jogador.morto) passarDeFase();
    return;
  }

  if (tecla === 'r' && !e.repeat) reiniciarFase();

  // Impede a página de rolar com espaço e setas
  if (tecla === ' ' || tecla.startsWith('arrow')) e.preventDefault();

  teclas[tecla] = true;
});

window.addEventListener('keyup', function (e) {
  teclas[e.key.toLowerCase()] = false;
});
// Se a janela perder o foco (ex: alt+tab), solta todas as teclas pra o gato não ficar "preso" andando ou agachado
window.addEventListener('blur', function () {
  for (const tecla in teclas) {
    teclas[tecla] = false;
  }
});