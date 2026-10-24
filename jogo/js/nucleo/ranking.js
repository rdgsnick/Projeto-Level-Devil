// =====================================================================
//  RANKING (salvo no localStorage = memória do navegador)
// =====================================================================
function pegarRanking() {
  try {
    const texto = localStorage.getItem('trollDevilRanking');
    if (texto === null) return [];
    return JSON.parse(texto);
  } catch (erro) {
    return [];
  }
}

function salvarPontuacao() {
  const ranking = pegarRanking();
  ranking.push({ nick: apelido, pontos: pontosTotais, mortes: mortesTotais });

  // ordena do maior pro menor
  ranking.sort(function (a, b) { return b.pontos - a.pontos; });

  // guarda só os 10 melhores
  localStorage.setItem('trollDevilRanking', JSON.stringify(ranking.slice(0, 10)));
}

// Mostra os 5 melhores dentro de uma <ol> (idLista = id da lista no HTML)
function mostrarRanking(idLista) {
  const lista = document.getElementById(idLista);
  const ranking = pegarRanking();
  lista.innerHTML = '';

  if (ranking.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Ninguém jogou ainda';
    lista.appendChild(item);
    return;
  }

  for (let i = 0; i < ranking.length && i < 5; i++) {
    const item = document.createElement('li');
    item.textContent = ranking[i].nick + ' — ' + ranking[i].pontos + ' pts (' + ranking[i].mortes + ' mortes)';
    lista.appendChild(item);
  }
}
