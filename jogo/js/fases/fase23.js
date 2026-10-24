// =====================================================================
//  FASE 23 - Dois túneis
//  podeAgachar: true -> segure Shift. Entre os túneis tem um espinho escondido:
//  levante, pule e agache de novo.
// =====================================================================
FASES.push({
  nome: 'Dois túneis',
  plataformas: [
    { x: 0,   y: 400, largura: 800, altura: 50 },
    { x: 180, y: 300, largura: 160, altura: 76, estilo: 'pedra' },
    { x: 560, y: 300, largura: 160, altura: 76, estilo: 'pedra' }
  ],
  armadilhas: [
    { tipo: 'espinho', x: 430 }
  ]
});