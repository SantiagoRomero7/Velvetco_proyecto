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

  document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://fakestoreapi.com/products";
    const contenedor = document.getElementById("contenedor-productos");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const ordenar = document.getElementById("ordenar");
    const busqueda = document.getElementById("busqueda");
    const verCarrito = document.getElementById("ver-carrito");
    const cerrarCarrito = document.getElementById("cerrar-carrito");
    const carritoAside = document.getElementById("carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
  
    let productos = [];
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  
    // === Fetch de Productos ===
    async function obtenerProductos() {
      try {
        const respuesta = await fetch(API_URL);
        productos = await respuesta.json();
        renderizarCategorias();
        renderizarProductos(productos);
      } catch (error) {
        contenedor.innerHTML = "<p>Error al cargar productos.</p>";
        console.error(error);
      }
    }
  
    