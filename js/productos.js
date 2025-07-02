// === CARRUSEL AUTOMÁTICO CON ANIMACIONES ===

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
        gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 1 });
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


// === LÓGICA PRINCIPAL DE LA TIENDA ONLINE ===
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://fakestoreapi.com/products";
  const contenedor = document.getElementById("contenedor-productos");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const ordenar = document.getElementById("ordenar");
  const busqueda = document.getElementById("busqueda");
  const verFavoritos = document.getElementById("ver-favoritos");
  const verCarrito = document.getElementById("ver-carrito");
  const cerrarCarrito = document.getElementById("cerrar-carrito");
  const carritoAside = document.getElementById("carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");

  let productos = [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

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
        <button data-id="${producto.id}" class="agregar-carrito">Agregar al carrito</button>
        <button data-id="${producto.id}" class="agregar-favoritos"> Favorito</button>
      `;
      contenedor.appendChild(card);

      gsap.from(card, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" });

      // Evento para agregar al carrito
      card.querySelector(".agregar-carrito").addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        const seleccionado = productos.find(p => p.id === id);
        agregarAlCarrito(seleccionado);
      });

      // Evento para agregar a favoritos
      card.querySelector(".agregar-favoritos").addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        const seleccionado = productos.find(p => p.id === id);
        agregarAFavoritos(seleccionado);
      });
    });
  }

  function renderizarCategorias() {
    const categorias = ["Todas las categorías", ...new Set(productos.map(p => p.category))];
    filtroCategoria.innerHTML = categorias.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  }

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

  function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    renderizarCarrito();
  }

  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function renderizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.title} <input type="number" min="1" value="${item.cantidad}" data-id="${item.id}" class="cantidad-input"> - $${(item.price * item.cantidad).toFixed(2)}
        <button data-id="${item.id}" class="eliminar">X</button>
      `;
      listaCarrito.appendChild(li);
      total += item.price * item.cantidad;

      li.querySelector(".eliminar").addEventListener("click", () => {
        eliminarDelCarrito(item.id);
      });

      li.querySelector(".cantidad-input").addEventListener("change", (e) => {
        const nuevaCantidad = parseInt(e.target.value);
        const producto = carrito.find(p => p.id === item.id);
        if (producto && nuevaCantidad > 0) {
          producto.cantidad = nuevaCantidad;
          guardarCarrito();
          renderizarCarrito();
        }
      });
    });

    totalCarrito.textContent = total.toFixed(2);
  }

  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
  });

  document.getElementById("realizar-compra").addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
    } else {
      alert("¡Gracias por tu compra! Se ha procesado correctamente.");
      carrito = [];
      guardarCarrito();
      renderizarCarrito();
    }
  });

  filtroCategoria.addEventListener("change", aplicarFiltrosYOrden);
  ordenar.addEventListener("change", aplicarFiltrosYOrden);
  busqueda.addEventListener("input", aplicarFiltrosYOrden);

  verCarrito.addEventListener("click", () => {
    carritoAside.classList.remove("oculto");
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoAside.classList.add("oculto");
  });

  // FAVORITOS
function agregarAFavoritos(producto) {
  if (!favoritos.some(p => p.id === producto.id)) {
    favoritos.push(producto);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    renderizarFavoritos();
  } else {
    alert("Este producto ya está en favoritos.");
  }
}

function eliminarDeFavoritos(id) {
  favoritos = favoritos.filter(p => p.id !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  renderizarFavoritos();
}

function renderizarFavoritos() {
  const listaFavoritos = document.getElementById("lista-favoritos");
  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<p>No tienes productos favoritos.</p>";
    return;
  }

  favoritos.forEach(producto => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}" width="50">
      <h4>${producto.title}</h4>
      <p>$${producto.price.toFixed(2)}</p>
      <button data-id="${producto.id}" class="eliminar-favorito">Eliminar</button>
    `;
    listaFavoritos.appendChild(li);

    li.querySelector(".eliminar-favorito").addEventListener("click", () => {
      eliminarDeFavoritos(producto.id);
    });
  });
}

verFavoritos.addEventListener("click", () => {
  renderizarFavoritos();
  document.getElementById("favoritos-aside").classList.remove("oculto");
});

document.getElementById("cerrar-favoritos").addEventListener("click", () => {
  document.getElementById("favoritos-aside").classList.add("oculto");
});

  // Inicialización
  obtenerProductos();
  renderizarCarrito();
  renderizarFavoritos();
});


// === SOMBRA AL HEADER AL HACER SCROLL ===
window.addEventListener('scroll', () => {
  const header = document.querySelector('.encabezado');
  if (window.scrollY > 20) {
    header.classList.add('con-sombra');
  } else {
    header.classList.remove('con-sombra');
  }
});