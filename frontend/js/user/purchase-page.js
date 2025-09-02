async function loadPurchasePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (!productId) {
    alert("Producto no encontrado.");
    return;
  }

  try {
    const productRes = await fetch(`/api/products/${productId}`);//OBTENEMOS EL PRODUCTO POR SU ID USANDO LA API    
    const product = await productRes.json();

    const userRes = await fetch("/api/protected/user", { //OBTENEMOS EL USUARIO AUTENTICADO
      credentials: "include"
    });
    const user = await userRes.json();

    // CARGAMOS LOS DATOS DEL PRODUCTO
    document.getElementById("product-image").src = product.imageUrl;
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("total-price").textContent = `$${product.price}`;
    document.getElementById("final-total").textContent = `$${product.price}`;

    if(!user || !user.email) {// CREAMOS UN IF RAPIDO DONDE SI EL USUARIO NO ESTA LOGEADO LO MANDA A INICIAR SESION
      Swal.fire({
        title: "INICIE SESION",
        text: "Debes iniciar sesión para seguir con la compra",
        icon: "warning",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
        window.location.href = "/pages/auth/login.html"; // Cambia por la ruta de tu login
        }
        });
        return;
    }else{// CARGAMOS LOS DATOS DEL USUARIO EN EL FORMULARIO SI SE CUMPLE LA CONDICION
    document.getElementById("user-address").value = user.address;
    document.getElementById("user-phone").value = user.phone;
    }

    // CARGAMOS LOS DATOS DEL FORMULARIO HACIENDO QUE SE ACTUALIZE EL PRECIO TOTAL
    const quantityInput = document.getElementById("quantity");
    quantityInput.addEventListener("input", () => {
      const quantity = parseInt(quantityInput.value);
      const total = quantity * product.price;
      document.getElementById("total-price").textContent = `$${total}`;
      document.getElementById("final-total").textContent = `$${total}`;
    });

    // Comprar
    document.getElementById("confirm-button").addEventListener("click", async (e) => {
  const confirmButton = e.target;
  confirmButton.disabled = true; // Evita múltiples clics

  const quantity = parseInt(document.getElementById("quantity").value);
  const message = document.getElementById("message").value;

  try {
    const response = await fetch("/api/purchase/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        product,
        quantity,
        message,
      }),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Compra Exitosa",
        text:"¡Compra realizada exitosamente! Se ha enviado la factura de compra a tu correo.",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/index.html"; // Redirige a la página principal
        }
      });
      return; 
    } else {
      alert("Ocurrió un error al confirmar tu compra.");
    }
  } catch (err) {
    console.error("Error al confirmar compra:", err);
    alert("Error de red o del servidor.");
  } finally {
    confirmButton.disabled = false; // Vuelve a habilitar si ocurre un error
  }
});



    // Cancelar
    document.getElementById("cancel-button").addEventListener("click", () => {
      window.location.href = "/index.html";
    });

  } catch (err) {
    console.error("Error al cargar la página de compra:", err);
    alert("Hubo un error cargando el producto o usuario.");
  }
}

document.addEventListener("DOMContentLoaded", loadPurchasePage);
