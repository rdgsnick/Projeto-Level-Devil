// =====================================================================
//  VARIÁVEIS DO JOGO (mudam enquanto o jogo roda)
// =====================================================================
let fase;               // cópia da fase que está sendo jogada
let numeroFase;         // posição da fase na lista FASES (0 = fase 1)
let jogador;            // { x, y, largura, altura, vx, vy, noChao }
let apelido;            // nickname do jogador atual
let pontosTotais;       // pontos somados de todas as fases
let pontosInimigosPendentes = 0; // pontos por inimigos mortos, ainda não confirmados 
let mortesTotais;       // mortes somadas de todas as fases
let mortesNaFase;       // mortes só da fase atual (usadas no cálculo dos pontos)
let inicioDaFase;       // hora em que a fase começou (pra contar o tempo)
let jogando = false;    // true = o jogo está rodando
let faseIniciada = false;   // false = fase PARADA (inimigos e armadilhas congelados) esperando o gato se mexer
let congeladoDesde = 0;     // hora em que a fase parou (pra não contar esse tempo parado na pontuação)


const teclas = {};      // guarda quais teclas estão apertadas. Ex: teclas['d'] = true