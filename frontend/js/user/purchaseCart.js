document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("product-item");
  const finalTotal = document.getElementById("final-total");

  try {
    const res = await fetch("/api/cart", { credentials: "include" });
    const { cart } = await res.json();

    const userRes = await fetch("/api/protected/user", { credentials: "include" });
    const user = await userRes.json();

    document.getElementById("user-address").value = user.address;
    document.getElementById("user-phone").value = user.phone;

    // Limpiar contenedor por si acaso
    productsContainer.innerHTML = "";

    // Guardamos referencias a los inputs y productos
    const productInputs = [];

    cart.forEach((product, index) => {
  const productDiv = document.createElement("div");
  productDiv.className = "product-cart-item";

const priceFormatted = product.price;

  productDiv.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
    <span>${product.name}</span>
    <div class="product-details">
      <label>
        Uni
        <input type="number" class="quantity-input" value="1" min="1" data-index="${index}" />
      </label>
      <strong class="product-total-price">$${priceFormatted}</strong>
    </div>
  `;

  const quantityInput = productDiv.querySelector(".quantity-input");
  const productPriceDisplay = productDiv.querySelector(".product-total-price");

  productsContainer.appendChild(productDiv);
  productInputs.push({ input: quantityInput, product, priceDisplay: productPriceDisplay });
});


    // Función para calcular total
    const calculateTotal = () => {
  let total = 0;
  productInputs.forEach(({ input, product, priceDisplay }) => {
    const quantity = parseInt(input.value) || 1;
    const subTotal = product.price * quantity;
    total += subTotal;

    // Actualizar el precio al lado del input
  priceDisplay.textContent = `$${subTotal}`;
  });

  finalTotal.textContent = `$${total}`;
};

    // Escuchar cambios en todos los inputs
    productInputs.forEach(({ input }) => {
      input.addEventListener("input", calculateTotal);
    });

    // Calcular total inicial
    calculateTotal();

    // Confirmar compra
    document.getElementById("confirm-button").addEventListener("click", async () => {
      const message = document.getElementById("message").value;

      // Crear nuevo array de productos con cantidad
      const updatedCart = productInputs.map(({ input, product }) => ({
        ...product,
        quantity: parseInt(input.value) || 1
      }));

      const response = await fetch("/api/purchase/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart: 
          updatedCart, 
          message,
          }),
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
