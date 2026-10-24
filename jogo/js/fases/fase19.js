// =====================================================================
//  FASE 19 - Combo
// =====================================================================
FASES.push({
  nome: 'Combo',
  porta: { x: 765, y: 350 },
  plataformas: [
    { x: 0,   y: 400, largura: 150, altura: 50 },
    { x: 250, y: 400, largura: 100, altura: 50 },
    { x: 520, y: 400, largura: 280, altura: 50 }
  ],
  armadilhas: [
    { tipo: 'chaoQueSome', x: 150, y: 400, largura: 100, altura: 50 },
    { tipo: 'chaoInvisivel', x: 350, y: 400, largura: 170, altura: 50 },
    { tipo: 'parede', x: 580 },
    { tipo: 'espinho', x: 730, largura: 30 }
  ]
});
