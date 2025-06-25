// === CARRUSEL AUTOMÁTICO CON ANIMACIONES ===
// Espera que el DOM esté completamente cargado para ejecutar el carrusel
document.addEventListener('DOMContentLoaded', () => {
  // Selecciona todas las imágenes del carrusel y los botones para avanzar o retroceder
  const imagenes = document.querySelectorAll('.carousel img');
  const btnPrev = document.querySelector('.prev');
  const btnNext = document.querySelector('.next');
  let actual = 0; // Índice de la imagen actualmente mostrada en el carrusel
  let intervalo;  // Variable para controlar el temporizador de rotación automática

  // Función que muestra una imagen según el índice recibido
  // Aplica una animación de entrada con GSAP a la imagen visible
  function mostrarImagen(index) {
    imagenes.forEach((img, i) => {
      if (i === index) {
        img.classList.add('active');
        gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1 });
      } else {
        img.classList.remove('active');
      }
    });
  }

  // Cambia a la siguiente imagen del carrusel (cíclico)
  function siguienteImagen() {
    actual = (actual + 1) % imagenes.length;
    mostrarImagen(actual);
  }

  // Cambia a la imagen anterior del carrusel (cíclico hacia atrás)
  function anteriorImagen() {
    actual = (actual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(actual);
  }

  // Agrega funcionalidad a los botones: al hacer clic, cambia la imagen y reinicia el temporizador
  btnNext.addEventListener('click', () => {
    siguienteImagen();
    reiniciarIntervalo();
  });

  btnPrev.addEventListener('click', () => {
    anteriorImagen();
    reiniciarIntervalo();
  });

  // Inicia el intervalo de cambio automático de imagen cada 5 segundos
  function iniciarIntervalo() {
    intervalo = setInterval(siguienteImagen, 5000);
  }

  // Reinicia el intervalo si el usuario interactúa manualmente
  function reiniciarIntervalo() {
    clearInterval(intervalo);
    iniciarIntervalo();
  }

  // Muestra la imagen inicial y activa el carrusel automático
  mostrarImagen(actual);
  iniciarIntervalo();
});


// === LÓGICA PRINCIPAL DE LA TIENDA ONLINE ===
document.addEventListener("DOMContentLoaded", () => {
  // Referencia a la API y elementos del DOM
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

  // Variables globales
  let productos = []; // Array con los productos obtenidos desde la API
  let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Carrito recuperado de localStorage si existe

  // Fetch a la API para obtener los productos
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

  // Renderiza las tarjetas de productos en el DOM con animación
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

      // Animación de entrada
      gsap.from(card, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });
    });

    // Agrega funcionalidad a cada botón "Agregar"
    document.querySelectorAll(".producto button").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        const seleccionado = productos.find(p => p.id === id);
        agregarAlCarrito(seleccionado);
      });
    });
  }

  // Genera dinámicamente las opciones de categorías
  function renderizarCategorias() {
    const categorias = ["Todas las categorías", ...new Set(productos.map(p => p.category))];
    filtroCategoria.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  }

  // Filtra, busca y ordena productos según lo que seleccione o escriba el usuario
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

  // Agrega un producto al carrito o incrementa su cantidad si ya existe
  function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito();
    renderizarCarrito();
  }

  // Elimina un producto del carrito por su ID
  function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    renderizarCarrito();
  }

  // Guarda el carrito actual en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // Muestra el contenido actual del carrito y su total
  function renderizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.title} x${item.cantidad} - $${(item.price * item.cantidad).toFixed(2)}
        <button data-id="${item.id}">X</button>
      `;
      listaCarrito.appendChild(li);
      total += item.price * item.cantidad;

      // Elimina individualmente desde el carrito
      li.querySelector("button").addEventListener("click", () => {
        eliminarDelCarrito(item.id);
      });
    });

    totalCarrito.textContent = total.toFixed(2);
  }

  // === EVENTOS DE INTERACCIÓN CON LA INTERFAZ ===
  filtroCategoria.addEventListener("change", aplicarFiltrosYOrden);
  ordenar.addEventListener("change", aplicarFiltrosYOrden);
  busqueda.addEventListener("input", aplicarFiltrosYOrden);

  verCarrito.addEventListener("click", () => {
    carritoAside.classList.remove("oculto");
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoAside.classList.add("oculto");
  });

  // Inicializa la app: carga productos y carrito
  obtenerProductos();
  renderizarCarrito();
});


// Añade sombra al header cuando el usuario hace scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('.encabezado');
  if (window.scrollY > 20) {
    header.classList.add('con-sombra');
  } else {
    header.classList.remove('con-sombra');
  }
});
