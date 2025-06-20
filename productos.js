document.addEventListener('DOMContentLoaded', () => {
    const imagenes = document.querySelectorAll('.carousel img');
    const btnPrev = document.querySelector('.prev');
    const btnNext = document.querySelector('.next');
    let actual = 0;
    let intervalo;
  
    function mostrarImagen(index) {
      imagenes.forEach((img, i) => {
        if (i === index) {
          img.classList.add('active');
          gsap.fromTo(img, {opacity: 0}, {opacity: 1, duration: 1});
        } else {
          img.classList.remove('active');
        }
      });
    }
  
    function siguienteImagen() {
      actual = (actual + 1) % imagenes.length;
      mostrarImagen(actual);
    }
  
    function anteriorImagen() {
      actual = (actual - 1 + imagenes.length) % imagenes.length;
      mostrarImagen(actual);
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
  
    mostrarImagen(actual);
    iniciarIntervalo();
  });
  