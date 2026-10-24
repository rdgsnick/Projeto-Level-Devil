// =====================================================================
//  COLISÃO
// =====================================================================

// Retorna true se os retângulos a e b estão se encostando.
// (tanto o jogador quanto as plataformas e armadilhas têm x, y, largura e altura)
function colidiu(a, b) {
  return a.x < b.x + b.largura &&
         a.x + a.largura > b.x &&
         a.y < b.y + b.altura &&
         a.y + a.altura > b.y;
}

// Devolve uma caixa menor, "encolhida" por margem px em cada lado (a original não muda).
// Usada pra perdoar encostadinhas: o inimigo só machuca se entrar mesmo no gato.
function encolherRetangulo(r, margem) {
  return {
    x: r.x + margem,
    y: r.y + margem,
    largura: r.largura - margem * 2,
    altura: r.altura - margem * 2
  };
}

// Lista tudo em que o jogador pode pisar / bater
function listarSolidos() {
  const lista = [];

  // plataformas da fase
  for (let i = 0; i < fase.plataformas.length; i++) {
    lista.push(fase.plataformas[i]);
  }

  // armadilhas que, neste momento, são sólidas (chão que some, parede...)
  const armadilhasSolidas = listarArmadilhasSolidas();
  for (let i = 0; i < armadilhasSolidas.length; i++) {
    lista.push(armadilhasSolidas[i]);
  }

  return lista;
}
