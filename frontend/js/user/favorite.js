const createMenuIcon = (prod) => {
  const menu = document.createElement("div");
  menu.className = "menu-icon";
  menu.innerHTML = `
    <div class="icon-cart">
      <span class="material-symbols-outlined" data-state="default">shopping_cart</span>
    </div>
    <div class="icon-favorite">
      <span class="material-symbols-outlined" data-state>stars</span>
    </div>
  `;

  const cartIcon = menu.querySelector(".icon-cart span");
  const favIcon = menu.querySelector(".icon-favorite span");
  
  cartIcon.addEventListener("click", (e) => { //CODIGO PARA CAMBIAR EL ICONO DEL CARRITO
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
    const isDefault = cartIcon.getAttribute("data-state") === "default"; // SE USA EL ATRIBUTO DATA-STATE PARA SABER SI EL ICONO ES DEFAULT O NO
    cartIcon.textContent = isDefault ? "shopping_cart_off" : "shopping_cart";//SI EL ATRIBUTO ES DEFAULT CAMBIA EL ICONO A shopping_cart_off Y SI NO CAMBIA A shopping_cart
    cartIcon.setAttribute("data-state", isDefault ? "off" : "default");
  });

  favIcon.addEventListener("click", async (e) => { //EVENTO PARA ELIMINAR UN DE FAVORITOS
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
    try {
      window.location.reload();
      console.log("Eliminando favorito con ID:", prod._id);
      await fetch("/api/favorites/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: prod._id }) 
      });
      console.log("Producto eliminado de favoritos");
    } catch (err) {
      console.error("Error al eliminar de favoritos:", err);
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
    const res = await fetch("/api/favorites", { credentials: "include" });
    const data = await res.json();

    const container = document.getElementById("favorites-container");
    data.favorites.forEach(product => { //LE PASAMOS EL PARAMETRO DE PRODUCTO A LA FUNCION PARA QUE PUEDA RECIBIR LA INFORMACION NECESARIA PARA ELIMINAR EL PRODUCTO
      
    const link_card = document.createElement("a");
    link_card.href = `/products/${product._id}`;
    link_card.className = "product-link-card";

    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.imageUrl}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>$${product.price}</strong>
    `;
      
    const menu = createMenuIcon(product);
    menu.style.display = "none";
    div.appendChild(menu);

    div.addEventListener("mouseenter", () => {  // Mostrar y ocultar el menú en hover
      menu.style.display = "flex";
    });
    div.addEventListener("mouseleave", () => {
      menu.style.display = "none";
    });

    
    link_card.appendChild(div);
    container.appendChild(link_card);
    });
  });

