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
  
  cartIcon.addEventListener("click", () => { //CODIGO PARA CAMBIAR EL ICONO DEL CARRITO
    const isDefault = cartIcon.getAttribute("data-state") === "default"; // SE USA EL ATRIBUTO DATA-STATE PARA SABER SI EL ICONO ES DEFAULT O NO
    cartIcon.textContent = isDefault ? "shopping_cart_off" : "shopping_cart";//SI EL ATRIBUTO ES DEFAULT CAMBIA EL ICONO A shopping_cart_off Y SI NO CAMBIA A shopping_cart
    cartIcon.setAttribute("data-state", isDefault ? "off" : "default");
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

  favIcon.addEventListener("click", () => {//SE HACE LO MISMO QUE ARRIBA PERO CON EL ICONO DE FAVORITO
    const isDefault = favIcon.getAttribute("data-state") === "default";
    favIcon.textContent = isDefault ? "stars" : "star";
    favIcon.setAttribute("data-state", isDefault ? "on" : "default");
  });

  return menu;
};

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-container");

  try {
    const response = await fetch("/api/products");
    const productos = await response.json();

    productos.forEach(prod => {
      const div = document.createElement("div");//aqui craeamos el div para cada producto
      div.className = "product-card";
      div.innerHTML = `
        <img src="${prod.imageUrl}" alt="${prod.name}" />
        <h3>${prod.name}</h3>
        <p>${prod.description}</p>
        <strong>$${prod.price}</strong>
      `;

      const menu = createMenuIcon(prod);
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
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
});
