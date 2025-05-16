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
  
  cartIcon.addEventListener("click", async () => { //EVENTO PARA ELIMINAR UN DE CARRITO
    try {
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

  return menu;
};

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();

    const container = document.getElementById("car-products-container");
    data.cart.forEach(product => { //LE PASAMOS EL PARAMETRO DE PRODUCTO A LA FUNCION PARA QUE PUEDA RECIBIR LA INFORMACION NECESARIA PARA ELIMINAR EL PRODUCTO
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

      container.appendChild(div);
    });
  });

