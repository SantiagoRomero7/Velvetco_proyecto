
document.addEventListener('DOMContentLoaded', () => {
    const imagenes = document.querySelectorAll('.carousel img');
    const btnPrev = document.querySelector('.prev');
    const btnNext = document.querySelector('.next');
    let indiceActual = 0;
    let intervalo;
  
    function mostrarImagen(index) {
      imagenes.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
    }
  
    function siguienteImagen() {
      indiceActual = (indiceActual + 1) % imagenes.length;
      mostrarImagen(indiceActual);
    }
  
    function anteriorImagen() {
      indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
      mostrarImagen(indiceActual);
    }
  
    btnNext.addEventListener('click', () => {
      siguienteImagen();
      reiniciarIntervalo();
    });
  
    btnPrev.addEventListener('click', () => {
      anteriorImagen();
      reiniciarIntervalo();
    });
  
    function iniciarIntervalo() {
      intervalo = setInterval(siguienteImagen, 5000);
    }
  
    function reiniciarIntervalo() {
      clearInterval(intervalo);
      iniciarIntervalo();
    }
  
    mostrarImagen(indiceActual);
    iniciarIntervalo();
  });
  