const createMenuIcon = (prod) => {
  const menu = document.createElement("div");
  menu.className = "menu-icon";
  menu.innerHTML = `
    <div class="icon-cart">
      <span class="material-symbols-outlined" data-state="default">shopping_cart</span>
    </div>
    <div class="icon-favorite">
      <span class="material-symbols-outlined" data-state="default">star</span>
    </div>
  `;

  const cartIcon = menu.querySelector(".icon-cart span");
  const favIcon = menu.querySelector(".icon-favorite span");
  
  cartIcon.addEventListener("click", (e) => {//CODIGO PARA CAMBIAR EL ICONO DEL CARRITO
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
    const isDefault = cartIcon.getAttribute("data-state") === "default"; // SE USA EL ATRIBUTO DATA-STATE PARA SABER SI EL ICONO ES DEFAULT O NO
    cartIcon.textContent = isDefault ? "shopping_cart_off" : "shopping_cart";//SI EL ATRIBUTO ES DEFAULT CAMBIA EL ICONO A shopping_cart_off Y SI NO CAMBIA A shopping_cart
    cartIcon.setAttribute("data-state", isDefault ? "off" : "default");
  });

  favIcon.addEventListener("click", (e) => {//SE HACE LO MISMO QUE ARRIBA PERO CON EL ICONO DE FAVORITO
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
    const isDefault = favIcon.getAttribute("data-state") === "default";
    favIcon.textContent = isDefault ? "stars" : "star";
    favIcon.setAttribute("data-state", isDefault ? "on" : "default");
  });

  favIcon.addEventListener("click", async () => { //EVENTO PARA AGREGAR A FAVORITOS
    try {
      console.log("Agregando favorito con ID:", prod._id);
      await fetch("/api/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: prod._id }) 
      });
      console.log("Producto agregado a favoritos");
    } catch (err) {
      console.error("Error al agregar a favoritos:", err);
    }
  });

  cartIcon.addEventListener("click", async () => { //EVENTO PARA AGREGAR A CARRITO
    try {
      console.log("Agregando al carrito con ID:", prod._id);
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: prod._id }) 
      });
      console.log("Producto agregado al carrito");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
    }
  });

  return menu;
};

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-container");
  const form = document.querySelector(".text_search");
  const input = document.querySelector(".bar_search");
  const iconSearch = document.querySelector(".icon-search");

  iconSearch.addEventListener("click", () => {
    form.requestSubmit(); // Hace que se dispare el evento submit del formulario
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`/api/products/search/${encodeURIComponent(query)}`);
      const products = await res.json();
      renderProducts(products);
    } catch (err) {
      console.error("Error al buscar productos:", err);
    }
  });
  // FUNCIONES AUXILIARES
  const renderProducts = (products) => {
    container.innerHTML = ""; // Limpiar contenedor

    if (products.length === 0) {
      container.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }

    products.forEach(prod => {
      const link_card = document.createElement("a");
      link_card.href = `/products/${prod._id}`;
      link_card.className = "product-link-card";

      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${prod.imageUrl}" alt="${prod.name}" />
        <h3>${prod.name}</h3>
        <strong>$${prod.price}</strong>
      `;

      const menu = createMenuIcon(prod);
      menu.style.display = "none";
      div.appendChild(menu);

      div.addEventListener("mouseenter", () => {
        menu.style.display = "flex";
      });
      div.addEventListener("mouseleave", () => {
        menu.style.display = "none";
      });

      link_card.appendChild(div);
      container.appendChild(link_card);
    });
  };

  const loadAllProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const productos = await response.json();
      renderProducts(productos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  // 🔍 Buscador
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`/api/products/search/${encodeURIComponent(query)}`);
      const products = await res.json();
      renderProducts(products);
    } catch (err) {
      console.error("Error al buscar productos:", err);
      container.innerHTML = "<p>Error al buscar productos.</p>";
    }
  });

  // Cargar todos los productos inicialmente
  loadAllProducts();
});
