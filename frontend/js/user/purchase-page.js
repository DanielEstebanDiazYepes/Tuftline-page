async function loadPurchasePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (!productId) {
    alert("Producto no encontrado.");
    return;
  }

  try {
    // Obtener datos del producto
    const productRes = await fetch(`/api/products/${productId}`);//OBTENEMOS EL PRODUCTO POR SU ID
    const product = await productRes.json();

    // Obtener datos del usuario
    const userRes = await fetch("/api/protected/user", { //OBTENEMOS EL USUARIO AUTENTICADO
      credentials: "include"
    });
    const user = await userRes.json();

    // CARGAMOS LOS DATOS DEL PRODUCTO
    document.getElementById("product-image").src = product.imageUrl;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("total-price").textContent = `$${product.price}`;
    document.getElementById("final-total").textContent = `$${product.price}`;

    // CARGAMOS LOS DATOS DEL USUARIO
    document.getElementById("user-address").value = user.address;
    document.getElementById("user-phone").value = user.phone;

    // CARGAMOS LOS DATOS DEL FORMULARIO HACIENDO QUE SE ACTUALIZE EL PRECIO TOTAL
    const quantityInput = document.getElementById("quantity");
    quantityInput.addEventListener("input", () => {
      const quantity = parseInt(quantityInput.value);
      const total = quantity * product.price;
      document.getElementById("total-price").textContent = `$${total}`;
      document.getElementById("final-total").textContent = `$${total}`;
    });

    // Comprar
    document.getElementById("confirm-button").addEventListener("click", () => {
      alert("¡Compra realizada exitosamente! Gracias por tu pedido.");
      window.location.href = "/"; // Redirige al home
    });

    // Cancelar
    document.getElementById("cancel-button").addEventListener("click", () => {
      window.location.href = "/";
    });

  } catch (err) {
    console.error("Error al cargar la página de compra:", err);
    alert("Hubo un error cargando el producto o usuario.");
  }
}

document.addEventListener("DOMContentLoaded", loadPurchasePage);
