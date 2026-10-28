// =====================================================================
//  CONFIGURAÇÕES DO JOGO  (mexa aqui pra mudar o jogo)
//  Cada seção abaixo cuida de uma parte. Tudo que era "número solto"
//  no meio do código agora tem nome aqui.
// =====================================================================

// ----- Tela -----
const LARGURA_TELA = 800;
const ALTURA_TELA = 450;

// ----- Física padrão (cada fase pode ter a sua: "velocidade", "gravidade", "pulo") -----
const VELOCIDADE_JOGADOR = 4;     // velocidade padrão
const GRAVIDADE_PADRAO = 0.6;     // quanto maior, mais rápido ele cai
const FORCA_PULO_PADRAO = 11;     // quanto maior, mais alto ele pula

// ----- Pontuação -----
const PONTOS_POR_FASE = 1000;     // pontos de quem passa instantaneamente
const PERDA_POR_SEGUNDO = 10;     // pontos perdidos por segundo na fase
const PERDA_POR_MORTE = 50;       // pontos perdidos por morte na fase
const PONTOS_MINIMOS_POR_FASE = 100;

// ----- Cenário -----
const CENARIO_PADRAO = 'img/cenario/cenario.jpg';   // imagem de fundo (cada fase pode ter a sua com "cenario")

// ----- Gato: tamanho da caixa de colisão (hitbox) -----
const LARGURA_JOGADOR = 24;
const ALTURA_JOGADOR = 30;          // em pé
const ALTURA_AGACHADO = 22;         // agachado (a largura continua a mesma)
const TECLA_AGACHAR = 'shift';      // tecla pra agachar (em minúsculo; vale em todas as fases)
const FATOR_VELOCIDADE_AGACHADO = 0.4;   // agachado anda a 40% da velocidade (1 = mesma velocidade)

// ----- Gato: tamanho do desenho na tela (não muda a colisão) -----
const ALTURA_SPRITE_JOGADOR = 46;
const ALTURA_SPRITE_AGACHADO = 34;
const ALTURA_SPRITE_MORTO = 32;

// ----- Gato: animações -----
const FRAMES_POR_QUADRO = 8;        // a cada quantos frames do jogo o gato troca de desenho (menor = mais rápido)
const TEMPO_POUSO = 6;              // quantos frames dura o "amassadinho" ao cair no chão
const DURACAO_MORTE = 70;           // quantos frames dura a animação de morte (60 frames = 1 segundo)
const FORCA_PULO_MORTE = 8;         // o pulinho que o gato dá quando morre
const MORTO_AFUNDA = 0.25;          // quanto do desenho do gato morto "afunda" no chão (por causa da cauda)
const MOSTRAR_HITBOX = false;       // true = mostra as caixas de colisão (gato em verde, espada em branco, inimigos em vermelho)

// ----- Gato: dash (tecla Q) -----
const TECLA_DASH = 'q';
const DASH_DURACAO = 8;             // quantos frames o impulso dura
const DASH_RECARGA = 45;            // frames até poder usar de novo
const DASH_VELOCIDADE_MINIMA = 8;   // velocidade horizontal mínima durante o dash
const DASH_FATOR_VELOCIDADE = 2.5;  // o dash também é "velocidade da fase x isso" (vale o maior dos dois)
const DASH_FATOR_PULO = 0.55;       // o dash dá um pulinho: força do pulo da fase x isso
const DASH_PULO_MINIMO = 4;         // ...mas nunca menos que isso

// ----- Espada (clique esquerdo do mouse) -----
const ESPADA_DURACAO = 14;          // frames que a animação do golpe dura
const ESPADA_INTERVALO = 20;        // frames até poder bater de novo
const ESPADA_HITBOX_INICIO = 4;     // a espada só machuca entre estes dois frames do golpe...
const ESPADA_HITBOX_FIM = 10;       // ...(o começo e o fim do golpe são só animação)
const ESPADA_DESENHO_INICIO = 4;    // o arco da espada só aparece desenhado entre estes dois frames (começa junto com a hitbox)
const ESPADA_DESENHO_FIM = 12;
const ESPADA_ALTURA_CENTRO = 0.48;  // em que altura do corpo a espada é desenhada e bate (0 = cabeça, 1 = pés)
const ESPADA_ALCANCE_LADO = 90;     // golpe pro lado: comprimento (era 58)
const ESPADA_ALTURA_LADO = 50;      //                  altura (era 34)
const ESPADA_ALCANCE_VERTICAL = 80; // golpe pra cima / pra baixo: comprimento (era 58)
const ESPADA_LARGURA_VERTICAL = 44; //                              largura (era 34)
// (o desenho da espada estica sozinho pra acompanhar estes tamanhos)
const ESPADA_FATOR_POGO = 0.85;     // golpe pra baixo acertando inimigo no ar = quique: força do pulo da fase x isso (0 = sem quique)

// ----- Início da fase (a fase fica parada até o gato se mexer) -----
const TECLAS_QUE_INICIAM_A_FASE = ['a', 'd', 'arrowleft', 'arrowright', ' ', TECLA_DASH, TECLA_AGACHAR];   // (o clique da espada também inicia)
const CONGELAR_AO_RENASCER = true;   // true = depois de morrer (ou apertar R) a fase também fica parada até o gato se mexer de novo

// ----- Inimigos: tamanhos e limites -----
const TAMANHO_BLOCO = 40;                        // unidade usada pra medir distâncias de combate (explosão do suicida, margem do voador)
const LIMITE_INIMIGOS_ATIVOS = 5;                // máximo de inimigos na tela ao mesmo tempo (a fase pode baixar com "limiteInimigosAtivos")
const MARGEM_SEGURANCA_VOADOR = TAMANHO_BLOCO;   // o voador nasce longe das plataformas por no mínimo isso
const INIMIGO_TAMANHOS = {                       // tamanho padrão de cada tipo (a fase pode mudar com "largura"/"altura")
  voador:   { largura: 30, altura: 24 },
  corredor: { largura: 28, altura: 28 },
  suicida:  { largura: 28, altura: 28 }       // a bomba (a caixa de colisão é o corpo redondo dela)
};

// ----- Inimigo bomba (o tipo 'suicida') -----
const BOMBA_RAIO_ATIVACAO = 180;      // a bomba fica PARADA até o gato chegar a tantos px dela (centro a centro); aí ela acorda e persegue
const BOMBA_TEMPO_PAVIO = 30;         // depois de ENCOSTAR no gato: frames de pavio queimando até explodir (60 = 1 segundo; 0 = explode na hora)
const BOMBA_DURACAO_EXPLOSAO = 14;    // quantos frames o desenho da explosão fica na tela
// (o tamanho da explosão é TAMANHO_BLOCO x 2 de raio; a bomba NÃO atravessa plataformas nem paredes)

// ----- Inimigos: velocidades base de cada tipo (nas fases mais altas elas aumentam, veja "Geração") -----
const VELOCIDADE_VOADOR = 1.5;
const VELOCIDADE_CORREDOR = 2;
const VELOCIDADE_SUICIDA = 1.8;
const INTERVALO_DISPARO_VOADOR = 90;             // frames entre um tiro e outro do voador
const INTERVALO_DISPARO_MINIMO = 35;             // o voador nunca atira mais rápido que isso

// ----- Inimigos: geração automática (quantos nascem, quando e onde) -----
const INIMIGOS_MINIMO_POR_FASE = 1;              // cada vez que a fase carrega, o jogo SORTEIA quantos inimigos nascem entre este número...
const INIMIGOS_MAXIMO_POR_FASE = 5;              // ...e este. Este é o TETO: nunca nascem mais que isso numa fase (nem os escritos à mão)
const INIMIGOS_MAXIMO_DO_MESMO_TIPO = 2;         // e nunca mais que isso do MESMO tipo na fase (2 corredores, 2 voadores, 2 suicidas)
const NIVEL_VOADOR_APARECE = 3;                  // a partir desta fase o voador entra no sorteio
const NIVEL_SUICIDA_APARECE = 6;                 // a partir desta fase o suicida entra no sorteio
const VELOCIDADE_PROGRESSIVA_POR_FASE = 0.035;   // quanto a velocidade dos inimigos cresce por fase (1 + fase x isso)...
const VELOCIDADE_PROGRESSIVA_MAXIMA = 2;         // ...até no máximo este multiplicador
const SPAWN_DISTANCIA_MINIMA_INICIO = 100;       // inimigo não nasce a menos de tantos px do ponto onde o gato começa
const SPAWN_DISTANCIA_MINIMA_PORTA = 70;         // ...nem a menos de tantos px da porta
const SPAWN_LARGURA_MINIMA_PLATAFORMA = 30;      // plataformas mais estreitas que isso não recebem inimigo terrestre
const SPAWN_CANDIDATOS_POR_PLATAFORMA = 12;      // quantas posições sorteadas por plataforma (o jogo escolhe uma delas)
const SPAWN_CANDIDATOS_AEREOS = 40;              // quantas posições sorteadas no ar pro voador
