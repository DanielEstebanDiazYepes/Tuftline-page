const createMenuIcon = (prod) => {
  const menu = document.createElement("div");
  menu.className = "menu-icon";
  menu.innerHTML = `
    <div class="icon-cart">
      <span class="material-symbols-outlined" data-state="default">shopping_cart_off</span>
    </div>
    <div class="icon-favorite">
      <span class="material-symbols-outlined" data-state>stars</span>
    </div>
  `;

  const cartIcon = menu.querySelector(".icon-cart span");
  const favIcon = menu.querySelector(".icon-favorite span");
  
  cartIcon.addEventListener("click", async (e) => { //EVENTO PARA ELIMINAR UN DE CARRITO
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
    try {
      window.location.reload();
      console.log("Eliminando cart con ID:", prod._id);
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: prod._id }) 
      });
      console.log("Producto eliminado de carrito");
    } catch (err) {
      console.error("Error al eliminar de carrito:", err);
    }
  });

  favIcon.addEventListener("click", async (e) => { //EVENTO PARA AGREGAR A FAVORITOS
    e.stopPropagation(); // Evitar que el evento se propague al div padre
    e.preventDefault(); // Evitar el comportamiento por defecto del evento
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

  return menu;
};

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("/api/cart", { credentials: "include" });
  const data = await res.json();

  const container = document.getElementById("car-products-container");
  data.cart.forEach(product => { //LE PASAMOS EL PARAMETRO DE PRODUCTO A LA FUNCION PARA QUE PUEDA RECIBIR LA INFORMACION NECESARIA PARA ELIMINAR EL PRODUCTO

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

  //
  document.getElementById("buy-cart").addEventListener("click", () => {//CON ESTE EVEENTO HACEMOS QUE LOS ENVIEN TODOS LOS PRODUTOS DEL CARRITO
    window.location.href = "/pages/user/purchase-cart-page.html";//A LA PAGINA DE COMPRA
  });

  let isClearing = false; // CON ESTO EVITAMOS QUE SE ENVIEN VARIAS SOLICITUDES AL MISMO TIEMPO (ESO CAUSA QUE SE CONGELE LA PAGINA)
  document.getElementById("detele-car").addEventListener("click", async (e) => {
    e.preventDefault();
    if (isClearing) return;
    isClearing = true;

    if (confirm("¿Estás seguro de que deseas eliminar todo el carrito?")) {
      try {
        const res = await fetch("/api/cart/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          alert("Carrito eliminado correctamente.");
          window.location.reload();
        } else {
          alert("Error al eliminar el carrito.");
        }
      } catch (err) {
        console.error("Error al vaciar el carrito:", err);
        alert("Error inesperado al eliminar el carrito.");
      } finally {
        isClearing = false;
      }
    } else {
      isClearing = false;
    }
  });
});
