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
  
    // === Renderizar Productos ===
    function renderizarProductos(lista) {
      contenedor.innerHTML = "";
      lista.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
          <img src="${producto.image}" alt="${producto.title}">
          <h3>${producto.title}</h3>
          <p>$${producto.price.toFixed(2)}</p>
          <p class="categoria">${producto.category}</p>
          <button data-id="${producto.id}">Agregar</button>
        `;
        contenedor.appendChild(card);
  
        gsap.from(card, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
      });
  
      // Botones Agregar
      document.querySelectorAll(".producto button").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = parseInt(e.target.dataset.id);
          const seleccionado = productos.find(p => p.id === id);
          agregarAlCarrito(seleccionado);
        });
      });
    }
  
    // === Renderizar Categorías ===
    function renderizarCategorias() {
      const categorias = ["Todas las categorías", ...new Set(productos.map(p => p.category))];
      filtroCategoria.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }
  
    // === Filtrar y Ordenar ===
    function aplicarFiltrosYOrden() {
      let filtrados = [...productos];
  
      const categoriaSeleccionada = filtroCategoria.value;
      if (categoriaSeleccionada && categoriaSeleccionada !== "Todas las categorías") {
        filtrados = filtrados.filter(p => p.category === categoriaSeleccionada);
      }
  
      const termino = busqueda.value.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.title.toLowerCase().includes(termino) || 
        p.description.toLowerCase().includes(termino)
      );
  
      switch (ordenar.value) {
        case "precio-asc":
          filtrados.sort((a, b) => a.price - b.price);
          break;
        case "precio-desc":
          filtrados.sort((a, b) => b.price - a.price);
          break;
        case "nombre":
          filtrados.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
  
      renderizarProductos(filtrados);
    }
  
    