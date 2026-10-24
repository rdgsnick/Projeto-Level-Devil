// =====================================================================
//  FASE 20 - O Chefão
// =====================================================================
FASES.push({
  nome: 'O Chefão',
  porta: { x: 730, y: 350, foge: [ { x: 420, y: 350 }, { x: 610, y: 350 } ] },
  plataformas: [
    { x: 0,   y: 400, largura: 260, altura: 50 },
    { x: 380, y: 400, largura: 420, altura: 50 }
  ],
  armadilhas: [
    { tipo: 'espinhoTeto', x: 150 },
    { tipo: 'parede', x: 500 },
    { tipo: 'espinho', x: 650 }
  ]
});
