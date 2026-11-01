// =====================================================================
//  RANKING (salvo no localStorage do navegador)
// =====================================================================
function pegarRanking() {
  try {
    const texto = localStorage.getItem('trollDevilRanking');
    if (texto === null) return [];
    const ranking = JSON.parse(texto);
    if (!Array.isArray(ranking)) throw new TypeError('Os dados do ranking não são uma lista.');
    return ranking;
  } catch (erro) {
    console.warn('Não foi possível carregar o ranking salvo.', erro);
    return null;
  }
}

function salvarPontuacao() {
  const ranking = pegarRanking();
  if (ranking === null) return { posicao: 0, salva: false };

  const nova = { nick: apelido, pontos: pontosTotais, mortes: mortesTotais };
  ranking.push(nova);

  // ordena do maior pro menor
  ranking.sort(function (a, b) { return b.pontos - a.pontos; });

  // guarda só os 10 melhores
  try {
    localStorage.setItem('trollDevilRanking', JSON.stringify(ranking.slice(0, 10)));
  } catch (erro) {
    console.warn('Não foi possível salvar a pontuação no ranking.', erro);
    return { posicao: 0, salva: false };
  }

  // devolve em que lugar o jogador ficou (1 = primeiro), ou 0 se ficou fora dos 10 melhores
  const indice = ranking.indexOf(nova);
  return {
    posicao: indice >= 0 && indice < 10 ? indice + 1 : 0,
    salva: true
  };
}

// Mostra os 5 melhores dentro de uma <ol> (idLista = id da lista no HTML)
function mostrarRanking(idLista) {
  const lista = document.getElementById(idLista);
  const ranking = pegarRanking();
  lista.innerHTML = '';

  if (ranking === null) {
    const item = document.createElement('li');
    item.textContent = 'Ranking indisponível neste navegador.';
    lista.appendChild(item);
    return;
  }

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