// =====================================================================
//  CONFETE da tela de vitória
//  iniciarConfete() começa a chuva de confete; pararConfete() para e esconde.
//  (o texto e o gato da tela de vitória ficam no index.html e no telas.js)
// =====================================================================
const CONFETE_QUANTIDADE = 140;                                   // quantos pedacinhos caem ao mesmo tempo
const CONFETE_CORES = ['#ffd60a', '#e63946', '#4cc9f0', '#80ed99', '#ff70a6', '#ffffff'];

const telaConfete = document.getElementById('confete');
const pincelConfete = telaConfete.getContext('2d');
let confetes = [];
let confeteRodando = false;

function criarConfete(noTopo) {
  return {
    x: Math.random() * telaConfete.width,
    y: noTopo ? -20 : Math.random() * telaConfete.height,         // no começo já espalhados pela tela
    tamanho: 6 + Math.random() * 8,
    velocidade: 1.5 + Math.random() * 3,
    balanco: Math.random() * Math.PI * 2,                         // fase do balanço de lado
    giro: Math.random() * Math.PI * 2,
    velocidadeGiro: (Math.random() - 0.5) * 0.25,
    cor: CONFETE_CORES[Math.floor(Math.random() * CONFETE_CORES.length)]
  };
}

function atualizarConfete() {
  if (!confeteRodando) return;
  pincelConfete.clearRect(0, 0, telaConfete.width, telaConfete.height);

  for (let i = 0; i < confetes.length; i++) {
    const c = confetes[i];
    c.y += c.velocidade;
    c.balanco += 0.04;
    c.x += Math.sin(c.balanco) * 1.2;
    c.giro += c.velocidadeGiro;
    if (c.y > telaConfete.height + 20) confetes[i] = criarConfete(true);   // saiu por baixo: volta lá do topo

    pincelConfete.save();
    pincelConfete.translate(c.x, c.y);
    pincelConfete.rotate(c.giro);
    pincelConfete.fillStyle = c.cor;
    pincelConfete.fillRect(-c.tamanho / 2, -c.tamanho / 4, c.tamanho, c.tamanho / 2);
    pincelConfete.restore();
  }
  requestAnimationFrame(atualizarConfete);
}

function iniciarConfete() {
  telaConfete.width = window.innerWidth;
  telaConfete.height = window.innerHeight;
  telaConfete.style.display = 'block';
  confetes = [];
  for (let i = 0; i < CONFETE_QUANTIDADE; i++) confetes.push(criarConfete(false));
  if (!confeteRodando) {
    confeteRodando = true;
    atualizarConfete();
  }
}

function pararConfete() {
  confeteRodando = false;
  telaConfete.style.display = 'none';
}