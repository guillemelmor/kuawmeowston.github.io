// marca los pulsos del juego
window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame    ||
      window.webkitRequestAnimationFrame  ||
      window.mozRequestAnimationFrame     ||
      window.oRequestAnimationFrame       ||
      window.msRequestAnimationFrame      ||
      function ( /* function */ callback, /* DOMElement */ element) {
          window.setTimeout(callback, 1000 / 60);
      };
})();
// si es navegador FIREFOX
var FIREFOX = /Firefox/i.test(navigator.userAgent);
// si es smartphone
var SMARTPHONE = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (SMARTPHONE.Android() || SMARTPHONE.BlackBerry() || SMARTPHONE.iOS() || SMARTPHONE.Opera() || SMARTPHONE.Windows());
  }
};

var puntos = 0;

// juego
var game = (function () {
  document.addEventListener("touchstart", touchHandler);
  document.addEventListener("mouseup", touchHandler);

  function touchHandler(e) {
    if(e.touches) {
      var playerX = e.changedTouches[0].pageX;
      var playerY = e.changedTouches[0].pageY;
      console.log(playerX + " " + playerY);
      e.preventDefault();
    }
    if((playerX <= 170)&&(playerX >= 110)&&(playerY <= 75)&&(playerY >= 20)){
      console.log("flecha arriba")
      console.log(player_1.posY)
      if(player_1.posY > 199.1){
        for(var i = 0; i < 9; i++){
          player_1.posY -= 0.05;
          player_1.posX += 6;
          player_1_carril.x -= 10;
          player_1_carril.y -= 5;   
        }               
      }
    }
    if((playerX <= 175)&&(playerX >= 114)&&(playerY <= 140)&&(playerY >= 85)){
      console.log("flecha abajo")
      console.log(player_1.posY)
      if(player_1.posY < 474){
        for(var i = 0; i < 9; i++){
          player_1.posY += 0.05;
          player_1.posX -= 6;
          player_1_carril.x += 10;
          player_1_carril.y += 5;
        }
      }
    }
    if((playerX <= 109)&&(playerX >= 55)&&(playerY <= 107)&&(playerY >= 54)){
      console.log("flecha izquierda")
      if (player_1.posX > (-120*player_1.posY + 56850))
        player_1.posX -= player_1.speed;   
    }
    if((playerX <= 230)&&(playerX >= 175)&&(playerY <= 107)&&(playerY >= 54)){
      console.log("flecha derecha")
      if (player_1.posX < (-120*player_1.posY + 57215))
        player_1.posX += player_1.speed;
    }
    if((playerX <= 520)&&(playerX >= 465)&&(playerY <= 110)&&(playerY >= 55)){
      player_1_bullet_x = player_1_carril.x - 10;
      player_1_bullet_y = player_1_carril.y - 10;
      player_1.shoot_touch();
    }
  }
  /*
if(SMARTPHONE.any()){
  alert("Usas smartphone");
} else {*/
    // ------------------------------------------------------ Inicializacion de las variables ------------------------------------------------------
    // variables globales de la aplicacion
    var canvas;
    var ctx;
    var buffer;
    var bufferctx;
    var fondo_principal;
    if(FIREFOX){
      var carril_0 = 485.1;     // limite cercano a la pantalla
      var carril_1 = 484.7;  // limite entre carril 0 y carril 1
      var carril_2 = 484.4;   // limite entre carril 1 y carril 2
      var carril_3 = 484;  // limite cercano al fondo
    }else{
      var carril_0 = 474;     // limite cercano a la pantalla
      var carril_1 = 473.63;  // limite entre carril 0 y carril 1
      var carril_2 = 473.2;   // limite entre carril 1 y carril 2
      var carril_3 = 472.98;  // limite cercano al fondo
    }
    // variables del jugador 1
    var player_1;
    var player_1_life_sprite;
    var player_1_life = 3;
    var player_1_bullet;
    var player_1_bullets = [];
    var player_1_killed;
    var player_1_speed = 12;
    var player_1_shoot;
    var player_1_next_shoot;
    var player_1_now = 0;
    var player_1_shoot_delay = 250;
    var player_1_carril = {
      x: 1200,
      y: 600
    }
    // variables del jugador 2
    var player_2;  
    var player_2_life = 3;
    var player_2_life_sprite;
    var player_2_bullet;
    var player_2_bullets = [];
    var player_2_killed;
    var player_2_speed = 12;
    var player_2_shoot;
    var player_2_next_shoot;
    var player_2_now = 0;
    var player_2_shoot_delay = 250;
    var player_2_carril = {
      x: 1200,
      y: 600
    }
    // variables del enemigo 1
    var enemy_1;
    var enemy_1_life = 1;
    var enemy_1_shoot;
    var enemy_1_bullet;
    var enemy_1_bullets = [];
    var enemy_1_sprite = {
      damaged: new Image (),
      killed: new Image ()
    }
    var enemy_1_carril = {
      x: 1200,
      y: 600
    }

    // indice de enemigo
    var enemy_id = 0;
    // variable de fin de juego malo
    var game_over = false;
    // variable de fin de juego bueno
    var the_end = false;
    // tecla pulsada
    var keyPressed = {};
    // controles
    var keyMap = {
      // jugador 1
      p1_up: 87,      // w
      p1_down: 83,    // s
      p1_left: 65,    // a
      p1_right: 68,   // d
      p1_fire_1: 81,  // q
      p1_fire_2: 69,  // e
      // borrar una vez hecho el apaño
      p1_dead_1: 88,
      p1_dead_2: 67,
      p1_dead_3: 86,
      //-------------------------------
      // jugador 2
      p2_up: 104,     // 8
      p2_down: 101,   // 5
      p2_left: 100,   // 4
      p2_right: 102,  // 6
      p2_fire_1: 103, // 7
      p2_fire_2: 105  // 9
    }
    // variable que determina el numero de jugadores a jugar
    var Jugadores = localStorage.getItem("jugadores");
    //console.log("Numero de jugadores " + Jugadores);
 
    var button_attack;
    var button_down;
    var button_left;
    var button_right;
    var button_up;

    var fecha = new Date();
    var segundos_0 = fecha.getTime() / 1000;

    // gameloop
    function loop () {
      update ();
      //console.log(player_1.posX);
      // resize de la pantalla
      resizeCanvas();
    }

    // funcion que carga las imagenes
    function preloadImages (){

      // sprites del primer enemigo
      enemy_1_bullet = new Image ();
      enemy_1_bullet.src = 'images/pepino_bullet.png';
      enemy_1_sprite.damaged.src = 'images/pepino_damaged.png';
      enemy_1_sprite.killed.src = 'images/pepino_killed.png'; 

        // sprites del jugador 1
      player_1_bullet = new Image ();
      player_1_bullet.src = 'images/player_1_bullet.png';
      player_1_life_sprite = new Image ();
      player_1_life_sprite.src = 'images/player_1_1_lifes.png';
      player_1_killed = new Image ();
      player_1_killed.src = 'images/player_1_killed.png';


      // sprites del jugador 2
      player_2_bullet = new Image ();
      player_2_bullet.src = 'images/player_2_bullet.png';
      player_2_life_sprite = new Image ();
      player_2_life_sprite.src = 'images/player_2_1_lifes.png';
      player_2_killed = new Image ();
      player_2_killed.src = 'images/player_2_killed.png';

      button_left = new Image ();
      button_left.src = "images/button_left.png";
      button_down = new Image ();
      button_down.src = "images/button_down.png";
      button_right = new Image ();
      button_right.src = "images/button_right.png";
      button_up = new Image ();
      button_up.src = "images/button_up.png";
      button_attack = new Image ();
      button_attack.src = "images/button_attack.png";	

      // sprites del escenario
      fondo_principal = new Image();
      fondo_principal.src = 'images/fondo_2.png';
      //console.log("con exito");
    }

    // funcion de inicializacion
    function init (){
    
      // se cargan los sprites
      //console.log("cargando imagenes ... :");
      preloadImages ();
      //console.log("creando pantalla ... :");
      // se inicializa el canvas
      canvas = document.getElementById('canvas');
      var full_screen = localStorage.getItem("full_screen");
      //console.log("pantalla completa: " + full_screen);
    
      // resize de la pantalla
      window.addEventListener('resize', resizeCanvas, false);
   
      ctx = canvas.getContext('2d');
      buffer = document.createElement('canvas');
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      bufferctx = buffer.getContext('2d');
      //console.log("con exito");
      // se inicializan los jugadores
      //console.log("creando al jugador 1 ... :");
      player_1 = new Player_1 (player_1_life, 0);
      //console.log("con exito");
      if(Jugadores == 2){
        //console.log("creando al jugador 1 ... :");
        player_2 = new Player_2 (player_2_life, 0);
        enemy_1_life = enemy_1_life*2;
        //console.log("con exito");
      }
      enemy_1 = new Enemy_1();
      // createNewEvil();
      // se inicializa la interfaz
      //console.log("cargando interfaz gráfica ... :");
      showLifeAndScore ();
      // se inicializa el teclado
      //console.log("cargando inputs del teclado ... :")
      addListener(document, 'keydown', keyDown);
      addListener(document, 'keyup', keyUp);
      // se inicializa el bucle
      function anim (){
        loop ();
        requestAnimFrame(anim);
      }
      anim ();
    }  
    // ---------------------------------------------------- Fin inicializacion de las variables ----------------------------------------------------

    // ------------------------------------------------------------ Funciones auxiliares -----------------------------------------------------------
    // cita en que carril se encuentra el objeto
    function player_carril_n (objeto) {
      if((objeto.posY <= carril_0) && (objeto.posY > carril_1)){ 
        return 0;   
      }
      if((objeto.posY <= carril_1) && (objeto.posY > carril_2)){
        return 1;
      }
      if((objeto.posY <= carril_2) && (objeto.posY > carril_3)){
        return 2;
      }
    }

    if(FIREFOX){
      function player_carril_n_2 (objeto) {   
        if((objeto.posY <= carril_0-285) && (objeto.posY  > carril_1-285)){ 
          return 0;   
        }
        if((objeto.posY  <= carril_1-285) && (objeto.posY  > carril_2-285)){
          return 1;
        }
        if((objeto.posY  <= carril_2-285) && (objeto.posY  > carril_3-285)){
          return 2;
        }
      }
    }    

    function enemy_1_carril_n (objeto){    
      if((objeto.x == 171.43) && (objeto.y == 120)){
        //console.log("enemigo en carril 0")
        return 0;
      }
      if((objeto.x == 171.43*0.8) && (objeto.y == 120*0.8)){
        //console.log("enemigo en carril 0")
        return 0;
      }
      if((objeto.x == 133.3) && (objeto.y == 85.71)){
        //console.log("enemigo en carril 1")
        return 1;
      }
      if((objeto.x == 133.3*0.8) && (objeto.y == 85.71*0.8)){
        //console.log("enemigo en carril 1")
        return 1;
      }
      if((objeto.x == 92.3) && (objeto.y == 54.54)){
        //console.log("enemigo en carril 2")
        return 2;
      }
      if((objeto.x == 92.3*0.8) && (objeto.y == 54.54*0.8)){
        //console.log("enemigo en carril 2")
        return 2;
      }
    }

    // resize de la pantalla
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }

    // devuelve un numero aleatorio
    function getRandomNumber(range_min, range_max) {
      return Math.floor(Math.random() * (range_max - range_min + 1)) + range_min;
    }

    // elimina un elemento de un array
    arrayRemove = function (array, from) {
      var rest = array.slice((from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, rest);
    };
    // ---------------------------------------------------------- Fin funciones auxiliares ---------------------------------------------------------

    // ----------------------------------------------------------------- Jugadores -----------------------------------------------------------------
    // jugador 1
    function Player_1(life, score) {
      // ubicacion del jugador 1
      var settings = {
          marginBottom : 60,
          defaultHeight : 66
      };
      // carga sprite y sus atributos
      player_1 = new Image();
      player_1.src = 'images/player_1.png';
      player_1.posX = -40;
      player_1.posY = canvas.height - (player_1.height == 0 ? settings.defaultHeight : player_1.height) - settings.marginBottom;
      player_1.life = life;
      player_1.score = score;
      player_1.dead = false;
      player_1.speed = player_1_speed;
      player_1_carril.x = player_1_carril.x/4;
      player_1_carril.y = player_1_carril.y/4;

      // disparo
      var shoot = function () {
        if (FIREFOX) {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY + 285);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        } else {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        }        
      };

      player_1.shoot_touch = function (){
        if (FIREFOX) {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY + 285);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        } else {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        } 
      }

      // acciones del jugador
      player_1.doAnything = function() {
        if(FIREFOX) {
          if (player_1.dead)
            return;
          if (keyPressed.p1_left && (player_1.posX > ((player_1.posY - 199.67)/(-0.008333))))
            player_1.posX -= player_1.speed;
          if (keyPressed.p1_right && (player_1.posX < ((player_1.posY - 202.867)/(-0.008333))))
            player_1.posX += player_1.speed;
          if(keyPressed.p1_up && (player_1.posY > 199.1)){
            player_1.posY -= 0.05;
            player_1.posX += 6;
            player_1_carril.x -= 10;
            player_1_carril.y -= 5;                  
          }
          if(keyPressed.p1_down  && (player_1.posY < 200)){
            player_1.posY += 0.05;
            player_1.posX -= 6;
            player_1_carril.x += 10;
            player_1_carril.y += 5;
          }
          if (keyPressed.p1_fire_1){
            player_1_bullet_x = player_1_carril.x - 10;
            player_1_bullet_y = player_1_carril.y - 10;
            shoot();
          }
          if(keyPressed.p1_dead_1){
            player_1.hit(2);
          }
          if(keyPressed.p1_dead_2){
            player_1.hit(1);
          }
          if(keyPressed.p1_dead_3){
            player_1.hit(0);
          }
        } else {
          if (player_1.dead)
            return;
          if (keyPressed.p1_left && (player_1.posX > (-120*player_1.posY + 56850)))
            player_1.posX -= player_1.speed;
          if (keyPressed.p1_right && (player_1.posX < (-120*player_1.posY + 57215)))
            player_1.posX += player_1.speed;
          if(keyPressed.p1_up && (player_1.posY > 473)){
            player_1.posY -= 0.05;
            player_1.posX += 6;
            player_1_carril.x -= 10;
            player_1_carril.y -= 5;
            //console.log("w pulsada");
          }
          if(keyPressed.p1_down  && (player_1.posY < 474)){
            player_1.posY += 0.05;
            player_1.posX -= 6;
            player_1_carril.x += 10;
            player_1_carril.y += 5;
          }
          if (keyPressed.p1_fire_1){
            player_1_bullet_x = player_1_carril.x - 10;
            player_1_bullet_y = player_1_carril.y - 10;
            //console.log("disparar");
            shoot();
          }
          if(keyPressed.p1_dead_1){
            player_1.hit(2);
          }
          if(keyPressed.p1_dead_2){
            player_1.hit(1);
          }
          if(keyPressed.p1_dead_3){
            player_1.hit(0);
          }
        }
      };

      player_1.hit = function (){
        player_1.life -= 1;
        if(player_1.life == 0){
          player_1_life_sprite.src = '';
          player_1.src = player_1_killed.src;
          setTimeout(function (){
            game_over = true;
          }, 1000);            
        }
      }
      return player_1;
    }

    // jugador 2
    function Player_2 (life, score) {
      var settings = {
          marginBottom : 60,
          defaultHeight : 66
      };
      // carga sprite
      player_2 = new Image();
      player_2.src = 'images/player_2.png';
      player_2.posX = -40;
      player_2.posY = canvas.height - (player_2.height == 0 ? settings.defaultHeight : player_2.height) - settings.marginBottom;
      player_2.life = life;
      player_2.score = score;
      player_2.dead = false;
      player_2.speed = player_2_speed;
      player_2_carril.x = player_2_carril.x/4;
      player_2_carril.y = player_2_carril.y/4;

      // disparo
      var shoot = function () {
        if (FIREFOX) {
          if (player_2_next_shoot < player_2_now || player_2_now == 0) {
            player_2_shoot = new Player_2_Shoot(player_2.posX + 30, player_2.posY + 285);
            player_2_shoot.x = player_2_carril.x;
            player_2_shoot.y = player_2_carril.y;
            player_2_shoot.add();
            player_2_now += player_2_shoot_delay;
            player_2_next_shoot = player_2_now + player_2_shoot_delay;
          } else {
            player_2_now = new Date().getTime();
          }
        } else {
          if (player_2_next_shoot < player_2_now || player_2_now == 0) {
            player_2_shoot = new Player_2_Shoot(player_2.posX + 30, player_2.posY);
            player_2_shoot.x = player_2_carril.x;
            player_2_shoot.y = player_2_carril.y;
            player_2_shoot.add();
            player_2_now += player_2_shoot_delay;
            player_2_next_shoot = player_2_now + player_2_shoot_delay;
          } else {
            player_2_now = new Date().getTime();
          }
        }
      };
      // acciones del jugador
      player_2.doAnything = function() {
        if(FIREFOX) {
          if (player_2.dead)
            return;
          if (keyPressed.p2_left && (player_2.posX > ((player_2.posY - 199.67)/(-0.008333))))
            player_2.posX -= player_2.speed;
          if (keyPressed.p2_right && (player_2.posX < ((player_2.posY - 202.867)/(-0.008333))))
            player_2.posX += player_2.speed;
          if(keyPressed.p2_up && (player_2.posY > 199.1)){
            player_2.posY -= 0.05;
            player_2.posX += 6;
            player_2_carril.x -= 10;
            player_2_carril.y -= 5;
          }
          if(keyPressed.p2_down  && (player_2.posY < 200)){
            player_2.posY += 0.05;
            player_2.posX -= 6;
            player_2_carril.x += 10;
            player_2_carril.y += 5;
          }
          if (keyPressed.p2_fire_1){
            player_2_bullet_x = player_2_carril.x - 10;
            player_2_bullet_y = player_2_carril.y - 10;
            shoot();
          }
        } else {
          //console.log("teclado2");
          if (player_2.dead)
            return;
          if (keyPressed.p2_left && (player_2.posX > (-120 * player_2.posY + 56850)))
            player_2.posX -= player_2.speed;
          if (keyPressed.p2_right && (player_2.posX < (-120 * player_2.posY + 57215)))
            player_2.posX += player_2.speed;
          if (keyPressed.p2_up && (player_2.posY > 473)) {
            player_2.posY -= 0.05;
            player_2.posX += 6;
            player_2_carril.x -= 10;
            player_2_carril.y -= 5;
          }
          if (keyPressed.p2_down && (player_2.posY < 474)) {
            player_2.posY += 0.05;
            player_2.posX -= 6;
            player_2_carril.x += 10;
            player_2_carril.y += 5;
          }
          if (keyPressed.p2_fire_1) {
            player_2_bullet_x = player_2_carril.x - 10;
            player_2_bullet_y = player_2_carril.y - 10;
            shoot();
          }
        }
      };

      player_2.hit = function (){
        player_2.life -= 1;
        if(player_2.life == 0){
            player_2_life_sprite.src = '';
            player_2.src = player_2_killed.src;
            setTimeout(function (){
              game_over = true;
            }, 1000);
            
        }
      }

      player_2.killPlayer = function() {
        if (this.life > 0) {
          this.dead = true;
          //evilShotsBuffer.splice(0, evilShotsBuffer.length);
          player_2_bullets.splice(0, player_2_bullets.length);
          this.src = player_2_killed.src;
          //createNewEvil();
          setTimeout(function () {
            player_2 = new Player_2(player_2.life - 1, player_2.score);
          }, 500);
        } else {
          //saveFinalScore();
          youLoose = true;
        }
      };
      return player_2;
    }

    function playerAction() {
      player_1.doAnything();
      if(Jugadores == 2){
        player_2.doAnything();
      }
    }
    // --------------------------------------------------------------- Fin jugadores ---------------------------------------------------------------

    // ------------------------------------------------------------------ Enemigos -----------------------------------------------------------------
    function Enemy_1 () {
      var settings = {
        marginBottom : 60,
        defaultHeight : 66
      }
      enemy_1 = new Image ();
      enemy_1.src = "images/pepino.png";
      enemy_1.posX = 860;
      enemy_1.posY = canvas.height - (enemy_1.height == 0 ? settings.defaultHeight : enemy_1.height) - settings.marginBottom;
      enemy_1_carril.x = 171.43;
      enemy_1_carril.y = 120;
      enemy_1.life = enemy_1_life;
      enemy_1.speed = 5;
      enemy_1.shots = 100;
      enemy_1.dead = false;
      enemy_1.bulletY = 524;

      enemy_1.kill = function() {
        enemy_1.dead = true;
        // se cambia al siguiente enemigo
        enemy_1.src = enemy_1_sprite.killed.src;
        setTimeout(function () {
            the_end = true;
        }, 1000);            
      };

      enemy_1.hit = function () {
        enemy_1.src = enemy_1_sprite.damaged.src;
      }
      
      function cambio_carril_1 (carril){
        switch(carril){
          case 0:
            enemy_1.bulletY = 524;
            enemy_1_carril.x = 171.43;
            enemy_1_carril.y = 120;
            break;
          case 1:
            enemy_1.bulletY = 504;
            enemy_1_carril.x = 133.3;
            enemy_1_carril.y = 85.71;
            break;
          case 2: 
            enemy_1.bulletY = 494;
            enemy_1_carril.x = 92.3;
            enemy_1_carril.y = 54.54;
            break;
        }
      }

      function shoot() {
        if(enemy_1_life > 0){
          setTimeout(function (){
            enemy_1_shoot = new Enemy_1_Shoot(enemy_1.posX , enemy_1.bulletY);
            enemy_1_shoot.x = enemy_1_carril.x*0.8;
            enemy_1_shoot.y = enemy_1_carril.y*0.8;
            enemy_1_shoot.add();
            shoot();
            var random_carril = getRandomNumber(0, 2);
            cambio_carril_1(random_carril);
          }, getRandomNumber(500, 1500));
        }
      }
      setTimeout(function() {
        shoot();
      }, 1000 + getRandomNumber(2500));

      return enemy_1; 
    }


    function Enemigo_1 () {
      Object.getPrototypeOf(Enemigo_1.prototype).constructor.call(this, enemy_1_life, enemy_1_bullet, "images/pepino.png");
    }
    Enemigo_1.prototype = Object.create(Enemy_1.prototype);
    Enemigo_1.prototype.constructor = Enemigo_1;
    // ---------------------------------------------------------------- Fin enemigos ---------------------------------------------------------------


    // ------------------------------------------------------------------ Disparos -----------------------------------------------------------------
    function Shoot( x, y, array, img) {
      this.posX = x;
      this.posY = y;
      this.image = img;
      this.speed = 5; 
      this.identifier = 0;
      this.add = function () {
        array.push(this);
      };
      this.deleteShot = function (idendificador) {
        arrayRemove(array, idendificador);
      };
    }

    // actualizacion del disparo del jugador 1
    function Player_1_Shoot (x, y, bullet_x, bullet_y) {
      Object.getPrototypeOf(Player_1_Shoot.prototype).constructor.call(this, x, y, player_1_bullets, player_1_bullet);
    }
    Player_1_Shoot.prototype = Object.create(Shoot.prototype);
    Player_1_Shoot.prototype.constructor = Player_1_Shoot;
  
    // actualizacion del disparo del jugador 2
    function Player_2_Shoot (x, y, bullet_x, bullet_y) {
      Object.getPrototypeOf(Player_2_Shoot.prototype).constructor.call(this, x, y, player_2_bullets, player_2_bullet);
    }
    Player_2_Shoot.prototype = Object.create(Shoot.prototype);
    Player_2_Shoot.prototype.constructor = Player_2_Shoot;


    function Enemy_1_Shoot (x, y) {
      Object.getPrototypeOf(Enemy_1_Shoot.prototype).constructor.call(this, x, y, enemy_1_bullets, enemy_1_bullet);
      //console.log("creada la bala");
    }
    Enemy_1_Shoot.prototype = Object.create(Shoot.prototype);
    Enemy_1_Shoot.prototype.constructor = Enemy_1_Shoot;

    function checkCollisions(shot) {
      switch(enemy_id){
        case 0:
          // ------------------------- colisiones con el enemigo 1
          if(player_carril_n(shot) == enemy_1_carril_n(enemy_1_carril)){
            if((shot.posX >= enemy_1.posX-3) &&(shot.posX <= enemy_1.posX + 3)){
              enemy_1_life -= 1;
              console.log(enemy_1_life);
              if(enemy_1_life == 0){
                enemy_1.kill();
              }          
              shot.deleteShot(parseInt(shot.identifier));
              return true;
            } 
          }
          break;
        case 1:
            if (player_carril_n(shot) == enemy_2_carril_n(enemy_2_carril)) {
                if ((shot.posX >= enemy_2.posX - 3) && (shot.posX <= enemy_2.posX + 3)) {
                    enemy_2_life -= 1;
                    enemy_2.src = enemy_2_sprite.damaged.src;
                    setTimeout(function () {
                        enemy_2.src = "images/laser.png";
                    }, 100)
                    //console.log(enemy_2_life);
                    if (enemy_2_life == 0) {
                        enemy_2.kill();
                    }
                    shot.deleteShot(parseInt(shot.identifier));
                    return true;
                }
            }
          return true; 
          break;
        case 2:
            if (player_carril_n(shot) == enemy_3_carril_n(enemy_3_carril)) {
                if ((shot.posX >= enemy_3.posX - 3) && (shot.posX <= enemy_3.posX + 3)) {
                    enemy_3_life -= 1;
                    enemy_3.src = enemy_3_sprite.damaged.src;
                    setTimeout(function () {
                        enemy_3.src = "images/tostadora.png";
                    }, 100);
                    //console.log(enemy_3_life);
                    if (enemy_3_life == 0) {
                        enemy_3.kill();
                    }
                    shot.deleteShot(parseInt(shot.identifier));
                    return true;
                }
            }
            return true;
            break;
      }       
      return true;   
    }

    function checkCollisions_Enemy_1 (shoot){
      if(FIREFOX){
        if(enemy_1_carril_n(shoot) == player_carril_n_2(player_1)){
          if(player_carril_n_2(player_1) == 0){
            if((shoot.posX >= (player_1.posX + 192)) && (shoot.posX <= (player_1.posX + 198))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n_2(player_1) == 1){
            if((shoot.posX >= (player_1.posX + 132)) && (shoot.posX <= (player_1.posX + 138))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n_2(player_1) == 2){
            if((shoot.posX >= (player_1.posX + 52)) && (shoot.posX <= (player_1.posX + 58))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
        }
        if(Jugadores == '2'){
          if(enemy_1_carril_n(shoot) == player_carril_n_2(player_2)){
            if(player_carril_n_2(player_2) == 0){
              if((shoot.posX >= (player_2.posX + 192)) && (shoot.posX <= (player_2.posX + 198))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n_2(player_2) == 1){
              if((shoot.posX >= (player_2.posX + 132)) && (shoot.posX <= (player_2.posX + 138))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n_2(player_2) == 2){
              if((shoot.posX >= (player_2.posX + 52)) && (shoot.posX <= (player_2.posX + 58))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
          }
        }
      }else{
        if(enemy_1_carril_n(shoot) == player_carril_n(player_1)){
          if(player_carril_n(player_1) == 0){
            if((shoot.posX >= (player_1.posX + 192)) && (shoot.posX <= (player_1.posX + 198))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n(player_1) == 1){
            if((shoot.posX >= (player_1.posX + 132)) && (shoot.posX <= (player_1.posX + 138))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n(player_1) == 2){
            if((shoot.posX >= (player_1.posX + 52)) && (shoot.posX <= (player_1.posX + 58))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
        }
        if(Jugadores == '2'){
          if(enemy_1_carril_n(shoot) == player_carril_n(player_2)){
            if(player_carril_n(player_2) == 0){
              if((shoot.posX >= (player_2.posX + 192)) && (shoot.posX <= (player_2.posX + 198))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n(player_2) == 1){
              if((shoot.posX >= (player_2.posX + 132)) && (shoot.posX <= (player_2.posX + 138))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n(player_2) == 2){
              if((shoot.posX >= (player_2.posX + 52)) && (shoot.posX <= (player_2.posX + 58))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
          }
        }
      }
      return true;
    }

    function updatePlayer_1_Shoot(player_1_shoot, id) {
      if (player_1_shoot) {
        player_1_shoot.identifier = id;
        if (checkCollisions(player_1_shoot)) {
          if (player_1_shoot.posX < 1200) {
            player_1_shoot.posX += 5;
            bufferctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y);            
          } else {
            player_1_shoot.deleteShot(parseInt(player_1_shoot.identifier));
          }
        }
      }
    }

    function updatePlayer_2_Shoot(player_2_shoot, id) {
      if (player_2_shoot) {
        player_2_shoot.identifier = id;
        if (checkCollisions(player_2_shoot)) {
          if (player_2_shoot.posX < 1200) {
            player_2_shoot.posX += 5;
            bufferctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);            
          } else {
            player_2_shoot.deleteShot(parseInt(player_2_shoot.identifier));
          }
        }   
      }
    }

    function updateEnemy_1_Shoot(enemy_1_shoot, id) {
      if (enemy_1_shoot) {
        enemy_1_shoot.identifier = id;
        if (checkCollisions_Enemy_1(enemy_1_shoot)) {
          if (enemy_1_shoot.posX >= 0) {
            enemy_1_shoot.posX -= 5
            //console.log(enemy_1_carril_n(enemy_1_shoot) + " " + player_carril_n(player_1));
            if(enemy_1_carril_n(enemy_1_shoot) > player_carril_n(player_1)){
              //console.log(enemy_1_shoot.posX + " " + player_1.posX);
              //bufferctx.drawImage(enemy_1_shoot.image, enemy_1_shoot.posX, enemy_1_shoot.posY, enemy_1_shoot.x, enemy_1_shoot.y);
              if((enemy_1_shoot.posX > player_1.posX + 192)||(enemy_1_shoot.posX < player_1.posX)){
                bufferctx.drawImage(enemy_1_shoot.image, enemy_1_shoot.posX, enemy_1_shoot.posY, enemy_1_shoot.x, enemy_1_shoot.y);
              }
            }else{
              bufferctx.drawImage(enemy_1_shoot.image, enemy_1_shoot.posX, enemy_1_shoot.posY, enemy_1_shoot.x, enemy_1_shoot.y);
            }    
          } else {
            enemy_1_shoot.deleteShot(parseInt(enemy_1_shoot.identifier));
          }
        }
      }
    }
    // ---------------------------------------------------------------- Fin disparos ---------------------------------------------------------------

    // ------------------------------------------------------------------ Teclado ------------------------------------------------------------------
    // funcion del input
    function addListener(element, type, expression, bubbling) {
      bubbling = bubbling || false;
      if (window.addEventListener) { // Standard
          element.addEventListener(type, expression, bubbling);
      } else if (window.attachEvent) { // IE
          element.attachEvent('on' + type, expression);
      }
      //console.log("input con exito");
    }
    // tecla pulsada
    function keyDown(e) {
      var key = (window.event ? e.keyCode : e.which);
      for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
          e.preventDefault();
          keyPressed[inkey] = true;
        }
      }
    }
    // tecla soltada
    function keyUp(e) {
      var key = (window.event ? e.keyCode : e.which);
      for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
            e.preventDefault();
            keyPressed[inkey] = false;
        }
      }
    }
  
    // ---------------------------------------------------------------- Fin teclado ----------------------------------------------------------------
  
    // ------------------------------------------------------------------ Gameloop -----------------------------------------------------------------
    // funcion update
    function update() {    
      drawBackground();

      if (the_end) {
        saveScore();
        window.location.href = "nivel2m.html";
        return;
        //return;
      }

      if (game_over) {
        localStorage.setItem("win", 0);            
        //Perder en el primer enemigo no puntua
        localStorage.setItem("puntos", 0);          
        window.location.href = "game_over.html";
        return;
      }
    
      drawPlayers ();
      drawShoots ();

      showLifeAndScore();

      playerAction();
    }

  
    // ---------------------------------------------------------------- Fin gameloop ---------------------------------------------------------------

    // ------------------------------------------------------------ Funciones de pintado -----------------------------------------------------------
    // pintado del fondo de pantalla
    function drawBackground() {
      var background;
      background = fondo_principal;
      bufferctx.drawImage(background, 0, 0);
    }

    // pintado de todo aquello presente en la pantalla
    function draw() {
      // coge tambien el tamaño de la ventana del navegador
      ctx.drawImage(buffer, 0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(button_left, 50, 50, 75, 75);
      ctx.drawImage(button_right, 170, 50, 75, 75);
      ctx.drawImage(button_up, 110, 20, 75, 75);
      ctx.drawImage(button_down, 110, 80, 75, 75);
      ctx.drawImage(button_attack, 460, 50, 75, 75);
    }

    // pinta los jugadores
    function drawPlayers() {
      if (FIREFOX) {
        bufferctx.drawImage(player_1, player_1.posX, player_1.posY + 270, player_1_carril.x, player_1_carril.y);
        if (Jugadores == 2) {
            bufferctx.drawImage(player_2, player_2.posX, player_2.posY + 270, player_2_carril.x, player_2_carril.y);
        }
        if (enemy_1_life > 0) {
            bufferctx.drawImage(enemy_1, enemy_1.posX, enemy_1.posY + 250, enemy_1_carril.x, enemy_1_carril.y);
        }
               
      } else {
        bufferctx.drawImage(player_1, player_1.posX, player_1.posY, player_1_carril.x, player_1_carril.y);
        if (Jugadores == 2) {
            bufferctx.drawImage(player_2, player_2.posX, player_2.posY, player_2_carril.x, player_2_carril.y);
        }
        if(enemy_1_life > 0){
            bufferctx.drawImage(enemy_1, enemy_1.posX, enemy_1.posY, enemy_1_carril.x, enemy_1_carril.y);
        }
      }     
    }

    // pinta las balas de los personajes
    function drawShoots (){
      for (var j = 0; j < player_1_bullets.length; j++) {
        var disparoBueno = player_1_bullets[j];
        updatePlayer_1_Shoot(disparoBueno, j);
      }
      for (var j = 0; j < player_2_bullets.length; j++) {
        var disparoBueno = player_2_bullets[j];
        updatePlayer_2_Shoot(disparoBueno, j);
      }
        if(enemy_1_life > 0){
            for (var i = 0; i < enemy_1_bullets.length; i++) {
                var disparoMalo = enemy_1_bullets[i];
                updateEnemy_1_Shoot(disparoMalo, i);
            }
        }
    }

    // interfaz del juego
    function showLifeAndScore () {
      bufferctx.fillStyle="rgb(256,256,256)";
      bufferctx.font="bold 16px Arial";
      if(Jugadores == 2){
        switch(player_1.life){
          case 3:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 40, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 80, 10, 35, 35 );
            break;
          case 2:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 40, 10, 35, 35 );
            break;
          case 1:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            break;
          case 0:
           break;
        }
        switch(player_2.life){
          case 3:
            bufferctx.drawImage(player_2_life_sprite, 0, 50, 35, 35 );
            bufferctx.drawImage(player_2_life_sprite, 40, 50, 35, 35 );
            bufferctx.drawImage(player_2_life_sprite, 80, 50, 35, 35 );
            break;
          case 2:
            bufferctx.drawImage(player_2_life_sprite, 0, 50, 35, 35 );
            bufferctx.drawImage(player_2_life_sprite, 40, 50, 35, 35 );
            break;
          case 1:
            bufferctx.drawImage(player_2_life_sprite, 0, 50, 35, 35 );
            break;
          case 0:
            break;        
        }
      }else{
        switch(player_1.life){
          case 3:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 40, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 80, 10, 35, 35 );
            break;
          case 2:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            bufferctx.drawImage(player_1_life_sprite, 40, 10, 35, 35 );
            break;
          case 1:
            bufferctx.drawImage(player_1_life_sprite, 0, 10, 35, 35 );
            break;
          case 0:
            break;
        }
      }   
    }
    function GatoDañado(){
        myMusic= new sound("sound/golpe_al_gatini_1.wav");
        myMusic.play();
    }
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "volume");
        this.sound.volume=0.1;
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }  
        //Esta funcion cambia el volumen
        this.changeVolume= function(newVolume){
          this.sound.volume=newVolume;
        }  
      }
    // fin de partida: calcular puntuacion
    function saveScore() {
        //Obtener en segundos el tiempo que ha pasado desde el inicio del juego
        fecha = new Date ();
        var segundos_f = fecha.getTime()/1000;
        //var minutos_f = fecha.getMinutes();
        //var minutos_m = minutos_f - minutos_0;
        var segundos = segundos_f - segundos_0;
        console.log(segundos_f + " - " + segundos_0 + " = " + segundos);
        
        //Calcular puntos segun el tiempo y el numero de enemigos --> Primer enemigo: /0.5
        var puntos = parseInt(segundos / 0.5);
        console.log("ptos: " + puntos);
        //Guardar en memoria
        localStorage.setItem("puntos", puntos);
        the_end = false;   
    }
    // ------------------------------------------------------- FIn funciones de pintado -------------------------------------------------------
  //}

  return {
    init: init
  }
})();


/* ------------------------------------------------------- Notas de cara a programar -----------------------------------------------------------
  
  Para ordenar las imagenes en torno al eje z, añadiremos una propiedad a cada elemento a dibujar que sera 'eje z' y este cambiará
  en función de la profundiad que haya.

  Posteriormente crearemos un metodo que los ordene de mayor profundidad a menor, y acto seguido se dibujaran. Este metodo se llamara cada vez
  que se vaya a dibujar en pantalla
*/ 
// ----------------------------------------------------- Fin Notas de cara a programar ---------------------------------------------------------