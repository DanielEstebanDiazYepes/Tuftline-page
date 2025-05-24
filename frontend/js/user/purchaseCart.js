document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("product-item");
  const finalTotal = document.getElementById("final-total");

  try {
    // Obtener productos del carrito
    const res = await fetch("/api/cart", { credentials: "include" });
    const { cart } = await res.json();

    // Obtener datos del usuario
    const userRes = await fetch("/api/protected/user", { credentials: "include" });
    const user = await userRes.json();

    document.getElementById("user-address").value = user.address;
    document.getElementById("user-phone").value = user.phone;

    let total = 0;

    // Limpiar contenedor por si acaso
    productsContainer.innerHTML = "";

    // Mostrar productos y calcular total
    cart.forEach((product) => {
      total += product.price;

      const productDiv = document.createElement("div");
      productDiv.className = "product-cart-item";
      productDiv.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
        <span>${product.name}</span>
        <div class="product-details">
        <label>
          Uni
          <input type="number" id=""quantity" value="1" min="1"/>
        </label>
          <strong>$${product.price}</strong>
        </div>
      `;

      productsContainer.appendChild(productDiv);
    });

    finalTotal.textContent = `$${total}`;

    // Confirmar compra
    document.getElementById("confirm-button").addEventListener("click", async () => {
      const message = document.getElementById("message").value;

      const response = await fetch("/api/purchase/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart, message })
      });

      if (response.ok) {
        alert("¡Compra del carrito realizada con éxito!");
        window.location.href = "/";
      } else {
        alert("Error al confirmar la compra del carrito.");
      }
    });

    // Cancelar
    document.getElementById("cancel-button").addEventListener("click", () => {
      window.location.href = "/";
    });

  } catch (err) {
    alert("Error al cargar la información del carrito o usuario.");
    console.error(err);
  }
});
