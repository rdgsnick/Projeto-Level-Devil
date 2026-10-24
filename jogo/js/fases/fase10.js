// =====================================================================
//  FASE 10 - Subindo a ladeira
// =====================================================================
FASES.push({
  nome: 'Subindo a ladeira',
  porta: { x: 730, y: 150 },
  plataformas: [
    { x: 0,   y: 400, largura: 800, altura: 50 },
    { x: 120, y: 340, largura: 80,  altura: 14 },
    { x: 250, y: 285, largura: 80,  altura: 14 },
    { x: 380, y: 230, largura: 80,  altura: 14 },
    { x: 640, y: 200, largura: 160, altura: 14 }
  ],
  armadilhas: [
    { tipo: 'chaoQueSome', x: 510, y: 235, largura: 70, altura: 14, espera: 15 }
  ]
});
