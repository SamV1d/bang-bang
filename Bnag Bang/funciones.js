function jugar(){
    ponerBG();
    setTimeout(function(){
        window.location.assign('personaje.html');
    }, 2200);
    var sfxStart = new Audio('sfx/start.mp3');
    sfxStart.play();
}

function ponerBG(){
    document.querySelector('.bg-transicion').classList.add('bg-transicion-show');
}

function quitarBG(){
    document.querySelector('.bg-transicion').style.backgroundColor = "rgba(0, 0, 0, .0)";
    setTimeout(function(){
        document.querySelector('.bg-transicion').classList.remove('bg-transicion-show');
    }, 1500);
}

let personajeActual = 1;

function siguientePersonaje(){
    personajeActual++;
    if(personajeActual == 7){ personajeActual = 1; }
    document.getElementById('personaje').src = 'img/p'+personajeActual+'.png';
    new Audio('sfx/clic.mp3').play();
}

function anteriorPersonaje(){
    personajeActual--;
    if(personajeActual == 0){ personajeActual = 6; }
    document.getElementById('personaje').src = 'img/p'+personajeActual+'.png';
    new Audio('sfx/clic.mp3').play();
}

function seleccionarPersonaje(){
    localStorage.setItem('personaje1', personajeActual);
    localStorage.setItem('jugador1', document.getElementById('jugador1').value);
    ponerBG();
    setTimeout(function(){
        window.location.assign('personaje2.html');
    }, 2000);
    new Audio('sfx/ok2.mp3').play();
}

function comenzarJuego(){
    localStorage.setItem('personaje2', personajeActual);
    localStorage.setItem('jugador2', document.getElementById('jugador2').value);
    ponerBG();
    setTimeout(function(){
        window.location.assign('juego.html');
    }, 2000);
    new Audio('sfx/start.mp3').play();
}

// Variable global para controlar si ya alguien disparó en esta ronda
let disparoHecho = false;

function cargarEscenario(){
    // Inicializar marcadores si no existen
    if(!localStorage.getItem('marcador1')){
        localStorage.setItem('marcador1', '0');
        localStorage.setItem('marcador2', '0');
    }
    marcador1 = parseInt(localStorage.getItem('marcador1'));
    marcador2 = parseInt(localStorage.getItem('marcador2'));

    // Mostrar calaveras acumuladas
    for(var i = 0; i < marcador1; i++){
        document.querySelector('.vidas2').innerHTML += "<img src='img/calavera.png'>";
    }
    for(var i = 0; i < marcador2; i++){
        document.querySelector('.vidas1').innerHTML += "<img src='img/calavera.png'>";
    }

    // Fondo aleatorio
    var bg = Math.floor(Math.random()*3)+1;
    document.querySelector('.bg-juego').style.backgroundImage = "url('img/bg"+bg+".png')";

    // Cargar nombres e imágenes
    var nombreJ1 = localStorage.getItem('jugador1');
    var nombreJ2 = localStorage.getItem('jugador2');
    var pj1 = localStorage.getItem('personaje1');
    var pj2 = localStorage.getItem('personaje2');

    document.getElementById('jugador1').textContent = nombreJ1;
    document.getElementById('jugador2').textContent = nombreJ2;
    document.getElementById('img-p1').src = 'img/p'+pj1+'.png';
    document.getElementById('img-p2').src = 'img/p'+pj2+'.png';

    // Verificar si hay ganador final (3 victorias)
    if(marcador1 >= 3 || marcador2 >= 3){
        document.querySelector('.ganador').style.display = "block";
        document.querySelector('.conteo').style.display = "none";
        // Ocultar campo de juego
        document.querySelector('.left').style.display = "none";
        document.querySelector('.right').style.display = "none";

        if(marcador1 >= 3){
            document.querySelector('#nombreGanador').innerHTML = nombreJ1;
            document.querySelector('#imgGanador').setAttribute('src', 'img/p'+pj1+'.png');
        } else {
            document.querySelector('#nombreGanador').innerHTML = nombreJ2;
            document.querySelector('#imgGanador').setAttribute('src', 'img/p'+pj2+'.png');
        }
    } else {
        // Ocultar pantalla de ganador y mostrar conteo
        document.querySelector('.ganador').style.display = "none";
        document.querySelector('.conteo').style.display = "block";
        // Resetear estado de disparo
        disparoHecho = false;
        // Mostrar mensaje ¿Listos?
        listos();
    }
}

function listos(){
    setTimeout(function(){
        document.querySelector('.msj').style.opacity = "1";
    }, 500);
}

function conteo(){
    // Evitar que se active el conteo más de una vez
    document.querySelector('.msj').removeAttribute('onclick');
    disparoHecho = false;

    var sfxclic = new Audio('sfx/clic.mp3');

    document.querySelector('.msj').style.opacity = "0";
    document.querySelector('.no3').style.opacity = "1";
    sfxclic.play();

    setTimeout(function(){
        document.querySelector('.no3').style.opacity = "0";
        document.querySelector('.no2').style.opacity = "1";
        new Audio('sfx/clic.mp3').play();

        setTimeout(function(){
            document.querySelector('.no2').style.opacity = "0";
            document.querySelector('.no1').style.opacity = "1";
            new Audio('sfx/clic.mp3').play();

            // Tiempo aleatorio entre 1 y 10 segundos
            var tiempoRandom = (Math.floor(Math.random() * 10) + 1) * 1000;

            setTimeout(function(){
                document.querySelector('.no1').style.opacity = "0";
                // Ocultar el conteo y HABILITAR los disparos
                document.querySelector('.conteo').style.display = "none";
                new Audio('sfx/clic.mp3').play();
                // Ahora sí se puede disparar
                habilitarDisparos();
            }, tiempoRandom);

        }, 1000);
    }, 1000);
}

function habilitarDisparos(){
    document.querySelector('.left').setAttribute('onclick', 'disparo1()');
    document.querySelector('.right').setAttribute('onclick', 'disparo2()');
}

function disparo1(){
    // Si ya se hizo un disparo en esta ronda, ignorar
    if(disparoHecho) return;
    disparoHecho = true;

    // Deshabilitar ambos lados inmediatamente
    document.querySelector('.left').setAttribute('onclick', '');
    document.querySelector('.right').setAttribute('onclick', '');

    // Animación: p2 cae/sale, p1 retrocede levemente
    document.querySelector('.p2').style.right = "-800px";
    document.querySelector('.p1').style.left = "10px";
    setTimeout(function(){
        document.querySelector('.p1').style.left = "30px";
    }, 150);

    marcador1++;
    localStorage.setItem('marcador1', marcador1);

    new Audio('sfx/disparo.mp3').play();

    setTimeout(function(){
        window.location.assign('juego.html');
    }, 2000);
}

function disparo2(){
    // Si ya se hizo un disparo en esta ronda, ignorar
    if(disparoHecho) return;
    disparoHecho = true;

    // Deshabilitar ambos lados inmediatamente
    document.querySelector('.left').setAttribute('onclick', '');
    document.querySelector('.right').setAttribute('onclick', '');

    // Animación: p1 cae/sale, p2 retrocede levemente
    document.querySelector('.p1').style.left = "-800px";
    document.querySelector('.p2').style.right = "10px";
    setTimeout(function(){
        document.querySelector('.p2').style.right = "30px";
    }, 150);

    marcador2++;
    localStorage.setItem('marcador2', marcador2);

    new Audio('sfx/disparo.mp3').play();

    setTimeout(function(){
        window.location.assign('juego.html');
    }, 2000);
}

function restart(){
    localStorage.setItem('marcador1', '0');
    localStorage.setItem('marcador2', '0');
    ponerBG();
    setTimeout(function(){
        window.location.assign('index.html');
    }, 800);
}