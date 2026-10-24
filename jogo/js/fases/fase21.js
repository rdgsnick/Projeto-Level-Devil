// =====================================================================
//  FASE 21 - Mini gato
//  agachado: true -> o gato fica agachado a fase inteira (hitbox menor, anda mais devagar).
//  O túnel de pedra tem só 22px de altura: o gato em pé (30px) não passa, agachado (18px) passa.
// =====================================================================
FASES.push({
  nome: 'Passagem baixa',
  plataformas: [
    { x: 0,   y: 400, largura: 800, altura: 50 },
    { x: 250, y: 330, largura: 300, altura: 46, estilo: 'pedra' }
  ],
  armadilhas: [
    { tipo: 'espinho', x: 130 },
    { tipo: 'espinho', x: 620 }
  ]
});