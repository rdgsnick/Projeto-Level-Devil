// =====================================================================
//  ELEMENTOS DA PÁGINA (os ids vêm do index.html)
// =====================================================================
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');          // "pincel" que desenha no canvas

const telaMenu = document.getElementById('menu');
const telaFim = document.getElementById('fim');
const campoApelido = document.getElementById('nick');
const textoErro = document.getElementById('erro');
const botaoJogar = document.getElementById('btnJogar');
const botaoNovoJogador = document.getElementById('btnNovo');
const botaoReiniciar = document.getElementById('btnReiniciar');
