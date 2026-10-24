// =====================================================================
//  FASE 22 - Túnel baixo
//  podeAgachar: true -> segure Shift pra agachar.
//  O túnel tem 22px de altura: só dá pra passar agachado.
// =====================================================================
FASES.push({
  nome: 'Túnel baixo',
  plataformas: [
    { x: 0,   y: 400, largura: 800, altura: 50 },
    { x: 300, y: 300, largura: 220, altura: 76, estilo: 'pedra' }
  ],
  armadilhas: [
    { tipo: 'espinho', x: 170 },
    { tipo: 'espinho', x: 600 }
  ]
});