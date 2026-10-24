// =====================================================================
//  FASE 9 - Pulando pedrinhas
// =====================================================================
FASES.push({
  nome: 'Pulando pedrinhas',
  plataformas: [
    { x: 0,   y: 400, largura: 150, altura: 50 },
    { x: 190, y: 350, largura: 80,  altura: 14 },
    { x: 490, y: 350, largura: 80,  altura: 14 },
    { x: 640, y: 400, largura: 160, altura: 50 }
  ],
  armadilhas: [
    { tipo: 'chaoQueSome', x: 340, y: 330, largura: 80, altura: 14, espera: 20 },
    { tipo: 'espinho', x: 680 }
  ]
});
