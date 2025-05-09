const createMenuIcon = () => {
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


  favIcon.addEventListener("click", () => {//SE HACE LO MISMO QUE ARRIBA PERO CON EL ICONO DE FAVORITO
    const isDefault = favIcon.getAttribute("data-state") === "default";
    favIcon.textContent = isDefault ? "stars" : "star";
    favIcon.setAttribute("data-state", isDefault ? "on" : "default");
  });

  return menu;
};

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("/api/favorites", { credentials: "include" });
    const data = await res.json();

    const container = document.getElementById("favorites-container");
    data.favorites.forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${product.imageUrl}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <strong>$${product.price}</strong>
      `;
      
      const menu = createMenuIcon();
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

