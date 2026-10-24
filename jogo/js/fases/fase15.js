// =====================================================================
//  FASE 15 - Ilhas
// =====================================================================
FASES.push({
  nome: 'Ilhas',
  porta: { x: 765, y: 350 },
  plataformas: [
    { x: 0,   y: 400, largura: 120, altura: 50 },
    { x: 200, y: 400, largura: 80,  altura: 50 },
    { x: 520, y: 400, largura: 80,  altura: 50 },
    { x: 680, y: 400, largura: 120, altura: 50 }
  ],
  armadilhas: [
    { tipo: 'chaoQueSome', x: 360, y: 400, largura: 80, altura: 50, espera: 15 },
    { tipo: 'espinho', x: 730, largura: 30 }
  ]
});
