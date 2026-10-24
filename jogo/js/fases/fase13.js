// =====================================================================
//  FASE 13 - Fase da Lua
// =====================================================================
FASES.push({
  nome: 'Fase da Lua',
  gravidade: 0.3,
  pulo: 8,
  plataformas: [
    { x: 0,   y: 400, largura: 150, altura: 50 },
    { x: 320, y: 400, largura: 110, altura: 50 },
    { x: 600, y: 400, largura: 200, altura: 50 }
  ],
  armadilhas: [
    { tipo: 'espinho', x: 680 }
  ]
});
